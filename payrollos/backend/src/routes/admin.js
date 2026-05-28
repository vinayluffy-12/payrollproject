const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/auth');
const { User, VerificationRequest, AuditLog, Employee } = require('../models');

router.use(verifyToken);

// ==========================================
// 1. GET KYC VERIFICATION QUEUE (Admin)
// ==========================================
router.get('/verification-queue', checkRole(['Super Admin', 'HR Manager']), async (req, res) => {
  try {
    const list = await VerificationRequest.findAll({
      include: [{ model: User, attributes: ['id', 'full_name', 'email', 'phone', 'role', 'status'] }],
      order: [['created_at', 'DESC']]
    });
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve verification queue.' });
  }
});

// ==========================================
// 2. VERIFY / DECIDE ON KYC REQUEST (Admin)
// ==========================================
router.put('/verify/:requestId', checkRole(['Super Admin', 'HR Manager']), async (req, res) => {
  const { decision, reason } = req.body;
  if (!decision || !['accepted', 'rejected'].includes(decision)) {
    return res.status(400).json({ error: 'Provide a valid decision (accepted / rejected).' });
  }

  try {
    const request = await VerificationRequest.findByPk(req.params.requestId);
    if (!request) return res.status(404).json({ error: 'KYC request not found.' });

    request.decision = decision;
    request.reason = reason || 'KYC document verification matches standard policies.';
    request.admin_id = req.user.id;
    request.decided_at = new Date();
    await request.save();

    // Update target User status
    const targetUser = await User.findByPk(request.user_id);
    if (targetUser) {
      targetUser.status = decision === 'accepted' ? 'active' : 'rejected';
      await targetUser.save();
    }

    // Write to audit trail
    await AuditLog.create({
      company_id: 1,
      actor_id: req.user.id,
      action: `kyc_${decision}`,
      entity: 'VerificationRequest',
      entity_id: request.id,
      old_value: 'pending',
      new_value: decision,
      ip_address: req.ip || '127.0.0.1',
      user_agent: req.headers['user-agent']
    });

    res.json({
      success: true,
      message: `KYC request has been ${decision} successfully. User status adjusted.`,
      request
    });

  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ error: 'Failed to process verification decision.' });
  }
});

// ==========================================
// 3. GET IMMUTABLE AUDIT LOGS
// ==========================================
router.get('/audit-logs', checkRole(['Super Admin', 'Finance Auditor']), async (req, res) => {
  try {
    const logs = await AuditLog.findAll({
      order: [['created_at', 'DESC']],
      limit: 100
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audit trails.' });
  }
});

// ==========================================
// 4. GET SYSTEM HEALTH & METRICS
// ==========================================
router.get('/system-health', checkRole(['Super Admin']), async (req, res) => {
  try {
    const totalUsers = await User.count();
    const activeEmployees = await Employee.count({ where: { status: 'active' } });
    const pendingKyc = await VerificationRequest.count({ where: { decision: 'pending' } });

    res.json({
      uptime_seconds: process.uptime(),
      memory_usage: process.memoryUsage(),
      database_state: 'connected',
      metrics: {
        total_registered_users: totalUsers,
        active_staff_headcount: activeEmployees,
        pending_kyc_reviews: pendingKyc
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to compile system metrics.' });
  }
});

module.exports = router;
