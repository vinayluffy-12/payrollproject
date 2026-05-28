const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// ==========================================
// 1. User Model
// ==========================================
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  role: {
    type: DataTypes.ENUM('Super Admin', 'HR Manager', 'Payroll Admin', 'Manager', 'Employee', 'Finance Auditor'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'active', 'rejected', 'suspended'),
    defaultValue: 'pending'
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  totp_secret: {
    type: DataTypes.STRING,
    allowNull: true
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true
  },
  failed_attempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  locked_until: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true
});

// ==========================================
// 2. Company Model
// ==========================================
const Company = sequelize.define('Company', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  logo_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  base_currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'USD'
  },
  pay_cycle: {
    type: DataTypes.ENUM('weekly', 'bi-weekly', 'monthly'),
    defaultValue: 'monthly'
  },
  timezone: {
    type: DataTypes.STRING,
    defaultValue: 'UTC'
  },
  industry: {
    type: DataTypes.STRING,
    allowNull: true
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'companies',
  timestamps: true,
  underscored: true
});

// ==========================================
// 3. Department Model
// ==========================================
const Department = sequelize.define('Department', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  manager_id: {
    type: DataTypes.INTEGER, // User ID of Manager
    allowNull: true
  },
  cost_center: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'departments',
  timestamps: true,
  underscored: true
});

// ==========================================
// 4. Employee Model
// ==========================================
const Employee = sequelize.define('Employee', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  department_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  manager_id: {
    type: DataTypes.INTEGER, // Employee ID of direct manager
    allowNull: true
  },
  designation: {
    type: DataTypes.STRING,
    allowNull: true
  },
  join_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  salary_currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'USD'
  },
  bank_details_encrypted: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'active'
  }
}, {
  tableName: 'employees',
  timestamps: true,
  underscored: true
});

// ==========================================
// 5. Verification Request Model
// ==========================================
const VerificationRequest = sequelize.define('VerificationRequest', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_type: {
    type: DataTypes.STRING,
    allowNull: false // Passport, National ID, Driver License
  },
  id_number: {
    type: DataTypes.STRING,
    allowNull: false
  },
  id_document_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  admin_id: {
    type: DataTypes.INTEGER, // User ID of Admin
    allowNull: true
  },
  decision: {
    type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
    defaultValue: 'pending'
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  decided_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'verification_requests',
  timestamps: true,
  underscored: true
});

// ==========================================
// 6. Salary Component Model
// ==========================================
const SalaryComponent = sequelize.define('SalaryComponent', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  employee_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  basic: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0.00
  },
  hra: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0.00
  },
  special_allowance: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0.00
  },
  performance_bonus: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0.00
  },
  other_earnings: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0.00
  },
  pf_employee: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0.00
  },
  pf_employer: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0.00
  },
  esi: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0.00
  },
  tds: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0.00
  },
  prof_tax: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0.00
  },
  other_deductions: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0.00
  },
  effective_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
}, {
  tableName: 'salary_components',
  timestamps: true,
  underscored: true
});

// ==========================================
// 7. Payroll Run Model
// ==========================================
const PayrollRun = sequelize.define('PayrollRun', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  period_start: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  period_end: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('draft', 'calculated', 'fraud_flagged', 'approved', 'disbursed'),
    defaultValue: 'draft'
  },
  total_gross: {
    type: DataTypes.DECIMAL(14, 2),
    defaultValue: 0.00
  },
  total_deductions: {
    type: DataTypes.DECIMAL(14, 2),
    defaultValue: 0.00
  },
  total_net: {
    type: DataTypes.DECIMAL(14, 2),
    defaultValue: 0.00
  },
  total_tax: {
    type: DataTypes.DECIMAL(14, 2),
    defaultValue: 0.00
  },
  run_by: {
    type: DataTypes.INTEGER, // User ID
    allowNull: true
  },
  approved_by: {
    type: DataTypes.INTEGER, // User ID
    allowNull: true
  },
  approved_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'payroll_runs',
  timestamps: true,
  underscored: true
});

// ==========================================
// 8. Payroll Item Model
// ==========================================
const PayrollItem = sequelize.define('PayrollItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  payroll_run_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  employee_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  gross: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0.00
  },
  basic: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0.00
  },
  hra: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0.00
  },
  allowances: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0.00
  },
  bonus: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0.00
  },
  overtime_pay: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0.00
  },
  tds: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0.00
  },
  pf_employee: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0.00
  },
  pf_employer: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0.00
  },
  esi: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0.00
  },
  prof_tax: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0.00
  },
  other_deductions: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0.00
  },
  net: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0.00
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'USD'
  },
  fx_rate: {
    type: DataTypes.DECIMAL(12, 6),
    defaultValue: 1.000000
  },
  payslip_pdf_url: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'payroll_items',
  timestamps: true,
  underscored: true
});

// ==========================================
// 9. Wallet Model
// ==========================================
const Wallet = sequelize.define('Wallet', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  employee_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  balance: {
    type: DataTypes.DECIMAL(14, 2),
    defaultValue: 0.00
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'USD'
  },
  last_credited_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'wallets',
  timestamps: true,
  underscored: true
});

// ==========================================
// 10. Wallet Transaction Model
// ==========================================
const WalletTransaction = sequelize.define('WalletTransaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  wallet_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('credit', 'debit', 'withdrawal', 'reversal'),
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING(3),
    allowNull: false
  },
  fx_rate: {
    type: DataTypes.DECIMAL(12, 6),
    defaultValue: 1.000000
  },
  reference: {
    type: DataTypes.STRING,
    allowNull: true
  },
  payroll_item_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed'),
    defaultValue: 'pending'
  }
}, {
  tableName: 'wallet_transactions',
  timestamps: true,
  underscored: true
});

// ==========================================
// 11. Attendance Log Model
// ==========================================
const AttendanceLog = sequelize.define('AttendanceLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  employee_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  check_in: {
    type: DataTypes.STRING,
    allowNull: true
  },
  check_out: {
    type: DataTypes.STRING,
    allowNull: true
  },
  hours_worked: {
    type: DataTypes.DECIMAL(4, 2),
    defaultValue: 0.00
  },
  overtime_hours: {
    type: DataTypes.DECIMAL(4, 2),
    defaultValue: 0.00
  },
  method: {
    type: DataTypes.ENUM('QR', 'Face', 'GPS', 'Manual'),
    defaultValue: 'GPS'
  },
  location_lat: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  location_lng: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('present', 'absent', 'leave', 'holiday', 'wfh'),
    defaultValue: 'present'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'attendance_logs',
  timestamps: true,
  underscored: true
});

// ==========================================
// 12. Leave Request Model
// ==========================================
const LeaveRequest = sequelize.define('LeaveRequest', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  employee_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  leave_type: {
    type: DataTypes.ENUM('Annual', 'Sick', 'Casual', 'Maternity', 'Paternity'),
    allowNull: false
  },
  from_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  to_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  days: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  document_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  },
  reviewed_by: {
    type: DataTypes.INTEGER, // User ID of reviewer
    allowNull: true
  },
  reviewed_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'leave_requests',
  timestamps: true,
  underscored: true
});

// ==========================================
// 13. Leave Balance Model
// ==========================================
const LeaveBalance = sequelize.define('LeaveBalance', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  employee_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  leave_type: {
    type: DataTypes.ENUM('Annual', 'Sick', 'Casual', 'Maternity', 'Paternity'),
    allowNull: false
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  entitled: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  used: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  remaining: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'leave_balances',
  timestamps: true,
  underscored: true
});

// ==========================================
// 14. Disbursement Schedule Model
// ==========================================
const DisbursementSchedule = sequelize.define('DisbursementSchedule', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  payroll_run_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  scheduled_at: {
    type: DataTypes.DATE,
    allowNull: false
  },
  executed_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'processing', 'completed', 'failed'),
    defaultValue: 'scheduled'
  }
}, {
  tableName: 'disbursement_schedules',
  timestamps: true,
  underscored: true
});

// ==========================================
// 15. Fraud Alert Model
// ==========================================
const FraudAlert = sequelize.define('FraudAlert', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  payroll_run_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  employee_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  anomaly_type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  score: {
    type: DataTypes.DECIMAL(5, 4),
    defaultValue: 0.0000
  },
  severity: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'low'
  },
  status: {
    type: DataTypes.ENUM('open', 'investigating', 'resolved', 'false_positive'),
    defaultValue: 'open'
  },
  resolved_by: {
    type: DataTypes.INTEGER, // User ID
    allowNull: true
  },
  resolution_notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'fraud_alerts',
  timestamps: true,
  underscored: true
});

// ==========================================
// 16. Audit Log Model
// ==========================================
const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  actor_id: {
    type: DataTypes.INTEGER, // User ID of action taker
    allowNull: false
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false
  },
  entity: {
    type: DataTypes.STRING,
    allowNull: false
  },
  entity_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  old_value: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  new_value: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ip_address: {
    type: DataTypes.STRING,
    allowNull: true
  },
  user_agent: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'audit_logs',
  timestamps: true,
  underscored: true
});

// ==========================================
// 17. Notification Model
// ==========================================
const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING, // 'payroll', 'attendance', 'fraud', 'system', 'verification'
    defaultValue: 'system'
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  read_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  action_url: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'notifications',
  timestamps: true,
  underscored: true
});

// ==========================================
// 18. FX Rate Snapshot Model
// ==========================================
const FxRateSnapshot = sequelize.define('FxRateSnapshot', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  payroll_run_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  from_currency: {
    type: DataTypes.STRING(3),
    allowNull: false
  },
  to_currency: {
    type: DataTypes.STRING(3),
    allowNull: false
  },
  rate: {
    type: DataTypes.DECIMAL(12, 6),
    allowNull: false
  },
  source: {
    type: DataTypes.STRING,
    defaultValue: 'Open Exchange Rates'
  }
}, {
  tableName: 'fx_rate_snapshots',
  timestamps: true,
  underscored: true
});

// ==========================================
// RELATIONAL ASSOCIATIONS
// ==========================================

// Company & Department
Company.hasMany(Department, { foreignKey: 'company_id' });
Department.belongsTo(Company, { foreignKey: 'company_id' });

// User & Employee
User.hasOne(Employee, { foreignKey: 'user_id' });
Employee.belongsTo(User, { foreignKey: 'user_id' });

// Company & Employee
Company.hasMany(Employee, { foreignKey: 'company_id' });
Employee.belongsTo(Company, { foreignKey: 'company_id' });

// Department & Employee
Department.hasMany(Employee, { foreignKey: 'department_id' });
Employee.belongsTo(Department, { foreignKey: 'department_id' });

// User & VerificationRequest
User.hasMany(VerificationRequest, { foreignKey: 'user_id' });
VerificationRequest.belongsTo(User, { foreignKey: 'user_id' });

// Employee & SalaryComponent
Employee.hasOne(SalaryComponent, { foreignKey: 'employee_id' });
SalaryComponent.belongsTo(Employee, { foreignKey: 'employee_id' });

// Company & PayrollRun
Company.hasMany(PayrollRun, { foreignKey: 'company_id' });
PayrollRun.belongsTo(Company, { foreignKey: 'company_id' });

// PayrollRun & PayrollItem
PayrollRun.hasMany(PayrollItem, { foreignKey: 'payroll_run_id' });
PayrollItem.belongsTo(PayrollRun, { foreignKey: 'payroll_run_id' });

// Employee & PayrollItem
Employee.hasMany(PayrollItem, { foreignKey: 'employee_id' });
PayrollItem.belongsTo(Employee, { foreignKey: 'employee_id' });

// Employee & Wallet
Employee.hasOne(Wallet, { foreignKey: 'employee_id' });
Wallet.belongsTo(Employee, { foreignKey: 'employee_id' });

// Wallet & WalletTransaction
Wallet.hasMany(WalletTransaction, { foreignKey: 'wallet_id' });
WalletTransaction.belongsTo(Wallet, { foreignKey: 'wallet_id' });

// Employee & AttendanceLog
Employee.hasMany(AttendanceLog, { foreignKey: 'employee_id' });
AttendanceLog.belongsTo(Employee, { foreignKey: 'employee_id' });

// Employee & LeaveRequest
Employee.hasMany(LeaveRequest, { foreignKey: 'employee_id' });
LeaveRequest.belongsTo(Employee, { foreignKey: 'employee_id' });

// Employee & LeaveBalance
Employee.hasMany(LeaveBalance, { foreignKey: 'employee_id' });
LeaveBalance.belongsTo(Employee, { foreignKey: 'employee_id' });

// PayrollRun & DisbursementSchedule
PayrollRun.hasOne(DisbursementSchedule, { foreignKey: 'payroll_run_id' });
DisbursementSchedule.belongsTo(PayrollRun, { foreignKey: 'payroll_run_id' });

// PayrollRun & FraudAlert
PayrollRun.hasMany(FraudAlert, { foreignKey: 'payroll_run_id' });
FraudAlert.belongsTo(PayrollRun, { foreignKey: 'payroll_run_id' });

// Employee & FraudAlert
Employee.hasMany(FraudAlert, { foreignKey: 'employee_id' });
FraudAlert.belongsTo(Employee, { foreignKey: 'employee_id' });

// Company & AuditLog
Company.hasMany(AuditLog, { foreignKey: 'company_id' });
AuditLog.belongsTo(Company, { foreignKey: 'company_id' });

// User & Notification
User.hasMany(Notification, { foreignKey: 'user_id' });
Notification.belongsTo(User, { foreignKey: 'user_id' });

// Export all models and connection
module.exports = {
  sequelize,
  User,
  Company,
  Department,
  Employee,
  VerificationRequest,
  SalaryComponent,
  PayrollRun,
  PayrollItem,
  Wallet,
  WalletTransaction,
  AttendanceLog,
  LeaveRequest,
  LeaveBalance,
  DisbursementSchedule,
  FraudAlert,
  AuditLog,
  Notification,
  FxRateSnapshot
};
