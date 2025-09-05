const express = require('express');
const { getPrices, updatePrice, findPricesByMedication } = require('../models/Price');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get price history for a medication
router.get('/history/:medicationId', (req, res) => {
  try {
    const prices = findPricesByMedication(req.params.medicationId);
    res.json(prices);
  } catch (error) {
    console.error('Error fetching price history:', error);
    res.status(500).json({ error: 'Failed to fetch price history' });
  }
});

// Update/create price (pharmacy manager or admin)
router.post('/', authenticate, requireRole(['admin', 'pharmacy_manager']), (req, res) => {
  try {
    const { medicationId, pharmacyId, price, stock } = req.body;

    // Validate required fields
    if (!medicationId || !pharmacyId || price === undefined || stock === undefined) {
      return res.status(400).json({ 
        error: 'medicationId, pharmacyId, price, and stock are required' 
      });
    }

    // Check permissions for pharmacy managers
    if (req.user.role === 'pharmacy_manager' && req.user.pharmacyId !== pharmacyId) {
      return res.status(403).json({ error: 'Can only update prices for your own pharmacy' });
    }

    const updatedPrice = updatePrice(medicationId, pharmacyId, { price, stock });
    res.json(updatedPrice);
  } catch (error) {
    console.error('Error updating price:', error);
    res.status(500).json({ error: 'Failed to update price' });
  }
});

// Get all prices (admin only)
router.get('/', authenticate, requireRole(['admin']), (req, res) => {
  try {
    const prices = getPrices();
    res.json(prices);
  } catch (error) {
    console.error('Error fetching prices:', error);
    res.status(500).json({ error: 'Failed to fetch prices' });
  }
});

module.exports = router;