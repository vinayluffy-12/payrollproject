const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/auth');
const { LeaveRequest, LeaveBalance, Employee, User } = require('../models');

router.use(verifyToken);

// ==========================================
// 1. GET ALL LEAVES
// ==========================================
router.get('/', checkRole(['Super Admin', 'HR Manager', 'Manager', 'Finance Auditor']), async (req, res) => {
  const { status, leave_type } = req.query;
  const where = {};
  if (status) where.status = status;
  if (leave_type) where.leave_type = leave_type;

  try {
    const list = await LeaveRequest.findAll({
      where,
      include: [{ model: Employee, include: [User] }],
      order: [['created_at', 'DESC']]
    });
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leave requests.' });
  }
});

// ==========================================
// 2. SUBMIT LEAVE REQUEST (Employee)
// ==========================================
router.post('/', async (req, res) => {
  const { employee_id, leave_type, from_date, to_date, reason } = req.body;

  if (!employee_id || !leave_type || !from_date || !to_date) {
    return res.status(400).json({ error: 'Missing required leave fields.' });
  }

  try {
    // Check if leave balance is sufficient
    const balance = await LeaveBalance.findOne({
      where: { employee_id, leave_type, year: new Date().getFullYear() }
    });

    // Calculate days between
    const start = new Date(from_date);
    const end = new Date(to_date);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    if (balance && balance.remaining < diffDays) {
      return res.status(400).json({
        error: `Insufficient leave balance. You have ${balance.remaining} days remaining for ${leave_type}, but requested ${diffDays} days.`
      });
    }

    const request = await LeaveRequest.create({
      employee_id,
      leave_type,
      from_date,
      to_date,
      days: diffDays,
      reason,
      status: 'pending'
    });

    res.status(201).json({ success: true, message: 'Leave request submitted successfully.', request });

  } catch (error) {
    console.error('Leave submission error:', error);
    res.status(500).json({ error: 'Failed to submit leave request.' });
  }
});

// ==========================================
// 3. APPROVE LEAVE (HR Manager / Manager / Admin)
// ==========================================
router.put('/:id/approve', checkRole(['Super Admin', 'HR Manager', 'Manager']), async (req, res) => {
  const { notes } = req.body;

  try {
    const leave = await LeaveRequest.findByPk(req.params.id);
    if (!leave) return res.status(404).json({ error: 'Leave request not found.' });

    if (leave.status !== 'pending') {
      return res.status(400).json({ error: 'Leave request has already been processed.' });
    }

    // Load balance
    const balance = await LeaveBalance.findOne({
      where: { employee_id: leave.employee_id, leave_type: leave.leave_type, year: new Date().getFullYear() }
    });

    if (balance) {
      balance.used += leave.days;
      balance.remaining = balance.entitled - balance.used;
      await balance.save();
    }

    leave.status = 'approved';
    leave.reviewed_by = req.user.id;
    leave.reviewed_at = new Date();
    leave.notes = notes || 'Approved';
    await leave.save();

    res.json({ success: true, message: 'Leave request approved.', leave });

  } catch (error) {
    console.error('Leave approval error:', error);
    res.status(500).json({ error: 'Failed to approve leave request.' });
  }
});

// ==========================================
// 4. REJECT LEAVE
// ==========================================
router.put('/:id/reject', checkRole(['Super Admin', 'HR Manager', 'Manager']), async (req, res) => {
  const { notes } = req.body;

  try {
    const leave = await LeaveRequest.findByPk(req.params.id);
    if (!leave) return res.status(404).json({ error: 'Leave request not found.' });

    if (leave.status !== 'pending') {
      return res.status(400).json({ error: 'Leave request has already been processed.' });
    }

    leave.status = 'rejected';
    leave.reviewed_by = req.user.id;
    leave.reviewed_at = new Date();
    leave.notes = notes || 'Rejected';
    await leave.save();

    res.json({ success: true, message: 'Leave request rejected.', leave });

  } catch (error) {
    res.status(500).json({ error: 'Failed to reject leave request.' });
  }
});

module.exports = router;
