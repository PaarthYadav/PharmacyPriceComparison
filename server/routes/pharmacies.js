const express = require('express');
const { getPharmacies, createPharmacy, updatePharmacy, findPharmacyById } = require('../models/Pharmacy');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all pharmacies
router.get('/', (req, res) => {
  try {
    const pharmacies = getPharmacies();
    res.json(pharmacies);
  } catch (error) {
    console.error('Error fetching pharmacies:', error);
    res.status(500).json({ error: 'Failed to fetch pharmacies' });
  }
});

// Get pharmacy by ID
router.get('/:id', (req, res) => {
  try {
    const pharmacy = findPharmacyById(req.params.id);
    if (!pharmacy) {
      return res.status(404).json({ error: 'Pharmacy not found' });
    }
    res.json(pharmacy);
  } catch (error) {
    console.error('Error fetching pharmacy:', error);
    res.status(500).json({ error: 'Failed to fetch pharmacy' });
  }
});

// Create new pharmacy (admin only)
router.post('/', authenticate, requireRole(['admin']), (req, res) => {
  try {
    const pharmacy = createPharmacy(req.body);
    res.status(201).json(pharmacy);
  } catch (error) {
    console.error('Error creating pharmacy:', error);
    res.status(500).json({ error: 'Failed to create pharmacy' });
  }
});

// Update pharmacy (admin or pharmacy manager)
router.patch('/:id', authenticate, (req, res) => {
  try {
    // Check permissions
    const pharmacy = findPharmacyById(req.params.id);
    if (!pharmacy) {
      return res.status(404).json({ error: 'Pharmacy not found' });
    }

    // Admin can update any pharmacy, pharmacy managers can only update their own
    if (req.user.role !== 'admin' && 
        (req.user.role !== 'pharmacy_manager' || req.user.pharmacyId !== req.params.id)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    const updatedPharmacy = updatePharmacy(req.params.id, req.body);
    res.json(updatedPharmacy);
  } catch (error) {
    console.error('Error updating pharmacy:', error);
    res.status(500).json({ error: 'Failed to update pharmacy' });
  }
});

module.exports = router;