import React from 'react';
import { 
  LayoutDashboard, UserCheck, Users, RefreshCw, 
  CalendarRange, Wallet, ShieldAlert, FileBarChart, 
  Globe, Settings, ShieldCheck, Bell, LogOut, 
  MapPin, Brain, GitMerge, HelpCircle
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, role, setRole, pendingKycCount, alertCount }) {
  // Navigation lists for each role
  const getNavItems = () => {
    switch (role) {
      case 'Super Admin':
        return [
          { id: 'admin-overview', label: 'Dashboard Overview', icon: LayoutDashboard },
          { id: 'admin-kyc', label: 'Verification Queue', icon: UserCheck, badge: pendingKycCount },
          { id: 'admin-employees', label: 'Employee Management', icon: Users },
          { id: 'admin-payroll', label: 'Payroll Runs', icon: RefreshCw },
          { id: 'admin-attendance', label: 'Attendance', icon: CalendarRange },
          { id: 'admin-wallet', label: 'Wallet & Disbursements', icon: Wallet },
          { id: 'admin-fraud', label: 'AI Fraud Alerts', icon: ShieldAlert, badge: alertCount, badgeColor: 'bg-danger text-white' },
          { id: 'admin-reports', label: 'Reports & Analytics', icon: FileBarChart },
          { id: 'admin-currencies', label: 'Multi-Currency Settings', icon: Globe },
          { id: 'admin-settings', label: 'System Settings', icon: Settings },
          { id: 'admin-audit', label: 'Audit Logs', icon: ShieldCheck }
        ];

      case 'HR Manager':
        return [
          { id: 'hr-overview', label: 'HR Overview', icon: LayoutDashboard },
          { id: 'admin-employees', label: 'Employee Directory', icon: Users },
          { id: 'hr-attendance', label: 'Attendance Heatmap', icon: CalendarRange },
          { id: 'hr-leaves', label: 'Leave Management', icon: UserCheck },
          { id: 'hr-attrition', label: 'Headcount & Attrition', icon: FileBarChart },
          { id: 'admin-reports', label: 'Reports Hub', icon: FileBarChart }
        ];

      case 'Payroll Admin':
        return [
          { id: 'payroll-overview', label: 'Payroll Overview', icon: LayoutDashboard },
          { id: 'admin-payroll', label: 'Payroll Runs Workflow', icon: RefreshCw },
          { id: 'payroll-config', label: 'Salary Components', icon: Settings },
          { id: 'payroll-schedule', label: 'Disbursement Schedule', icon: Wallet },
          { id: 'admin-reports', label: 'Payroll Reports', icon: FileBarChart }
        ];

      case 'Manager':
        return [
          { id: 'mgr-overview', label: 'Team Overview', icon: LayoutDashboard },
          { id: 'mgr-attendance', label: 'Team Attendance', icon: CalendarRange },
          { id: 'mgr-leaves', label: 'Team Leaves', icon: UserCheck },
          { id: 'mgr-budget', label: 'Salary Budget', icon: Wallet },
          { id: 'mgr-performance', label: 'Performance Metrics', icon: FileBarChart }
        ];

      case 'Employee':
        return [
          { id: 'emp-overview', label: 'My Dashboard', icon: LayoutDashboard },
          { id: 'emp-payslips', label: 'My Payslips', icon: FileBarChart },
          { id: 'emp-wallet', label: 'My Wallet', icon: Wallet },
          { id: 'emp-attendance', label: 'My Attendance', icon: CalendarRange },
          { id: 'emp-leaves', label: 'Leave Requests', icon: UserCheck },
          { id: 'emp-chatbot', label: 'AI Assistant', icon: Brain },
          { id: 'emp-profile', label: 'My Profile', icon: Users }
        ];

      case 'Finance Auditor':
        return [
          { id: 'auditor-overview', label: 'Audit Dashboard', icon: LayoutDashboard },
          { id: 'admin-payroll', label: 'Payroll Register (Read-Only)', icon: RefreshCw },
          { id: 'admin-reports', label: 'Compliance Reports', icon: FileBarChart },
          { id: 'admin-audit', label: 'Immutable Audit Logs', icon: ShieldCheck }
        ];

      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setRole(newRole);
    // Reset to role specific default overview tab
    if (newRole === 'Super Admin') setActiveTab('admin-overview');
    else if (newRole === 'HR Manager') setActiveTab('hr-overview');
    else if (newRole === 'Payroll Admin') setActiveTab('payroll-overview');
    else if (newRole === 'Manager') setActiveTab('mgr-overview');
    else if (newRole === 'Employee') setActiveTab('emp-overview');
    else if (newRole === 'Finance Auditor') setActiveTab('auditor-overview');
  };

  return (
    <aside className="w-60 bg-primary-navy text-white h-screen flex flex-col fixed left-0 top-0 z-20 shadow-xl border-r border-accent-violet/20">
      {/* Brand Logo */}
      <div className="p-6 border-b border-accent-violet/30 flex items-center space-x-3 gradient-navy-indigo">
        <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center font-bold text-primary-navy shadow-lg">
          P
        </div>
        <div>
          <h1 className="font-extrabold text-lg leading-tight tracking-wide text-white">
            Payroll<span className="text-gold">OS</span>
          </h1>
          <p className="text-[10px] text-surface/70 uppercase tracking-widest font-semibold">
            Antigravity Tech
          </p>
        </div>
      </div>

      {/* Role Switcher in Sidebar (For easy demo sandbox toggling!) */}
      <div className="p-4 mx-3 my-4 bg-accent-violet/20 rounded-lg border border-accent-violet/30">
        <label className="block text-[10px] text-surface/60 font-bold uppercase tracking-wider mb-2">
          Demo Sandbox Role
        </label>
        <select 
          value={role} 
          onChange={handleRoleChange}
          className="w-full bg-primary-navy text-gold font-semibold text-xs py-1.5 px-2.5 rounded border border-accent-violet/50 cursor-pointer focus:border-gold"
        >
          <option value="Super Admin">Super Admin</option>
          <option value="HR Manager">HR Manager</option>
          <option value="Payroll Admin">Payroll Admin</option>
          <option value="Manager">Manager</option>
          <option value="Employee">Employee Self-Service</option>
          <option value="Finance Auditor">Finance Auditor</option>
        </select>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 group ${
                isActive 
                  ? 'bg-accent-violet text-white shadow-md border-l-4 border-gold scale-102' 
                  : 'text-surface/80 hover:bg-accent-violet/10 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 transition-colors ${
                  isActive ? 'text-gold' : 'text-surface/60 group-hover:text-gold'
                }`} />
                <span className="truncate">{item.label}</span>
              </div>
              
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                  item.badgeColor || 'bg-gold text-primary-navy'
                } animate-pulse-slow`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Profile details */}
      <div className="p-4 border-t border-accent-violet/30 bg-primary-navy/90 flex flex-col space-y-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-accent-violet border border-gold flex items-center justify-center font-bold text-white shadow-md">
            {role[0]}
          </div>
          <div className="truncate">
            <h4 className="text-xs font-bold truncate text-white">Vinay Kumar</h4>
            <span className="text-[10px] text-gold font-medium px-2 py-0.5 rounded-full bg-gold/10 border border-gold/20 inline-block mt-0.5">
              {role}
            </span>
          </div>
        </div>
        <button 
          onClick={() => setActiveTab('landing-page')}
          className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-lg bg-danger/10 text-danger-red hover:bg-danger text-xs font-bold transition-all border border-danger/20 hover:text-white"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit Sandbox</span>
        </button>
      </div>
    </aside>
  );
}
