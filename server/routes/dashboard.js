const express = require('express');
const { getMedications } = require('../models/Medication');
const { getPharmacies } = require('../models/Pharmacy');
const { getPrices } = require('../models/Price');

const router = express.Router();

// Get dashboard statistics
router.get('/stats', (req, res) => {
  try {
    const medications = getMedications();
    const pharmacies = getPharmacies();
    const prices = getPrices();
    
    const availablePrices = prices.filter(price => price.isAvailable);
    const averagePrice = availablePrices.length > 0 
      ? availablePrices.reduce((sum, price) => sum + price.price, 0) / availablePrices.length 
      : 0;

    const stats = {
      totalMedications: medications.length,
      totalPharmacies: pharmacies.length,
      averagePrice: Number(averagePrice.toFixed(2)),
      totalSearches: Math.floor(Math.random() * 1000) + 500, // Mock data
      priceDropAlerts: Math.floor(Math.random() * 50) + 10,
      stockAlerts: Math.floor(Math.random() * 30) + 5
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

// Get price trends
router.get('/price-trends', (req, res) => {
  try {
    const medications = getMedications();
    const prices = getPrices();
    
    // Generate mock price trends
    const trends = medications.slice(0, 5).map(med => {
      const medPrices = prices.filter(p => p.medicationId === med.id);
      const averagePrice = medPrices.length > 0 
        ? medPrices.reduce((sum, p) => sum + p.price, 0) / medPrices.length 
        : 0;
      
      return {
        name: med.name,
        averagePrice: Number(averagePrice.toFixed(2)),
        change: Math.floor(Math.random() * 20) - 10 // Random change between -10% to +10%
      };
    });

    res.json(trends);
  } catch (error) {
    console.error('Error fetching price trends:', error);
    res.status(500).json({ error: 'Failed to fetch price trends' });
  }
});

// Get popular medications
router.get('/popular-medications', (req, res) => {
  try {
    const medications = getMedications();
    const prices = getPrices();
    
    // Generate mock popular medications data
    const popular = medications.slice(0, 5).map((med, index) => {
      const medPrices = prices.filter(p => p.medicationId === med.id);
      const avgPrice = medPrices.length > 0 
        ? medPrices.reduce((sum, p) => sum + p.price, 0) / medPrices.length 
        : 0;
      
      return {
        name: med.name,
        searches: Math.floor(Math.random() * 500) + 100,
        avgPrice: Number(avgPrice.toFixed(2))
      };
    }).sort((a, b) => b.searches - a.searches);

    res.json(popular);
  } catch (error) {
    console.error('Error fetching popular medications:', error);
    res.status(500).json({ error: 'Failed to fetch popular medications' });
  }
});

// Get top pharmacies
router.get('/top-pharmacies', (req, res) => {
  try {
    const pharmacies = getPharmacies();
    const prices = getPrices();
    
    // Generate mock top pharmacies data
    const topPharmacies = pharmacies.map(pharmacy => {
      const pharmacyPrices = prices.filter(p => p.pharmacyId === pharmacy.id);
      const avgPrice = pharmacyPrices.length > 0 
        ? pharmacyPrices.reduce((sum, p) => sum + p.price, 0) / pharmacyPrices.length 
        : 0;
      
      const totalStock = pharmacyPrices.reduce((sum, p) => sum + p.stock, 0);
      const maxPossibleStock = pharmacyPrices.length * 200; // Assume max 200 per medication
      const stockLevel = maxPossibleStock > 0 ? Math.floor((totalStock / maxPossibleStock) * 100) : 0;
      
      return {
        ...pharmacy,
        avgPrice: Number(avgPrice.toFixed(2)),
        stockLevel: Math.min(100, stockLevel + Math.floor(Math.random() * 20)) // Add some randomness
      };
    }).sort((a, b) => b.rating - a.rating);

    res.json(topPharmacies);
  } catch (error) {
    console.error('Error fetching top pharmacies:', error);
    res.status(500).json({ error: 'Failed to fetch top pharmacies' });
  }
});

module.exports = router;