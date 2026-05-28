const express = require('express');
const router = express.Router();
const axios = require('axios');
const { verifyToken, checkRole } = require('../middleware/auth');
const { PayrollRun, PayrollItem, Employee, User, SalaryComponent, Wallet, WalletTransaction, AttendanceLog, LeaveRequest, FraudAlert } = require('../models');

router.use(verifyToken);

// ==========================================
// 1. GET ALL RUNS
// ==========================================
router.get('/runs', checkRole(['Super Admin', 'HR Manager', 'Payroll Admin', 'Finance Auditor']), async (req, res) => {
  try {
    const runs = await PayrollRun.findAll({
      order: [['created_at', 'DESC']]
    });
    res.json(runs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payroll history.' });
  }
});

// ==========================================
// 2. INITIATE PAYROLL RUN (Step 1)
// ==========================================
router.post('/runs', checkRole(['Super Admin', 'Payroll Admin']), async (req, res) => {
  const { period_start, period_end } = req.body;
  if (!period_start || !period_end) {
    return res.status(400).json({ error: 'Start date and End date are required.' });
  }

  try {
    const run = await PayrollRun.create({
      company_id: 1,
      period_start,
      period_end,
      status: 'draft',
      run_by: req.user.id
    });

    res.status(201).json({ success: true, message: 'Payroll run initialized', run });
  } catch (error) {
    console.error('Failed to init payroll run:', error);
    res.status(500).json({ error: 'Failed to initiate payroll run.' });
  }
});

// ==========================================
// 3. GET SINGLE RUN DETAILS (Step 2 - Aggregate View)
// ==========================================
router.get('/runs/:id', async (req, res) => {
  try {
    const run = await PayrollRun.findByPk(req.params.id);
    if (!run) return res.status(404).json({ error: 'Payroll run not found.' });

    const items = await PayrollItem.findAll({
      where: { payroll_run_id: run.id },
      include: [{ model: Employee, include: [User] }]
    });

    res.json({ run, items });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payroll run details.' });
  }
});

// ==========================================
// 4. CALCULATE TAX ENGINE (Step 3)
// ==========================================
router.post('/runs/:id/calculate', checkRole(['Super Admin', 'Payroll Admin']), async (req, res) => {
  const { id } = req.params;

  try {
    const run = await PayrollRun.findByPk(id);
    if (!run) return res.status(404).json({ error: 'Payroll run not found.' });

    // Find all active employees
    const employees = await Employee.findAll({
      where: { status: 'active' },
      include: [SalaryComponent, User]
    });

    let totalGross = 0;
    let totalDeductions = 0;
    let totalNet = 0;
    let totalTax = 0;

    // Delete existing items for this run first (if recalculating)
    await PayrollItem.destroy({ where: { payroll_run_id: run.id } });

    for (const emp of employees) {
      const sal = emp.SalaryComponent || { basic: 0, hra: 0, special_allowance: 0, performance_bonus: 0, tds: 0, pf_employee: 0, pf_employer: 0, esi: 0, prof_tax: 0, other_deductions: 0 };
      
      const basicVal = parseFloat(sal.basic || 0);
      const hraVal = parseFloat(sal.hra || 0);
      const allowVal = parseFloat(sal.special_allowance || 0);
      const bonusVal = parseFloat(sal.performance_bonus || 0);
      
      // Auto-pull overtime hours
      const overtimeLogs = await AttendanceLog.findAll({
        where: { employee_id: emp.id, status: 'present' }
      });
      const totalOtHours = overtimeLogs.reduce((sum, log) => sum + parseFloat(log.overtime_hours || 0), 0);
      const hourlyRate = (basicVal / 160); // 160 std hours/mo
      const overtimePay = totalOtHours * hourlyRate * 1.5; // 1.5x multiplier

      const gross = basicVal + hraVal + allowVal + bonusVal + overtimePay;

      // Statutory deductions
      const tds = parseFloat(sal.tds || 0);
      const pfEmp = parseFloat(sal.pf_employee || 0);
      const pfEr = parseFloat(sal.pf_employer || 0);
      const esi = parseFloat(sal.esi || 0);
      const profTax = parseFloat(sal.prof_tax || 0);
      const otherDeductions = parseFloat(sal.other_deductions || 0);

      const deductions = tds + pfEmp + esi + profTax + otherDeductions;
      const net = gross - deductions;

      totalGross += gross;
      totalDeductions += deductions;
      totalNet += net;
      totalTax += tds;

      await PayrollItem.create({
        payroll_run_id: run.id,
        employee_id: emp.id,
        gross,
        basic: basicVal,
        hra: hraVal,
        allowances: allowVal,
        bonus: bonusVal,
        overtime_pay: overtimePay,
        tds,
        pf_employee: pfEmp,
        pf_employer: pfEr,
        esi,
        prof_tax: profTax,
        other_deductions: otherDeductions,
        net,
        currency: emp.salary_currency || 'USD',
        fx_rate: 1.0,
        payslip_pdf_url: `https://payrollos.com/payslips/pdf_draft_${run.id}_${emp.id}.pdf`
      });
    }

    // Update run totals
    run.status = 'calculated';
    run.total_gross = totalGross;
    run.total_deductions = totalDeductions;
    run.total_net = totalNet;
    run.total_tax = totalTax;
    await run.save();

    // Trigger AI Fraud Service (FastAPI) call
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/v1/fraud/check-run', {
        payroll_run_id: run.id,
        period_start: run.period_start,
        period_end: run.period_end
      }, { timeout: 2000 }); // Fast 2s timeout for FastAPI

      if (response.data && response.data.anomalies && response.data.anomalies.length > 0) {
        run.status = 'fraud_flagged';
        await run.save();
        
        // Write anomalies to fraud alerts
        for (const alert of response.data.anomalies) {
          await FraudAlert.create({
            payroll_run_id: run.id,
            employee_id: alert.employee_id,
            anomaly_type: alert.anomaly_type,
            score: alert.confidence_score,
            severity: alert.severity,
            status: 'open'
          });
        }
      }
    } catch (apiError) {
      console.warn('FastAPI Fraud service offline. Processing local heuristics fallback...');
      // Local Heuristics: Flag ghost employees (0 attendance but salary > 0)
      for (const emp of employees) {
        const attendanceCount = await AttendanceLog.count({
          where: { employee_id: emp.id }
        });
        if (attendanceCount === 0) {
          await FraudAlert.create({
            payroll_run_id: run.id,
            employee_id: emp.id,
            anomaly_type: 'Ghost Employee',
            score: 0.9500,
            severity: 'high',
            status: 'open'
          });
          run.status = 'fraud_flagged';
          await run.save();
        }
      }
    }

    res.json({ success: true, message: 'Payroll calculations completed.', run });
  } catch (error) {
    console.error('Calculation error:', error);
    res.status(500).json({ error: 'Failed during tax engine calculation.' });
  }
});

// ==========================================
// 5. APPROVE RUN (Step 5)
// ==========================================
router.post('/runs/:id/approve', checkRole(['Super Admin']), async (req, res) => {
  try {
    const run = await PayrollRun.findByPk(req.params.id);
    if (!run) return res.status(404).json({ error: 'Payroll run not found.' });

    // Block if high severity fraud alerts are unresolved
    const unresolvedHigh = await FraudAlert.count({
      where: {
        payroll_run_id: run.id,
        severity: 'high',
        status: ['open', 'investigating']
      }
    });

    if (unresolvedHigh > 0) {
      return res.status(400).json({
        error: 'Cannot approve payroll run. High severity active AI fraud flags exist. Please resolve them.'
      });
    }

    run.status = 'approved';
    run.approved_by = req.user.id;
    run.approved_at = new Date();
    await run.save();

    res.json({ success: true, message: 'Payroll run approved and scheduled for release.', run });
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve payroll run.' });
  }
});

// ==========================================
// 6. DISBURSEMENT PIPELINE (Step 6 - Socket.io)
// ==========================================
router.post('/runs/:id/disburse', checkRole(['Super Admin', 'Payroll Admin']), async (req, res) => {
  const { id } = req.params;

  try {
    const run = await PayrollRun.findByPk(id);
    if (!run) return res.status(404).json({ error: 'Payroll run not found.' });
    if (run.status !== 'approved') return res.status(400).json({ error: 'Payroll must be approved before disbursement.' });

    res.json({ success: true, message: 'Disbursement initiated. Check live socket feed for transaction states.' });

    // Trigger async job with live WebSocket progress reporting
    const items = await PayrollItem.findAll({ where: { payroll_run_id: run.id } });
    
    // Process items sequentially in background simulating banking rail delays
    let processed = 0;
    
    const io = global.io;

    const interval = setInterval(async () => {
      if (processed >= items.length) {
        clearInterval(interval);
        run.status = 'disbursed';
        await run.save();
        
        if (io) {
          io.emit('payroll_disbursement_complete', {
            payroll_run_id: run.id,
            total_net: run.total_net
          });
        }
        return;
      }

      const item = items[processed];
      
      // Update employee wallet
      const wallet = await Wallet.findOne({ where: { employee_id: item.employee_id } });
      if (wallet) {
        const currentBal = parseFloat(wallet.balance);
        wallet.balance = currentBal + parseFloat(item.net);
        wallet.last_credited_at = new Date();
        await wallet.save();

        // Log transaction
        await WalletTransaction.create({
          wallet_id: wallet.id,
          type: 'credit',
          amount: item.net,
          currency: item.currency,
          reference: `Salary Credit (Run #${run.id})`,
          payroll_item_id: item.id,
          status: 'completed'
        });
      }

      processed++;

      // Send live status increment to connected admins
      if (io) {
        io.emit('payroll_disbursement_status', {
          payroll_run_id: run.id,
          processed,
          total: items.length,
          current_employee: item.employee_id,
          status: 'credited'
        });
      }

    }, 300); // 300ms delays to animate beautiful frontend trackers

  } catch (error) {
    console.error('Disbursement error:', error);
    res.status(500).json({ error: 'Failed to disburse payroll.' });
  }
});

// ==========================================
// 7. GET PAYROLL ITEMS
// ==========================================
router.get('/items', async (req, res) => {
  const { payroll_run_id } = req.query;
  try {
    const list = await PayrollItem.findAll({
      where: payroll_run_id ? { payroll_run_id } : {}
    });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve payroll items.' });
  }
});

module.exports = router;
