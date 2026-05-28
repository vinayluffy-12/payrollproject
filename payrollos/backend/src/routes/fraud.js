const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/auth');
const { FraudAlert, Employee, User, PayrollRun } = require('../models');

router.use(verifyToken);

// ==========================================
// 1. GET ALL FRAUD ALERTS
// ==========================================
router.get('/', checkRole(['Super Admin', 'Payroll Admin', 'Finance Auditor']), async (req, res) => {
  try {
    const alerts = await FraudAlert.findAll({
      include: [
        { model: Employee, include: [User] },
        { model: PayrollRun }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch fraud alerts database.' });
  }
});

// ==========================================
// 2. INVESTIGATE FRAUD ALERT
// ==========================================
router.post('/:id/investigate', checkRole(['Super Admin', 'Payroll Admin']), async (req, res) => {
  try {
    const alert = await FraudAlert.findByPk(req.params.id);
    if (!alert) return res.status(404).json({ error: 'Fraud alert record not found.' });

    alert.status = 'investigating';
    await alert.save();

    res.json({ success: true, message: 'Fraud alert status updated to investigating.', alert });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update fraud alert.' });
  }
});

// ==========================================
// 3. RESOLVE FRAUD ALERT (Override or mark False Positive)
// ==========================================
router.put('/:id/resolve', checkRole(['Super Admin', 'Payroll Admin']), async (req, res) => {
  const { decision, notes } = req.body;
  if (!decision) {
    return res.status(400).json({ error: 'Provide a resolution decision (resolved / false_positive).' });
  }

  try {
    const alert = await FraudAlert.findByPk(req.params.id);
    if (!alert) return res.status(404).json({ error: 'Fraud alert record not found.' });

    alert.status = decision;
    alert.resolved_by = req.user.id;
    alert.resolution_notes = notes || 'Manually validated and cleared by Administrator.';
    await alert.save();

    res.json({ success: true, message: 'Fraud alert successfully resolved.', alert });

  } catch (error) {
    console.error('Fraud resolution error:', error);
    res.status(500).json({ error: 'Failed to resolve fraud alert.' });
  }
});

module.exports = router;
