const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/auth');
const { FxRateSnapshot } = require('../models');

router.use(verifyToken);

// Cached Currency List
const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.000000, last_updated: 'Just now', status: 'enabled' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 83.452300, last_updated: '60 min ago', status: 'enabled' },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.923400, last_updated: '60 min ago', status: 'enabled' },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.785400, last_updated: '60 min ago', status: 'enabled' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', rate: 3.672500, last_updated: '60 min ago', status: 'enabled' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'ر.س', rate: 3.750800, last_updated: '60 min ago', status: 'enabled' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 156.420000, last_updated: '60 min ago', status: 'disabled' }
];

// ==========================================
// 1. GET ALL SUPPORTED CURRENCIES
// ==========================================
router.get('/', async (req, res) => {
  res.json(CURRENCIES);
});

// ==========================================
// 2. GET RATES SNAPSHOT
// ==========================================
router.get('/rates', async (req, res) => {
  try {
    const list = await FxRateSnapshot.findAll({
      limit: 50,
      order: [['created_at', 'DESC']]
    });
    res.json(list.length > 0 ? list : CURRENCIES);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch FX snapshots.' });
  }
});

// ==========================================
// 3. UPDATE / OVERRIDE CURRENCY RATE (Admin)
// ==========================================
router.put('/:code', checkRole(['Super Admin']), async (req, res) => {
  const { code } = req.params;
  const { rate, status } = req.body;

  const currency = CURRENCIES.find(c => c.code === code);
  if (!currency) {
    return res.status(404).json({ error: 'Currency code not supported.' });
  }

  if (rate) {
    currency.rate = parseFloat(rate);
    currency.last_updated = 'Manually Overridden';
    
    // Save to historical audit snaps
    try {
      await FxRateSnapshot.create({
        from_currency: 'USD',
        to_currency: code,
        rate: parseFloat(rate),
        source: 'Admin Override'
      });
    } catch (err) {
      console.warn('Failed to snapshot manual override in DB.');
    }
  }

  if (status) {
    currency.status = status;
  }

  res.json({ success: true, message: `Currency ${code} parameters updated.`, currency });
});

module.exports = router;
