const express = require('express');
const { getMedications, searchMedications, createMedication } = require('../models/Medication');
const { getPharmacies } = require('../models/Pharmacy');
const { getPrices, filterPrices } = require('../models/Price');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// Search medications with prices and pharmacy info
router.get('/search', (req, res) => {
  try {
    const { q: query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    // Parse filters from query params
    const filters = {
      priceRange: req.query.priceRange ? JSON.parse(req.query.priceRange) : null,
      maxDistance: req.query.maxDistance ? Number(req.query.maxDistance) : null,
      availableOnly: req.query.availableOnly === 'true',
      sortBy: req.query.sortBy || 'price',
      category: req.query.category
    };

    // Search medications
    const medications = searchMedications(query, filters);
    
    if (medications.length === 0) {
      return res.json({ medications: [], prices: [], pharmacies: [] });
    }

    // Get all prices for found medications
    const allPrices = getPrices();
    const medicationIds = medications.map(med => med.id);
    let relevantPrices = allPrices.filter(price => 
      medicationIds.includes(price.medicationId)
    );

    // Apply price filters
    relevantPrices = filterPrices(relevantPrices, filters);

    // Get pharmacies for the prices
    const pharmacyIds = [...new Set(relevantPrices.map(price => price.pharmacyId))];
    const allPharmacies = getPharmacies();
    let relevantPharmacies = allPharmacies.filter(pharmacy => 
      pharmacyIds.includes(pharmacy.id)
    );

    // Add mock distance data for demo
    relevantPharmacies = relevantPharmacies.map(pharmacy => ({
      ...pharmacy,
      distance: Math.random() * 20 + 1 // Mock distance between 1-21 miles
    }));

    // Filter by distance if specified
    if (filters.maxDistance) {
      relevantPharmacies = relevantPharmacies.filter(pharmacy => 
        pharmacy.distance <= filters.maxDistance
      );
      
      // Remove prices for filtered out pharmacies
      const validPharmacyIds = relevantPharmacies.map(p => p.id);
      relevantPrices = relevantPrices.filter(price => 
        validPharmacyIds.includes(price.pharmacyId)
      );
    }

    // Sort pharmacies by distance if requested
    if (filters.sortBy === 'distance') {
      relevantPharmacies.sort((a, b) => a.distance - b.distance);
    } else if (filters.sortBy === 'rating') {
      relevantPharmacies.sort((a, b) => b.rating - a.rating);
    }

    res.json({
      medications,
      prices: relevantPrices,
      pharmacies: relevantPharmacies
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Get all medications
router.get('/', (req, res) => {
  try {
    const medications = getMedications();
    res.json(medications);
  } catch (error) {
    console.error('Error fetching medications:', error);
    res.status(500).json({ error: 'Failed to fetch medications' });
  }
});

// Create new medication (admin only)
router.post('/', authenticate, requireRole(['admin']), (req, res) => {
  try {
    const medication = createMedication(req.body);
    res.status(201).json(medication);
  } catch (error) {
    console.error('Error creating medication:', error);
    res.status(500).json({ error: 'Failed to create medication' });
  }
});

module.exports = router;