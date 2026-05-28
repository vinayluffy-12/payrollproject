const bcrypt = require('bcryptjs');
const {
  User,
  Company,
  Department,
  Employee,
  SalaryComponent,
  Wallet,
  WalletTransaction,
  AttendanceLog,
  LeaveRequest,
  LeaveBalance,
  FraudAlert,
  AuditLog,
  Notification
} = require('../models');

const seedDatabase = async () => {
  try {
    // Check if seeding is already completed
    const userCount = await User.count();
    if (userCount > 0) {
      console.log('Database already has data. Skipping automatic seeder.');
      return;
    }

    console.log('====================================================');
    console.log('  Seeding PayrollOS Database with Demo Sandbox Data');
    console.log('====================================================');

    // 1. Create Company
    const company = await Company.create({
      name: 'Antigravity Technologies',
      logo_url: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=100&h=100',
      base_currency: 'USD',
      pay_cycle: 'monthly',
      timezone: 'Asia/Kolkata',
      industry: 'Technology & AI Solutions',
      country: 'India'
    });
    console.log('- Company created');

    // Hashed Password for all demo accounts
    const passwordHash = await bcrypt.hash('Password123!', 10);

    // 2. Create Core Role-Based Users
    const superAdmin = await User.create({
      full_name: 'Vinay Kumar (Super Admin)',
      email: 'admin@payrollos.com',
      phone: '+919876543210',
      role: 'Super Admin',
      status: 'active',
      password_hash: passwordHash,
      totp_secret: 'NBSWY3DPEB3W64TBNQXD2' // Preset TOTP secret for easy mock MFA entry
    });

    const hrManager = await User.create({
      full_name: 'Swetha Sharma (HR Manager)',
      email: 'hr@payrollos.com',
      phone: '+919876543211',
      role: 'HR Manager',
      status: 'active',
      password_hash: passwordHash,
      totp_secret: 'NBSWY3DPEB3W64TBNQXD2'
    });

    const payrollAdmin = await User.create({
      full_name: 'Rohan Mehta (Payroll Admin)',
      email: 'payroll@payrollos.com',
      phone: '+919876543212',
      role: 'Payroll Admin',
      status: 'active',
      password_hash: passwordHash,
      totp_secret: 'NBSWY3DPEB3W64TBNQXD2'
    });

    const manager = await User.create({
      full_name: 'Aditya Roy (Engineering Manager)',
      email: 'manager@payrollos.com',
      phone: '+919876543213',
      role: 'Manager',
      status: 'active',
      password_hash: passwordHash,
      totp_secret: 'NBSWY3DPEB3W64TBNQXD2'
    });

    const standardEmployee = await User.create({
      full_name: 'Neha Patel (Senior Engineer)',
      email: 'employee@payrollos.com',
      phone: '+919876543214',
      role: 'Employee',
      status: 'active',
      password_hash: passwordHash,
      totp_secret: 'NBSWY3DPEB3W64TBNQXD2'
    });

    const financeAuditor = await User.create({
      full_name: 'Deepak Rao (Finance Auditor)',
      email: 'auditor@payrollos.com',
      phone: '+919876543215',
      role: 'Finance Auditor',
      status: 'active',
      password_hash: passwordHash,
      totp_secret: 'NBSWY3DPEB3W64TBNQXD2'
    });
    console.log('- Core Role Users created');

    // 3. Create Departments
    const engineering = await Department.create({
      company_id: company.id,
      name: 'Engineering & Development',
      manager_id: manager.id,
      cost_center: 'CC-ENG-001'
    });

    const humanResources = await Department.create({
      company_id: company.id,
      name: 'Human Resources',
      manager_id: hrManager.id,
      cost_center: 'CC-HR-002'
    });

    const finance = await Department.create({
      company_id: company.id,
      name: 'Finance & Compliance',
      manager_id: financeAuditor.id,
      cost_center: 'CC-FIN-003'
    });

    const marketing = await Department.create({
      company_id: company.id,
      name: 'Marketing & Sales',
      manager_id: null,
      cost_center: 'CC-MKT-004'
    });
    console.log('- Department cost centers created');

    // 4. Create Employee Records
    // Manager Employee Record
    const mgrEmp = await Employee.create({
      user_id: manager.id,
      company_id: company.id,
      department_id: engineering.id,
      designation: 'Engineering Manager',
      join_date: '2023-01-15',
      salary_currency: 'USD',
      status: 'active',
      bank_details_encrypted: 'Encrypted(Bank: Citibank, A/C: ******5678, IFSC: CITI0000002)'
    });

    // Neha (Standard Employee) Record
    const stdEmp = await Employee.create({
      user_id: standardEmployee.id,
      company_id: company.id,
      department_id: engineering.id,
      manager_id: mgrEmp.id,
      designation: 'Senior Full Stack Engineer',
      join_date: '2024-03-01',
      salary_currency: 'USD',
      status: 'active',
      bank_details_encrypted: 'Encrypted(Bank: HDFC Bank, A/C: ******1234, IFSC: HDFC0000104)'
    });

    // Create remaining employees for bulk demonstration (say 40 employees)
    const designations = [
      { role: 'Engineer', desig: 'Software Engineer', dept: engineering, sal: 4500 },
      { role: 'Engineer', desig: 'QA Analyst', dept: engineering, sal: 3200 },
      { role: 'HR', desig: 'HR Specialist', dept: humanResources, sal: 3000 },
      { role: 'HR', desig: 'Recruiter', dept: humanResources, sal: 2800 },
      { role: 'Finance', desig: 'Financial Analyst', dept: finance, sal: 4000 },
      { role: 'Marketing', desig: 'Growth Marketer', dept: marketing, sal: 3500 },
      { role: 'Marketing', desig: 'Content Creator', dept: marketing, sal: 2500 }
    ];

    const employees = [mgrEmp, stdEmp];

    for (let i = 1; i <= 35; i++) {
      const config = designations[i % designations.length];
      const user = await User.create({
        full_name: `Employee Name ${i}`,
        email: `employee${i}@payrollos.com`,
        phone: `+9198765400${i.toString().padStart(2, '0')}`,
        role: 'Employee',
        status: i % 12 === 0 ? 'pending' : 'active',
        password_hash: passwordHash
      });

      const emp = await Employee.create({
        user_id: user.id,
        company_id: company.id,
        department_id: config.dept.id,
        manager_id: config.dept.id === engineering.id ? mgrEmp.id : null,
        designation: config.desig,
        join_date: `2025-${(i % 12 + 1).toString().padStart(2, '0')}-10`,
        salary_currency: i % 8 === 0 ? 'EUR' : (i % 7 === 0 ? 'INR' : 'USD'),
        status: i % 12 === 0 ? 'pending' : 'active',
        bank_details_encrypted: `Encrypted(Bank: SBI, A/C: ******00${i}, IFSC: SBIN0001332)`
      });

      employees.push(emp);
    }
    console.log(`- Created ${employees.length} employee records`);

    // 5. Create Salary Components for active employees
    for (const emp of employees) {
      // Scale basic salary dynamically based on manager or staff
      const isMgr = emp.designation.includes('Manager');
      const baseSalary = isMgr ? 8000.00 : (emp.salary_currency === 'INR' ? 120000.00 : (emp.salary_currency === 'EUR' ? 3800.00 : 4500.00));
      
      await SalaryComponent.create({
        employee_id: emp.id,
        basic: baseSalary * 0.5,
        hra: baseSalary * 0.2,
        special_allowance: baseSalary * 0.2,
        performance_bonus: isMgr ? 1500.00 : 300.00,
        other_earnings: 100.00,
        pf_employee: baseSalary * 0.06,
        pf_employer: baseSalary * 0.06,
        esi: baseSalary * 0.0075,
        tds: baseSalary * 0.10,
        prof_tax: 200.00,
        other_deductions: 50.00,
        effective_date: emp.join_date || '2025-01-01'
      });
    }
    console.log('- Salary structures applied');

    // 6. Create Wallets and initial transactions
    for (const emp of employees) {
      const wallet = await Wallet.create({
        employee_id: emp.id,
        balance: emp.salary_currency === 'INR' ? 85000.00 : 3200.00,
        currency: emp.salary_currency
      });

      // Wallet Transactions
      await WalletTransaction.create({
        wallet_id: wallet.id,
        type: 'credit',
        amount: emp.salary_currency === 'INR' ? 85000.00 : 3200.00,
        currency: emp.salary_currency,
        reference: 'Initial Balance Setup',
        status: 'completed'
      });
    }
    console.log('- Wallets and transaction ledger initialized');

    // 7. Create Attendance Logs for standard employees (Current Month - last 20 days)
    const today = new Date();
    for (let dayOffset = 1; dayOffset <= 20; dayOffset++) {
      const logDate = new Date();
      logDate.setDate(today.getDate() - dayOffset);
      const formattedDate = logDate.toISOString().split('T')[0];

      // Add present log for Neha
      await AttendanceLog.create({
        employee_id: stdEmp.id,
        date: formattedDate,
        check_in: '09:12 AM',
        check_out: '06:15 PM',
        hours_worked: 9.05,
        overtime_hours: 1.05,
        method: 'GPS',
        location_lat: 12.9716,
        location_lng: 77.5946,
        status: 'present',
        notes: 'GPS verified check-in'
      });

      // Simple attendance log for Manager
      await AttendanceLog.create({
        employee_id: mgrEmp.id,
        date: formattedDate,
        check_in: '09:30 AM',
        check_out: '05:45 PM',
        hours_worked: 8.25,
        overtime_hours: 0.00,
        method: 'Face',
        location_lat: 12.9716,
        location_lng: 77.5946,
        status: 'present',
        notes: 'Biometric face unlock matched'
      });
    }
    console.log('- 20 days of detailed attendance history seeded');

    // 8. Create Leave Requests and balances
    await LeaveBalance.create({
      employee_id: stdEmp.id,
      leave_type: 'Annual',
      year: 2026,
      entitled: 20,
      used: 2,
      remaining: 18
    });
    await LeaveBalance.create({
      employee_id: stdEmp.id,
      leave_type: 'Sick',
      year: 2026,
      entitled: 10,
      used: 1,
      remaining: 9
    });

    await LeaveRequest.create({
      employee_id: stdEmp.id,
      leave_type: 'Annual',
      from_date: '2026-06-10',
      to_date: '2026-06-12',
      days: 3,
      reason: 'Family wedding attendance',
      status: 'pending'
    });
    console.log('- Leave ledgers and request queues seeded');

    // 9. Seeding Fraud Anomaly Alerts
    await FraudAlert.create({
      payroll_run_id: 1,
      employee_id: stdEmp.id,
      anomaly_type: 'Ghost Employee',
      score: 0.9412,
      severity: 'high',
      status: 'open'
    });

    await FraudAlert.create({
      payroll_run_id: 1,
      employee_id: employees[10].id,
      anomaly_type: 'Salary Spike (>2σ)',
      score: 0.8123,
      severity: 'medium',
      status: 'open'
    });
    console.log('- Dynamic fraud anomaly indicators populated');

    // 10. Seeding Notifications
    await Notification.create({
      user_id: superAdmin.id,
      company_id: company.id,
      type: 'fraud',
      title: 'High Severity Fraud Alert',
      body: 'AI engine detected high risk ghost employee indicator on Neha Patel (0 attendance days).'
    });

    await Notification.create({
      user_id: hrManager.id,
      company_id: company.id,
      type: 'verification',
      title: 'New Verification Request',
      body: 'Employee Name 12 has submitted verification ID details. Review required.'
    });

    await Notification.create({
      user_id: standardEmployee.id,
      company_id: company.id,
      type: 'payroll',
      title: 'Salary Deposited',
      body: 'Your salary for period April 2026 has been credited to your PayrollOS Wallet.'
    });
    console.log('- System activity and notification logs successfully set up.');

    // 11. Initial Audit Trail
    await AuditLog.create({
      company_id: company.id,
      actor_id: superAdmin.id,
      action: 'database_initialization',
      entity: 'System',
      entity_id: 1,
      new_value: 'System databases migrated and filled with standard demo dataset',
      ip_address: '127.0.0.1',
      user_agent: 'Node.js Express Boot Engine'
    });
    console.log('- Audit logs populated');

    console.log('====================================================');
    console.log('  Database Seeding Completed Successfully');
    console.log('====================================================');
  } catch (error) {
    console.error('Seeder execution failed:', error);
  }
};

module.exports = seedDatabase;
