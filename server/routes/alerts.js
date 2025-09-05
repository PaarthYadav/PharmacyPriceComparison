const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const alertsFile = path.join(__dirname, '../data/alerts.json');

// Initialize alerts file
if (!fs.existsSync(alertsFile)) {
  fs.writeFileSync(alertsFile, JSON.stringify([], null, 2));
}

const getAlerts = () => {
  try {
    return JSON.parse(fs.readFileSync(alertsFile, 'utf8'));
  } catch (error) {
    console.error('Error reading alerts file:', error);
    return [];
  }
};

const saveAlerts = (alerts) => {
  try {
    fs.writeFileSync(alertsFile, JSON.stringify(alerts, null, 2));
  } catch (error) {
    console.error('Error saving alerts:', error);
  }
};

// Get user's alerts
router.get('/', (req, res) => {
  try {
    const alerts = getAlerts();
    const userAlerts = alerts.filter(alert => alert.userId === req.user.id);
    res.json(userAlerts);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// Create new alert
router.post('/', (req, res) => {
  try {
    const { medicationId, targetPrice } = req.body;
    
    if (!medicationId || targetPrice === undefined) {
      return res.status(400).json({ error: 'medicationId and targetPrice are required' });
    }

    const alerts = getAlerts();
    const newAlert = {
      id: (alerts.length + 1).toString(),
      userId: req.user.id,
      medicationId,
      targetPrice,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    alerts.push(newAlert);
    saveAlerts(alerts);
    res.status(201).json(newAlert);
  } catch (error) {
    console.error('Error creating alert:', error);
    res.status(500).json({ error: 'Failed to create alert' });
  }
});

// Delete alert
router.delete('/:id', (req, res) => {
  try {
    const alerts = getAlerts();
    const alertIndex = alerts.findIndex(alert => 
      alert.id === req.params.id && alert.userId === req.user.id
    );

    if (alertIndex === -1) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    alerts.splice(alertIndex, 1);
    saveAlerts(alerts);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting alert:', error);
    res.status(500).json({ error: 'Failed to delete alert' });
  }
});

// Toggle alert active status
router.patch('/:id', (req, res) => {
  try {
    const alerts = getAlerts();
    const alertIndex = alerts.findIndex(alert => 
      alert.id === req.params.id && alert.userId === req.user.id
    );

    if (alertIndex === -1) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    alerts[alertIndex] = { ...alerts[alertIndex], ...req.body };
    saveAlerts(alerts);
    res.json(alerts[alertIndex]);
  } catch (error) {
    console.error('Error updating alert:', error);
    res.status(500).json({ error: 'Failed to update alert' });
  }
});

module.exports = router;