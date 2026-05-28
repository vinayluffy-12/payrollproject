const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { verifyToken, checkRole } = require('../middleware/auth');
const { User, Employee, Department, SalaryComponent, Wallet, AttendanceLog, LeaveRequest, LeaveBalance, PayrollItem } = require('../models');

// Apply auth to all routes
router.use(verifyToken);

// ==========================================
// 1. GET ALL EMPLOYEES
// ==========================================
router.get('/', checkRole(['Super Admin', 'HR Manager', 'Payroll Admin', 'Finance Auditor']), async (req, res) => {
  const { department_id, designation, status, search } = req.query;
  const whereClause = {};
  
  if (department_id) whereClause.department_id = department_id;
  if (designation) whereClause.designation = designation;
  if (status) whereClause.status = status;

  try {
    const list = await Employee.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          attributes: ['id', 'full_name', 'email', 'phone', 'role', 'status']
        },
        {
          model: Department,
          attributes: ['id', 'name', 'cost_center']
        }
      ]
    });

    // Filter by name/email locally or via Sequelize
    let filtered = list;
    if (search) {
      const q = search.toLowerCase();
      filtered = list.filter(emp => 
        (emp.User && emp.User.full_name.toLowerCase().includes(q)) || 
        (emp.User && emp.User.email.toLowerCase().includes(q)) ||
        (emp.designation && emp.designation.toLowerCase().includes(q))
      );
    }

    res.json(filtered);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Server error fetching employee database.' });
  }
});

// ==========================================
// 2. CREATE EMPLOYEE
// ==========================================
router.post('/', checkRole(['Super Admin', 'HR Manager']), async (req, res) => {
  const { full_name, email, phone, role, designation, department_id, salary_currency, basic, hra, effective_date } = req.body;

  if (!full_name || !email || !role) {
    return res.status(400).json({ error: 'Full name, email, and role are required.' });
  }

  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    const defaultPass = await bcrypt.hash('Password123!', 10);

    // Create User
    const user = await User.create({
      full_name,
      email,
      phone,
      role,
      status: 'active',
      password_hash: defaultPass
    });

    // Create Employee details
    const emp = await Employee.create({
      user_id: user.id,
      company_id: 1, // Default company
      department_id,
      designation,
      join_date: new Date().toISOString().split('T')[0],
      salary_currency: salary_currency || 'USD',
      status: 'active',
      bank_details_encrypted: 'Encrypted(Setup Pending)'
    });

    // Create Salary Components
    await SalaryComponent.create({
      employee_id: emp.id,
      basic: basic || 2000,
      hra: hra || 500,
      effective_date: effective_date || new Date().toISOString().split('T')[0]
    });

    // Create Wallet
    await Wallet.create({
      employee_id: emp.id,
      balance: 0,
      currency: salary_currency || 'USD'
    });

    res.status(201).json({ success: true, message: 'Employee added successfully', employeeId: emp.id });

  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ error: 'Server error adding employee record.' });
  }
});

// ==========================================
// 3. GET SINGLE EMPLOYEE DETAILS (Multi-tab support)
// ==========================================
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const emp = await Employee.findByPk(id, {
      include: [
        { model: User, attributes: ['id', 'full_name', 'email', 'phone', 'role', 'status'] },
        { model: Department, attributes: ['id', 'name', 'cost_center'] },
        { model: SalaryComponent }
      ]
    });

    if (!emp) {
      return res.status(404).json({ error: 'Employee not found.' });
    }

    res.json(emp);
  } catch (error) {
    console.error('Error loading employee profile:', error);
    res.status(500).json({ error: 'Server error loading employee details.' });
  }
});

// GET payslips list
router.get('/:id/payslips', async (req, res) => {
  try {
    const payslips = await PayrollItem.findAll({
      where: { employee_id: req.params.id },
      order: [['created_at', 'DESC']]
    });
    res.json(payslips);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load payslips.' });
  }
});

// GET attendance heatmap logs
router.get('/:id/attendance', async (req, res) => {
  try {
    const logs = await AttendanceLog.findAll({
      where: { employee_id: req.params.id },
      order: [['date', 'DESC']],
      limit: 100
    });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load attendance logs.' });
  }
});

// GET wallet balance & transactions
router.get('/:id/wallet', async (req, res) => {
  try {
    const wallet = await Wallet.findOne({
      where: { employee_id: req.params.id },
      include: [{ model: Wallet.associations.WalletTransactions }] // Handled via Sequelize association name
    });
    
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found.' });
    }
    
    res.json(wallet);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load wallet ledger.' });
  }
});

// GET leave details
router.get('/:id/leaves', async (req, res) => {
  try {
    const requests = await LeaveRequest.findAll({
      where: { employee_id: req.params.id }
    });
    const balances = await LeaveBalance.findAll({
      where: { employee_id: req.params.id }
    });
    res.json({ requests, balances });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load leave records.' });
  }
});

// ==========================================
// 4. UPDATE / DELETE
// ==========================================
router.put('/:id', checkRole(['Super Admin', 'HR Manager']), async (req, res) => {
  const { id } = req.params;
  const { designation, department_id, status } = req.body;

  try {
    const emp = await Employee.findByPk(id);
    if (!emp) return res.status(404).json({ error: 'Employee not found.' });

    if (designation) emp.designation = designation;
    if (department_id) emp.department_id = department_id;
    if (status) emp.status = status;

    await emp.save();
    res.json({ success: true, message: 'Employee updated successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update employee.' });
  }
});

router.delete('/:id', checkRole(['Super Admin']), async (req, res) => {
  try {
    const emp = await Employee.findByPk(req.params.id);
    if (!emp) return res.status(404).json({ error: 'Employee not found.' });

    emp.status = 'suspended';
    await emp.save();

    const user = await User.findByPk(emp.user_id);
    if (user) {
      user.status = 'suspended';
      await user.save();
    }

    res.json({ success: true, message: 'Employee suspended successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete employee.' });
  }
});

module.exports = router;
