const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/auth');
const { AttendanceLog, Employee, User } = require('../models');

router.use(verifyToken);

// ==========================================
// 1. GET ALL ATTENDANCE LOGS
// ==========================================
router.get('/', checkRole(['Super Admin', 'HR Manager', 'Manager', 'Finance Auditor']), async (req, res) => {
  const { date, status } = req.query;
  const where = {};
  if (date) where.date = date;
  if (status) where.status = status;

  try {
    const logs = await AttendanceLog.findAll({
      where,
      include: [{ model: Employee, include: [User] }],
      order: [['date', 'DESC']]
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attendance database.' });
  }
});

// ==========================================
// 2. GET SINGLE EMPLOYEE HISTORY
// ==========================================
router.get('/:employeeId', async (req, res) => {
  try {
    const logs = await AttendanceLog.findAll({
      where: { employee_id: req.params.employeeId },
      order: [['date', 'DESC']]
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve attendance history.' });
  }
});

// ==========================================
// 3. CHECK-IN ENDPOINT (QR / GPS / Face checkin)
// ==========================================
router.post('/checkin', async (req, res) => {
  const { employee_id, method, location_lat, location_lng } = req.body;
  if (!employee_id || !method) {
    return res.status(400).json({ error: 'Employee ID and method (QR/Face/GPS/Manual) are required.' });
  }

  const todayStr = new Date().toISOString().split('T')[0];

  try {
    // Check if check-in already exists
    const existing = await AttendanceLog.findOne({
      where: { employee_id, date: todayStr }
    });

    if (existing && existing.check_in) {
      return res.status(400).json({ error: 'Employee has already checked in for today.' });
    }

    const checkInTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let log;
    if (existing) {
      existing.check_in = checkInTime;
      existing.method = method;
      existing.location_lat = location_lat;
      existing.location_lng = location_lng;
      existing.status = 'present';
      await existing.save();
      log = existing;
    } else {
      log = await AttendanceLog.create({
        employee_id,
        date: todayStr,
        check_in: checkInTime,
        method,
        location_lat,
        location_lng,
        status: 'present'
      });
    }

    // Trigger websocket event for live dashboards
    const io = global.io;
    if (io) {
      io.emit('attendance_update', {
        employee_id,
        date: todayStr,
        check_in: checkInTime,
        status: 'present'
      });
    }

    res.status(201).json({ success: true, message: 'Check-in recorded successfully.', log });

  } catch (error) {
    console.error('Checkin error:', error);
    res.status(500).json({ error: 'Failed to record check-in.' });
  }
});

// ==========================================
// 4. CHECK-OUT ENDPOINT
// ==========================================
router.post('/checkout', async (req, res) => {
  const { employee_id } = req.body;
  if (!employee_id) {
    return res.status(400).json({ error: 'Employee ID is required.' });
  }

  const todayStr = new Date().toISOString().split('T')[0];

  try {
    const log = await AttendanceLog.findOne({
      where: { employee_id, date: todayStr }
    });

    if (!log || !log.check_in) {
      return res.status(400).json({ error: 'No check-in record found for today. Check-in first.' });
    }

    const checkOutTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Calculate hours worked
    const [inHours, inMins, inPeriod] = parseTime(log.check_in);
    const [outHours, outMins, outPeriod] = parseTime(checkOutTime);
    
    const in24 = to24Hour(inHours, inMins, inPeriod);
    const out24 = to24Hour(outHours, outMins, outPeriod);

    let worked = out24 - in24;
    if (worked < 0) worked = 0; // Negative guard

    log.check_out = checkOutTime;
    log.hours_worked = parseFloat(worked.toFixed(2));
    
    // Overtime over 8 hours
    if (worked > 8.00) {
      log.overtime_hours = parseFloat((worked - 8.00).toFixed(2));
    }

    await log.save();

    res.json({ success: true, message: 'Check-out recorded successfully.', log });

  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Failed to record check-out.' });
  }
});

// Helpers
function parseTime(timeStr) {
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return [9, 0, 'AM'];
  return [parseInt(match[1]), parseInt(match[2]), match[3].toUpperCase()];
}

function to24Hour(hours, minutes, period) {
  let h = hours;
  if (period === 'PM' && hours !== 12) h += 12;
  if (period === 'AM' && hours === 12) h = 0;
  return h + (minutes / 60);
}

module.exports = router;
