import React, { useState } from 'react';
import { Bell, Search, User, LogOut, ChevronDown, CheckCircle, ShieldAlert, FileText, Settings } from 'lucide-react';

export default function TopHeader({ activeTab, role, notifications, markAllRead, setActiveTab }) {
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Resolve dynamic page title
  const getPageTitle = () => {
    const titles = {
      'admin-overview': 'Super Admin Command Overview',
      'admin-kyc': 'KYC Employee Verification Queue',
      'admin-employees': 'Organizational Employee Register',
      'admin-payroll': 'Payroll Core Operations',
      'admin-attendance': 'Time & Attendance Log Matrix',
      'admin-wallet': 'Treasury Wallets & disbursements',
      'admin-fraud': 'AI Fraud Sentinel & Risk Management',
      'admin-reports': 'SaaS Reports & Analytics Hub',
      'admin-currencies': 'Foreign Exchange & Multi-Currency Settings',
      'admin-settings': 'SaaS Platform Settings',
      'admin-audit': 'Immutable Compliance Audit Logs',
      
      'hr-overview': 'HR Analytics Overview',
      'hr-attendance': 'GitHub-style Attendance Grid Map',
      'hr-leaves': 'Leave Request & Policy Center',
      'hr-attrition': 'Workforce Attrition Ledger',

      'payroll-overview': 'Payroll Operations Overview',
      'payroll-config': 'Statutory Component Configs',
      'payroll-schedule': 'Disbursement Timelines Calendar',

      'mgr-overview': 'Manager Dashboard Overview',
      'mgr-attendance': 'Team Attendance Registers',
      'mgr-leaves': 'Team Leave Approvals',
      'mgr-budget': 'Department Salary Budgets',
      'mgr-performance': 'Team Performance Metrics',

      'emp-overview': 'Employee Self-Service Portal',
      'emp-payslips': 'My Compensation Payslip Vault',
      'emp-wallet': 'My Multi-Currency Digital Wallet',
      'emp-attendance': 'GPS/Face Biometric Check-In logs',
      'emp-leaves': 'Leave Applications & Entitlements',
      'emp-chatbot': 'PayrollOS HR AI Assistant Panel',
      'emp-profile': 'Personal Employee Dossier',

      'auditor-overview': 'Compliance Audit Console',
    };
    return titles[activeTab] || 'Management Console';
  };

  const unreadCount = notifications.filter(n => !n.read_at).length;

  return (
    <header className="h-16 bg-white border-b border-surface-dark flex items-center justify-between px-8 fixed top-0 right-0 left-60 z-10 shadow-sm">
      {/* Dynamic Title */}
      <div>
        <h2 className="text-sm uppercase tracking-wider font-extrabold text-primary-navy">
          {getPageTitle()}
        </h2>
        <p className="text-[10px] text-gray-400 font-medium">
          PayrollOS Platform / {role} / {activeTab.replace('admin-', '').replace('emp-', '').replace('hr-', '')}
        </p>
      </div>

      {/* Right Tools: Search, Notifications, Avatar */}
      <div className="flex items-center space-x-6">
        {/* Global Search */}
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search employees, transactions, audit logs..."
            className="w-full bg-surface text-xs text-gray-700 pl-9 pr-4 py-2 rounded-full border border-gray-200 focus:border-accent-violet focus:bg-white transition-all"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3.5 top-2.5" />
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowNotif(!showNotif);
              setShowProfile(false);
            }}
            className="p-2 text-gray-500 hover:text-accent-violet hover:bg-surface rounded-full transition-all relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="w-4 h-4 bg-danger text-white text-[8px] font-bold rounded-full flex items-center justify-center absolute -top-0.5 -right-0.5 animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotif && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-30 animate-float-quick">
              <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                <span className="text-xs font-bold text-primary-navy">Recent System Notifications</span>
                {unreadCount > 0 && (
                  <button 
                    onClick={() => {
                      markAllRead();
                      setShowNotif(false);
                    }}
                    className="text-[10px] text-accent-violet font-bold hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-6 text-center text-xs text-gray-400">
                    No active notifications.
                  </div>
                ) : (
                  notifications.slice(0, 5).map((n) => {
                    const isFraud = n.type === 'fraud';
                    const isKyc = n.type === 'verification';
                    return (
                      <div 
                        key={n.id} 
                        onClick={() => {
                          setShowNotif(false);
                          setActiveTab('admin-kyc'); // Redirect or just read
                        }}
                        className="px-4 py-3 hover:bg-surface cursor-pointer border-b border-gray-50 flex items-start space-x-3 transition-colors"
                      >
                        <div className={`p-1.5 rounded-full mt-0.5 ${
                          isFraud ? 'bg-danger/10 text-danger-red' : (isKyc ? 'bg-gold/10 text-gold' : 'bg-teal/10 text-teal')
                        }`}>
                          {isFraud ? <ShieldAlert className="w-3.5 h-3.5" /> : (isKyc ? <User className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[11px] font-bold text-gray-800 truncate">{n.title}</h4>
                          <p className="text-[10px] text-gray-500 line-clamp-2 mt-0.5">{n.body}</p>
                          <span className="text-[9px] text-gray-400 font-semibold block mt-1">Just now</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              <div className="p-2 border-t border-gray-100 text-center">
                <button 
                  onClick={() => {
                    setShowNotif(false);
                    setActiveTab('admin-settings'); // Just as tab redirect placeholder
                  }}
                  className="text-xs text-accent-violet hover:text-primary-navy font-bold inline-block"
                >
                  View all system logs
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar Card */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotif(false);
            }}
            className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-surface transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-primary-navy text-white flex items-center justify-center font-extrabold text-xs border border-gray-200">
              V
            </div>
            <div className="text-left hidden tablet:block">
              <h4 className="text-xs font-bold text-primary-navy truncate">Vinay Kumar</h4>
              <p className="text-[9px] text-gray-400 uppercase tracking-widest font-extrabold">Active</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-30">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-[10px] text-gray-400">Signed in as</p>
                <p className="text-xs font-bold text-primary-navy truncate">admin@payrollos.com</p>
              </div>
              
              <button 
                onClick={() => {
                  setShowProfile(false);
                  setActiveTab('emp-profile');
                }}
                className="w-full flex items-center space-x-3 px-4 py-2 text-xs text-gray-700 hover:bg-surface transition-colors text-left"
              >
                <User className="w-3.5 h-3.5 text-gray-400" />
                <span>My Profile Info</span>
              </button>

              <button 
                onClick={() => {
                  setShowProfile(false);
                  setActiveTab('admin-settings');
                }}
                className="w-full flex items-center space-x-3 px-4 py-2 text-xs text-gray-700 hover:bg-surface transition-colors text-left"
              >
                <Settings className="w-3.5 h-3.5 text-gray-400" />
                <span>Org Settings</span>
              </button>

              <div className="border-t border-gray-100 mt-1 pt-1">
                <button 
                  onClick={() => {
                    setShowProfile(false);
                    setActiveTab('landing-page');
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-xs text-danger-red hover:bg-danger/10 transition-colors text-left font-bold"
                >
                  <LogOut className="w-3.5 h-3.5 text-danger-red" />
                  <span>Logout to Landing</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
