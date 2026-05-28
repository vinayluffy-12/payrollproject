import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import { 
  Users, CheckCircle, AlertTriangle, HelpCircle, 
  DollarSign, ArrowUpRight, ArrowDownRight, Clock, 
  Plus, Search, ShieldCheck, ChevronRight, FileText, 
  Trash2, Filter, Upload, Sparkles, Send, MapPin, 
  QrCode, Smile, Brain, Lock, RefreshCw, Layers, 
  Check, X, BookOpen, AlertCircle, Wallet
} from 'lucide-react';

export default function App() {
  // Global Mock States
  const [role, setRole] = useState('Super Admin');
  const [activeTab, setActiveTab] = useState('landing-page'); // Default page is public landing page!
  const [darkTheme, setDarkTheme] = useState(false);

  // 1. Notification Center state
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'fraud', title: 'High Severity Fraud Alert', body: 'AI engine detected high risk ghost employee indicator on Neha Patel (0 attendance days).', read_at: null },
    { id: 2, type: 'verification', title: 'New Verification Request', body: 'Siddharth Sen submitted identification papers. Review required.', read_at: null },
    { id: 3, type: 'payroll', title: 'Salary Deposited', body: 'Your salary for period April 2026 has been credited to your PayrollOS Wallet.', read_at: '2026-04-30' },
    { id: 4, type: 'system', title: 'FX Cache Refreshed', body: 'Live rates pulled from Open Exchange Rates API. Cached rate status: Active.', read_at: null },
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read_at: new Date().toISOString() })));
  };

  // 2. KYC verification queue
  const [kycQueue, setKycQueue] = useState([
    { id: 101, name: 'Siddharth Sen', email: 'siddharth@antigravity.com', phone: '+919988776655', dept: 'Engineering', idType: 'National ID', idNo: 'ID-887722-IN', status: 'pending', date: '2026-05-25', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150' },
    { id: 102, name: 'Aman Verma', email: 'aman@antigravity.com', phone: '+919988776656', dept: 'Marketing', idType: 'Passport', idNo: 'PP-009928-IN', status: 'pending', date: '2026-05-26', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150' },
    { id: 103, name: 'Tanya Roy', email: 'tanya@antigravity.com', phone: '+919988776657', dept: 'HR & Admin', idType: 'Drivers License', idNo: 'DL-992211-IN', status: 'accepted', date: '2026-05-20', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150' }
  ]);

  const [activeKycDetail, setActiveKycDetail] = useState(null);
  const [rejectionNotes, setRejectionNotes] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);

  // 3. Employee list
  const [employees, setEmployees] = useState([
    { id: 1, name: 'Vinay Kumar', dept: 'Engineering', desig: 'Engineering Director', joinDate: '2023-01-15', salary: 9500, currency: 'USD', status: 'active', bank: 'Citi bank (9876)', attendance: 98, leaves: 18, email: 'admin@payrollos.com' },
    { id: 2, name: 'Neha Patel', dept: 'Engineering', desig: 'Senior Full Stack Engineer', joinDate: '2024-03-01', salary: 6500, currency: 'USD', status: 'active', bank: 'HDFC Bank (1234)', attendance: 100, leaves: 14, email: 'employee@payrollos.com' },
    { id: 3, name: 'Aditya Roy', dept: 'Engineering', desig: 'QA Analyst', joinDate: '2025-05-10', salary: 3200, currency: 'EUR', status: 'active', bank: 'HDFC Bank (8821)', attendance: 92, leaves: 12, email: 'manager@payrollos.com' },
    { id: 4, name: 'Rohan Mehta', dept: 'Human Resources', desig: 'HR Specialist', joinDate: '2024-08-15', salary: 3000, currency: 'INR', status: 'active', bank: 'Citi Bank (4321)', attendance: 95, leaves: 15, email: 'hr@payrollos.com' },
    { id: 5, name: 'Deepak Rao', dept: 'Finance', desig: 'Financial Analyst', joinDate: '2024-11-20', salary: 4000, currency: 'USD', status: 'active', bank: 'SBI (0982)', attendance: 96, leaves: 10, email: 'auditor@payrollos.com' },
  ]);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [empActiveTab, setEmpActiveTab] = useState('profile');

  // Add Employee Form
  const [showAddEmpModal, setShowAddEmpModal] = useState(false);
  const [newEmpData, setNewEmpData] = useState({ name: '', email: '', dept: 'Engineering', desig: '', salary: 3000, currency: 'USD' });

  // 4. Payroll Run State (6-Step Stepper)
  const [payrollStep, setPayrollStep] = useState(1);
  const [payrollRunDate, setPayrollRunDate] = useState('2026-05-01 to 2026-05-31');
  const [payrollScope, setPayrollScope] = useState('All');
  const [payrollCurrency, setPayrollCurrency] = useState('USD');
  const [calculatedItems, setCalculatedItems] = useState([
    { id: 1, name: 'Vinay Kumar', gross: 9500, net: 8120, tax: 950, pf: 430 },
    { id: 2, name: 'Neha Patel', gross: 6500, net: 5540, tax: 650, pf: 310 },
    { id: 3, name: 'Aditya Roy', gross: 3200, net: 2710, tax: 320, pf: 170 },
  ]);
  const [fraudAlerts, setFraudAlerts] = useState([
    { id: 1, employeeId: 2, name: 'Neha Patel', anomaly_type: 'Ghost Employee Indicator', score: 0.9612, severity: 'high', status: 'open', details: 'Zero attendance check-ins logged for the pay period, but active gross salary is scheduled.' },
    { id: 2, employeeId: 3, name: 'Aditya Roy', anomaly_type: 'Salary Spike (>2σ)', score: 0.8123, severity: 'medium', status: 'open', details: 'Gross salary exceeds 2 standard deviations from organizational average.' }
  ]);
  const [activeFraudDetail, setActiveFraudDetail] = useState(null);
  const [disbursementProgress, setDisbursementProgress] = useState(0);
  const [disbursementStatus, setDisbursementStatus] = useState('Processing'); // Processing, Completed

  // Recalculator manual adjustment trigger
  const [manualAdjustmentId, setManualAdjustmentId] = useState(null);
  const [manualAdjustmentAmount, setManualAdjustmentAmount] = useState(0);

  // 5. ROI Slider state (Pricing page)
  const [roiEmployees, setRoiEmployees] = useState(120);

  // 6. FAQ State Accordions
  const [faqActive, setFaqActive] = useState(null);

  // 7. Onboarding 5-step Wizard State
  const [onboardStep, setOnboardStep] = useState(1);
  const [onboardData, setOnboardData] = useState({
    companyName: '', industry: 'Technology', country: 'India', empCount: '50-250',
    adminName: '', adminEmail: '', adminPassword: '', adminPhone: '',
    idType: 'Passport', idNo: '', idUrl: null,
    otpCode: '',
    baseCurrency: 'USD', payCycle: 'monthly', timezone: 'Asia/Kolkata'
  });
  const [onboardPending, setOnboardPending] = useState(false);

  // 8. 2FA Setup state
  const [show2FAPrompt, setShow2FAPrompt] = useState(false);
  const [mfaCode, setMfaCode] = useState('');

  // 9. Login Inputs
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 10. Employee wallet withdraw flow
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [linkedBank, setLinkedBank] = useState('Citibank ******1234');
  const [walletBalance, setWalletBalance] = useState(3200);
  const [walletTransactions, setWalletTransactions] = useState([
    { date: '2026-05-01', type: 'Salary Credit', amount: 3200, currency: 'USD', ref: 'Run #4321', status: 'completed' },
    { date: '2026-04-15', type: 'Withdrawal', amount: -2000, currency: 'USD', ref: 'Citi Bank transfer', status: 'completed' },
    { date: '2026-04-01', type: 'Salary Credit', amount: 3200, currency: 'USD', ref: 'Run #4310', status: 'completed' }
  ]);

  // 11. GPS check-in state
  const [attendanceLogs, setAttendanceLogs] = useState([
    { date: '2026-05-27', checkIn: '09:12 AM', checkOut: '06:15 PM', hours: 9.05, method: 'GPS', status: 'present' },
    { date: '2026-05-26', checkIn: '09:05 AM', checkOut: '06:00 PM', hours: 8.92, method: 'GPS', status: 'present' },
    { date: '2026-05-25', checkIn: '09:18 AM', checkOut: '05:45 PM', hours: 8.45, method: 'GPS', status: 'present' },
  ]);
  const [checkedInToday, setCheckedInToday] = useState(false);

  // 12. Employee leaves state
  const [leaveBalances, setLeaveBalances] = useState([
    { type: 'Annual', entitled: 20, used: 2, remaining: 18 },
    { type: 'Sick', entitled: 10, used: 1, remaining: 9 },
    { type: 'Casual', entitled: 8, used: 0, remaining: 8 },
  ]);
  const [employeeLeaves, setEmployeeLeaves] = useState([
    { type: 'Annual', from: '2026-06-10', to: '2026-06-12', days: 3, reason: 'Family trip', status: 'pending' },
    { type: 'Sick', from: '2026-04-12', to: '2026-04-12', days: 1, reason: 'Flu', status: 'approved' }
  ]);
  const [newLeave, setNewLeave] = useState({ type: 'Annual', from: '', to: '', reason: '' });

  // 13. AI Assistant chatbot state
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: 'Hello! I am your PayrollOS AI Assistant. I have loaded your current salary component, leave remaining (18 Annual days), and attendance registers. Ask me anything about your payslip, TDS taxes, or leaves!', time: '10:00 AM' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showHREscalation, setShowHREscalation] = useState(false);

  // 14. Reports state
  const [activeReportTab, setActiveReportTab] = useState('Summary');
  const [reportQuery, setReportQuery] = useState('');
  const [aiNarrativeSummary, setAiNarrativeSummary] = useState('');
  const [loadingAiReport, setLoadingAiReport] = useState(false);

  // 15. Multi currency settings state
  const [fxRates, setFxRates] = useState([
    { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.00, status: 'enabled' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 83.45, status: 'enabled' },
    { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92, status: 'enabled' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', rate: 3.67, status: 'enabled' },
  ]);

  // 16. Org Chart state
  const [expandedNodes, setExpandedNodes] = useState({ 'root': true, 'eng': true, 'hr': true });
  const [searchNode, setSearchNode] = useState('');

  // 17. System Settings Active Tab
  const [settingsTab, setSettingsTab] = useState('profile');

  // 18. Audit log records
  const [auditLogs, setAuditLogs] = useState([
    { time: '2026-05-27 10:24 PM', actor: 'Vinay Kumar', action: 'manual_fx_rate_update', entity: 'Currency EUR', old: '0.92', new: '0.91', ip: '192.168.1.1' },
    { time: '2026-05-27 10:12 PM', actor: 'Swetha Sharma', action: 'employee_verification_approved', entity: 'User Siddharth', old: 'pending', new: 'active', ip: '192.168.1.4' },
    { time: '2026-05-27 09:34 PM', actor: 'System Seeder', action: 'database_migration', entity: 'System', old: 'empty', new: 'seeded_demo', ip: '127.0.0.1' },
  ]);

  // Simulate AI Chatbot Reply
  const sendChatMessage = (text) => {
    if (!text.trim()) return;
    
    const newMsg = { sender: 'user', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = "I'm analyzing your employee ledger... could you please clarify that question?";
      const lower = text.toLowerCase();
      
      if (lower.includes('payslip') || lower.includes('salary') || lower.includes('explain')) {
        reply = `Your last payslip was credited on May 1st for $3,200.00 Net. Your Gross was $3,800.00 with deductions: TDS Tax ($380.00), PF Contribution ($190.00), and Prof Tax ($30.00). If you have further queries about your deductions, I can escalate this to Swetha Sharma (HR Manager).`;
      } else if (lower.includes('leaves') || lower.includes('leave')) {
        reply = `You currently have 18 remaining Annual leave days out of 20 entitled. Your Casual leaves remaining are 8, and Sick leaves are 9. You can apply for leave right from this dashboard using the submit form on the Leave Request page!`;
      } else if (lower.includes('next salary') || lower.includes('credit')) {
        reply = `Your next salary credit is scheduled for June 1st, 2026 (in 4 days). The calculated net amount will be $3,200.00 USD.`;
      } else if (lower.includes('tds') || lower.includes('tax')) {
        reply = `TDS (Tax Deducted at Source) is calculated at a flat rate of 10% on your basic salary component. This matches the standard tax slab configuration set for Antigravity Technologies.`;
      } else {
        setShowHREscalation(true);
        reply = `I don't have direct access to process that specific transaction. Would you like me to connect you with our HR Specialist and open an official ticket?`;
      }

      setChatMessages(prev => [...prev, {
        sender: 'ai',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsTyping(false);
    }, 1200);
  };

  // Simulate live disbursement websocket ticker
  useEffect(() => {
    let timer;
    if (activeTab === 'admin-payroll' && payrollStep === 6 && disbursementProgress < 100) {
      setDisbursementStatus('Processing');
      timer = setInterval(() => {
        setDisbursementProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            setDisbursementStatus('Completed');
            // Auto trigger notification
            setNotifications(prevNotifs => [
              { id: Date.now(), type: 'payroll', title: 'Salary Disbursed', body: 'Disbursement of $16,370.00 USD processed successfully via automated banking rails.', read_at: null },
              ...prevNotifs
            ]);
            return 100;
          }
          return prev + 20;
        });
      }, 500);
    }
    return () => clearInterval(timer);
  }, [activeTab, payrollStep, disbursementProgress]);

  // CSS variables selector for Dark Mode theme
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkTheme) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkTheme]);

  return (
    <div className={`min-h-screen ${darkTheme ? 'dark bg-gray-950 text-white' : 'bg-surface text-gray-800'}`}>
      
      {/* Dynamic Tab Page router */}

      {/* ==========================================
          PAGE 1: LANDING PAGE (Public Portal)
          ========================================== */}
      {activeTab === 'landing-page' && (
        <div className="font-sans antialiased bg-primary-navy">
          {/* Header Frosted Navbar */}
          <nav className="glass-panel sticky top-0 w-full z-30 transition-all border-b border-white/10 px-8 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center font-extrabold text-primary-navy">P</div>
              <span className="font-black text-white text-lg tracking-wider">Payroll<span className="text-gold">OS</span></span>
            </div>
            
            <div className="hidden tablet:flex items-center space-x-8 text-xs font-semibold text-white/90">
              <a href="#features" className="hover:text-gold transition-colors">Features</a>
              <a href="#stepper" className="hover:text-gold transition-colors">How It Works</a>
              <button onClick={() => setActiveTab('pricing-page')} className="hover:text-gold transition-colors">Pricing</button>
              <a href="#" className="hover:text-gold transition-colors">About</a>
              <a href="#" className="hover:text-gold transition-colors">Docs</a>
            </div>

            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setActiveTab('demo-sandbox')}
                className="bg-gold hover:bg-gold/90 text-primary-navy px-4 py-2 rounded-full text-xs font-bold shadow-lg transition-all transform hover:scale-105"
              >
                Request Demo
              </button>
              <button 
                onClick={() => setActiveTab('login-page')}
                className="border border-white/30 text-white hover:bg-white/10 px-4 py-2 rounded-full text-xs font-bold transition-all"
              >
                Sign In
              </button>
            </div>
          </nav>

          {/* Hero Section */}
          <header className="gradient-navy-indigo py-24 px-12 relative overflow-hidden flex flex-col desktop:flex-row items-center justify-between text-white">
            <div className="max-w-2xl text-left space-y-6">
              <span className="bg-gold/15 text-gold border border-gold/30 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-extrabold">
                ✨ SOC2 Compliant & GDPR Ready
              </span>
              <h1 className="text-4xl tablet:text-5xl font-black leading-tight">
                The AI Payroll Platform <br />
                <span className="text-gold">Built for the Future</span>
              </h1>
              <p className="text-sm tablet:text-base text-surface/80 leading-relaxed">
                Automate complex tax computations, verify your workforce with identity gateways, and prevent treasury losses with real-time ML fraud detection. Trusted by 500+ enterprises.
              </p>
              
              <div className="flex items-center space-x-4 pt-4">
                <button 
                  onClick={() => setActiveTab('register-page')}
                  className="bg-gold hover:bg-gold/90 text-primary-navy px-6 py-3.5 rounded-full text-xs font-black shadow-2xl transition-all transform hover:scale-105"
                >
                  Start Free Trial
                </button>
                <button 
                  onClick={() => setActiveTab('demo-sandbox')}
                  className="border border-white/40 text-white hover:bg-white/10 px-6 py-3.5 rounded-full text-xs font-black transition-all"
                >
                  Watch Demo
                </button>
              </div>

              <div className="flex flex-wrap gap-6 pt-8 text-[11px] font-bold text-surface/60">
                <span>✓ 99.95% Uptime SLA</span>
                <span>✓ 20+ Global Currencies</span>
                <span>✓ 10+ Country Tax Support</span>
              </div>
            </div>

            <div className="mt-12 desktop:mt-0 max-w-lg relative animate-float">
              <div className="bg-white/10 border border-white/20 p-4 rounded-2xl shadow-3xl backdrop-blur-md">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=500&q=80" 
                  alt="Dashboard Preview" 
                  className="rounded-xl shadow-2xl border border-white/20 object-cover w-full h-64"
                />
                <div className="absolute -bottom-6 -left-6 bg-teal text-white p-3.5 rounded-xl shadow-2xl border border-teal/20 text-left">
                  <p className="text-[9px] uppercase tracking-wider text-teal-light font-bold">Total Disbursed</p>
                  <h4 className="text-lg font-black">$2,481,992.00</h4>
                </div>
              </div>
            </div>
          </header>

          {/* Stats Bar */}
          <section className="bg-surface-dark py-8 px-12 border-y border-white/10 flex flex-wrap items-center justify-around gap-8 text-center text-primary-navy">
            <div>
              <h3 className="text-3xl font-black text-primary-navy">500+</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Companies Managed</p>
            </div>
            <div>
              <h3 className="text-3xl font-black text-primary-navy">50,000+</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Employees Paid</p>
            </div>
            <div>
              <h3 className="text-3xl font-black text-primary-navy">$2B+</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Payroll Processed</p>
            </div>
            <div>
              <h3 className="text-3xl font-black text-primary-navy">99.95%</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">System Uptime SLA</p>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="py-24 px-12 bg-white text-center space-y-16">
            <div className="max-w-2xl mx-auto space-y-4">
              <span className="text-xs text-accent-violet uppercase tracking-widest font-black">⚙ COMPLETE CORE CAPABILITIES</span>
              <h2 className="text-3xl font-black text-primary-navy">All-In-One Intelligent Platform</h2>
              <p className="text-xs text-gray-500 leading-relaxed">
                Streamline global employee directories, automate direct deposits, and secure identity onboarding in a unified dashboard.
              </p>
            </div>

            <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-8">
              {/* Feature Cards */}
              <div className="p-6 rounded-2xl border border-gray-100 bg-surface/50 text-left space-y-4 hover:shadow-xl transition-all">
                <div className="w-10 h-10 rounded-xl bg-primary-navy text-white flex items-center justify-center"><Brain className="w-5 h-5 text-gold" /></div>
                <h4 className="font-extrabold text-primary-navy text-sm">AI-Powered Payroll Runs</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">Auto calculations, zero-error tax deductions, and professional tax matching with localized compliant engines.</p>
                <a href="#" className="text-xs font-bold text-accent-violet hover:underline inline-block pt-2">Learn more →</a>
              </div>

              <div className="p-6 rounded-2xl border border-gray-100 bg-surface/50 text-left space-y-4 hover:shadow-xl transition-all">
                <div className="w-10 h-10 rounded-xl bg-accent-violet text-white flex items-center justify-center"><CheckCircle className="w-5 h-5 text-white" /></div>
                <h4 className="font-extrabold text-primary-navy text-sm">Identity Onboarding Gateway</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">KYC passport/national ID validation with image verification models before any user touches active payroll ledgers.</p>
                <a href="#" className="text-xs font-bold text-accent-violet hover:underline inline-block pt-2">Learn more →</a>
              </div>

              <div className="p-6 rounded-2xl border border-gray-100 bg-surface/50 text-left space-y-4 hover:shadow-xl transition-all">
                <div className="w-10 h-10 rounded-xl bg-danger text-white flex items-center justify-center"><ShieldCheck className="w-5 h-5 text-white" /></div>
                <h4 className="font-extrabold text-primary-navy text-sm">Smart Fraud Detection</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">Real-time Python FastAPI Isolation Forest anomaly checking to flags ghost employees or sudden manual edits instantly.</p>
                <a href="#" className="text-xs font-bold text-accent-violet hover:underline inline-block pt-2">Learn more →</a>
              </div>

              <div className="p-6 rounded-2xl border border-gray-100 bg-surface/50 text-left space-y-4 hover:shadow-xl transition-all">
                <div className="w-10 h-10 rounded-xl bg-teal text-white flex items-center justify-center"><MapPin className="w-5 h-5 text-white" /></div>
                <h4 className="font-extrabold text-primary-navy text-sm">GPS Biometric Attendance</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">Geofenced mobile check-ins with QR-scanning or face matches to sync time-sheets directly to calculating runs.</p>
                <a href="#" className="text-xs font-bold text-accent-violet hover:underline inline-block pt-2">Learn more →</a>
              </div>

              <div className="p-6 rounded-2xl border border-gray-100 bg-surface/50 text-left space-y-4 hover:shadow-xl transition-all">
                <div className="w-10 h-10 rounded-xl bg-gold text-white flex items-center justify-center"><Wallet className="w-5 h-5 text-primary-navy" /></div>
                <h4 className="font-extrabold text-primary-navy text-sm">Multi-Currency Payouts</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">Enable payouts in 20+ currencies with hourly Open Exchange API caching and local bank ledger withdraw queues.</p>
                <a href="#" className="text-xs font-bold text-accent-violet hover:underline inline-block pt-2">Learn more →</a>
              </div>

              <div className="p-6 rounded-2xl border border-gray-100 bg-surface/50 text-left space-y-4 hover:shadow-xl transition-all">
                <div className="w-10 h-10 rounded-xl bg-teal text-white flex items-center justify-center"><Brain className="w-5 h-5 text-gold" /></div>
                <h4 className="font-extrabold text-primary-navy text-sm">AI Chatbot Assistant</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">Provide 24/7 answers regarding payslip explanations, leaf balances, and tax brackets in English, Hindi, and Arabic.</p>
                <a href="#" className="text-xs font-bold text-accent-violet hover:underline inline-block pt-2">Learn more →</a>
              </div>
            </div>
          </section>

          {/* Stepper Section */}
          <section id="stepper" className="py-24 px-12 bg-surface text-center space-y-16">
            <div className="max-w-2xl mx-auto space-y-4">
              <span className="text-xs text-accent-violet uppercase tracking-widest font-black">⚙ 3-STEP INTEGRATION FLOW</span>
              <h2 className="text-3xl font-black text-primary-navy">Simple, Streamlined Execution</h2>
            </div>

            <div className="grid grid-cols-1 desktop:grid-cols-3 gap-12 relative max-w-5xl mx-auto">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 text-left relative space-y-4">
                <span className="absolute -top-6 left-6 w-12 h-12 rounded-full bg-gold text-primary-navy flex items-center justify-center font-black text-lg shadow-lg">1</span>
                <h4 className="font-extrabold text-primary-navy text-sm pt-4">Onboard & KYC Verify</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">Admins configure the organization profile and register staff. Employees upload passport photos to undergo verified authentication checks.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 text-left relative space-y-4">
                <span className="absolute -top-6 left-6 w-12 h-12 rounded-full bg-accent-violet text-white flex items-center justify-center font-black text-lg shadow-lg">2</span>
                <h4 className="font-extrabold text-primary-navy text-sm pt-4">Automate Calculations</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">The calculation engine pulls geofenced attendance logs, processes localized TDS tax brackets, and flags anomalies with AI review models.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 text-left relative space-y-4">
                <span className="absolute -top-6 left-6 w-12 h-12 rounded-full bg-teal text-white flex items-center justify-center font-black text-lg shadow-lg">3</span>
                <h4 className="font-extrabold text-primary-navy text-sm pt-4">Disburse & PDF Payslip</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">Super Admins approve runs to trigger automated direct deposits. Payslip PDFs are created on-demand and pushed to employee wallets.</p>
              </div>
            </div>
          </section>

          {/* Integration Logos */}
          <section className="bg-white py-12 text-center space-y-6">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Integrates with your existing SASS stack</p>
            <div className="flex flex-wrap items-center justify-center gap-12 text-gray-400 font-black text-sm uppercase">
              <span>Slack</span>
              <span>QuickBooks</span>
              <span>Workday</span>
              <span>BambooHR</span>
              <span>SAP</span>
              <span>Zoho HR</span>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-primary-navy text-white/70 py-16 px-12 border-t border-white/10 grid grid-cols-1 tablet:grid-cols-4 gap-12 text-xs">
            <div className="space-y-4 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center font-extrabold text-primary-navy">P</div>
                <span className="font-black text-white text-md tracking-wider">PayrollOS</span>
              </div>
              <p className="text-gray-400 leading-relaxed">Automate global compliance and secure digital payouts on an intelligent ML payroll platform.</p>
            </div>
            
            <div className="space-y-4 text-left">
              <h4 className="font-extrabold text-white uppercase tracking-wider text-[10px]">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-gold">Features</a></li>
                <li><a href="#" className="hover:text-gold">Pricing plans</a></li>
                <li><a href="#" className="hover:text-gold">AI Fraud Sentinel</a></li>
                <li><a href="#" className="hover:text-gold">Biometrics</a></li>
              </ul>
            </div>

            <div className="space-y-4 text-left">
              <h4 className="font-extrabold text-white uppercase tracking-wider text-[10px]">Compliance</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-gold">SOC2 certification</a></li>
                <li><a href="#" className="hover:text-gold">GDPR procedures</a></li>
                <li><a href="#" className="hover:text-gold">Data vault protection</a></li>
                <li><a href="#" className="hover:text-gold">Tax guidelines</a></li>
              </ul>
            </div>

            <div className="space-y-4 text-left">
              <h4 className="font-extrabold text-white uppercase tracking-wider text-[10px]">Sign Up</h4>
              <p className="text-gray-400">Receive tax changes alerts.</p>
              <div className="flex">
                <input type="email" placeholder="email address" className="bg-white/10 border border-white/20 px-3 py-2 rounded-l-lg focus:outline-none focus:border-gold text-white text-xs w-full" />
                <button className="bg-gold text-primary-navy font-bold px-3 py-2 rounded-r-lg hover:bg-gold/90">→</button>
              </div>
            </div>
          </footer>
        </div>
      )}

      {/* ==========================================
          PAGE 2: PRICING PAGE (Public Pricing & ROI Slider)
          ========================================== */}
      {activeTab === 'pricing-page' && (
        <div className="font-sans py-16 px-8 max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <button onClick={() => setActiveTab('landing-page')} className="text-xs font-bold text-accent-violet hover:underline">← Back to landing</button>
            <h1 className="text-3xl font-black text-primary-navy">Simple, Transparent Enterprise Tiers</h1>
            <p className="text-xs text-gray-500">Pick the optimal tier for your team size. Cancel anytime.</p>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 desktop:grid-cols-3 gap-8 items-stretch">
            
            {/* Starter Tier */}
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-lg text-left flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <h4 className="font-extrabold text-gray-500 uppercase tracking-widest text-[10px]">Starter Plan</h4>
                <div className="flex items-baseline space-x-1">
                  <span className="text-4xl font-black text-primary-navy">$49</span>
                  <span className="text-xs text-gray-400">/ month</span>
                </div>
                <p className="text-[11px] text-gray-500">Essential tools for growing teams up to 50 employees.</p>
              </div>
              <ul className="space-y-3 text-[11px] text-gray-600 flex-1 py-4 border-t border-gray-100">
                <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-teal" /> <span>Up to 50 active workers</span></li>
                <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-teal" /> <span>Standard localized tax engines</span></li>
                <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-teal" /> <span>GPS Geofenced check-in logs</span></li>
                <li className="flex items-center space-x-2"><X className="w-3.5 h-3.5 text-danger-red" /> <span>AI Fraud Detection Model</span></li>
                <li className="flex items-center space-x-2"><X className="w-3.5 h-3.5 text-danger-red" /> <span>Multi-Currency payments</span></li>
              </ul>
              <button onClick={() => setActiveTab('register-page')} className="w-full bg-primary-navy text-white font-bold py-3 rounded-full text-xs hover:bg-accent-violet transition-colors">Start Free Trial</button>
            </div>

            {/* Growth Tier (Highlighted) */}
            <div className="bg-white p-8 rounded-3xl border-2 border-gold shadow-2xl text-left flex flex-col justify-between space-y-6 relative transform scale-102">
              <span className="bg-gold text-primary-navy font-black px-4 py-1 rounded-full text-[9px] uppercase tracking-widest absolute -top-3.5 right-6 shadow-md">⭐ Most Popular</span>
              <div className="space-y-3">
                <h4 className="font-extrabold text-gold uppercase tracking-widest text-[10px]">Growth Plan</h4>
                <div className="flex items-baseline space-x-1">
                  <span className="text-4xl font-black text-primary-navy">$149</span>
                  <span className="text-xs text-gray-400">/ month</span>
                </div>
                <p className="text-[11px] text-gray-500">Complete AI capabilities for teams up to 250 employees.</p>
              </div>
              <ul className="space-y-3 text-[11px] text-gray-600 flex-1 py-4 border-t border-gray-100">
                <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-teal" /> <span>Up to 250 active workers</span></li>
                <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-teal" /> <span>KYC Onboarding documentation checks</span></li>
                <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-teal" /> <span>AI Fraud Anomaly detection Alerts</span></li>
                <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-teal" /> <span>Multi-Currency payslips & FX updates</span></li>
                <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-teal" /> <span>24/7 AI Chatbot assistant</span></li>
              </ul>
              <button onClick={() => setActiveTab('register-page')} className="w-full bg-gold text-primary-navy font-black py-3 rounded-full text-xs hover:bg-gold/90 shadow-lg transition-all">Start Free Trial</button>
            </div>

            {/* Enterprise Tier */}
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-lg text-left flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <h4 className="font-extrabold text-gray-500 uppercase tracking-widest text-[10px]">Enterprise Plan</h4>
                <div className="flex items-baseline space-x-1">
                  <span className="text-4xl font-black text-primary-navy">Custom</span>
                </div>
                <p className="text-[11px] text-gray-500">Enterprise security safeguards for teams over 500 employees.</p>
              </div>
              <ul className="space-y-3 text-[11px] text-gray-600 flex-1 py-4 border-t border-gray-100">
                <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-teal" /> <span>Unlimited headcount scale</span></li>
                <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-teal" /> <span>Custom Isolation Forest retrain scheduling</span></li>
                <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-teal" /> <span>IP whitelisting admin security controls</span></li>
                <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-teal" /> <span>SLA custom support channels</span></li>
                <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-teal" /> <span>Dedicated auditor workspace access</span></li>
              </ul>
              <button onClick={() => setActiveTab('demo-sandbox')} className="w-full border-2 border-primary-navy text-primary-navy font-bold py-3 rounded-full text-xs hover:bg-surface transition-colors">Book custom review</button>
            </div>
          </div>

          {/* ROI Calculator */}
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xl max-w-3xl mx-auto space-y-6 text-left">
            <div>
              <span className="text-[10px] text-accent-violet font-extrabold uppercase tracking-widest">💰 COST SAVING SIMULATOR</span>
              <h3 className="text-lg font-black text-primary-navy mt-1">How much could you save with PayrollOS?</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold text-gray-700">
                <span>Active Headcount: {roiEmployees} employees</span>
                <span className="text-accent-violet">Estimated Saved Hours</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="500" 
                value={roiEmployees}
                onChange={(e) => setRoiEmployees(parseInt(e.target.value))}
                className="w-full accent-accent-violet h-2 bg-gray-150 rounded-lg cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-8 pt-4 border-t border-gray-100 text-center">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Hours Saved / month</p>
                <h4 className="text-3xl font-black text-teal">{(roiEmployees * 0.4).toFixed(0)} Hours</h4>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Financial Savings / month</p>
                <h4 className="text-3xl font-black text-accent-violet">${(roiEmployees * 0.4 * 50).toLocaleString()}</h4>
              </div>
            </div>
            <p className="text-[9px] text-center text-gray-400 italic">Savings estimated at $50/hr internal operational salary rate. Real results can vary.</p>
          </div>

          {/* FAQ Accordion */}
          <div className="max-w-3xl mx-auto space-y-4 text-left">
            <h3 className="text-xl font-black text-primary-navy text-center mb-8">Frequently Asked Questions</h3>
            
            {[
              { q: 'Is my data SOC2 and GDPR compliant?', a: 'Yes! PayrollOS is fully audited under SOC2 Type II security principles. All PII employee data (bank coordinates, ID numbers) is stored inside high-grade encrypted AWS KMS databases.' },
              { q: 'How does the Python ML Fraud Detection operate?', a: 'When calculations are completed, the system runs an Isolation Forest outlier model. This detects salary edits, ghost employees, and duplicate IBAN routing accounts, keeping your treasury secure.' },
              { q: 'How does GPS and Face biometrics check-in work?', a: 'Employees can check in on their mobile browser using GPS geofencing (validating they are within the corporate radius) or scan a dynamic QR code on the office front lobby terminal.' },
              { q: 'Can I override live FX rates manually?', a: 'Absolutely. Super Admins have complete control to set fixed overrides for specific currencies before executing a payroll calculation cycle.' }
            ].map((faq, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all shadow-sm">
                <button 
                  onClick={() => setFaqActive(faqActive === idx ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between font-bold text-xs text-primary-navy hover:bg-surface text-left"
                >
                  <span>{faq.q}</span>
                  <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${faqActive === idx ? 'rotate-90' : ''}`} />
                </button>
                {faqActive === idx && (
                  <div className="px-6 py-4 bg-surface/30 text-[11px] text-gray-600 leading-relaxed border-t border-gray-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==========================================
          PAGE 3: AUTH PAGES (Login, 5-Step Register, Forgot Pass)
          ========================================== */}
      {activeTab === 'login-page' && (
        <div className="min-h-screen grid grid-cols-1 desktop:grid-cols-2">
          {/* Left Panel */}
          <div className="gradient-navy-indigo text-white p-16 flex flex-col justify-between text-left relative overflow-hidden hidden desktop:flex">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center font-bold text-primary-navy">P</div>
              <span className="font-extrabold text-white text-md tracking-wider">PayrollOS</span>
            </div>
            
            <div className="space-y-6">
              <span className="bg-white/10 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest text-gold">🤖 AI-Powered Platform</span>
              <h2 className="text-3xl font-black leading-tight text-white">Streamline Treasury, Timecards, & KYC compliance</h2>
              <p className="text-xs text-surface/70 leading-relaxed">Login to explore role-specific management dashboards. All endpoints are secured under TLS 1.3 encryption pipelines.</p>
            </div>

            <p className="text-[10px] text-surface/50">© 2026 Antigravity Technologies. All rights reserved.</p>
          </div>

          {/* Right Panel: Login Form */}
          <div className="bg-white p-12 tablet:p-24 flex flex-col justify-center text-left relative">
            <button onClick={() => setActiveTab('landing-page')} className="text-xs text-accent-violet font-bold hover:underline absolute top-8 left-8">← Home portal</button>
            
            <div className="max-w-sm w-full mx-auto space-y-8">
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-primary-navy">Welcome back!</h2>
                <p className="text-xs text-gray-400">Provide credentials to enter your management workspace.</p>
              </div>

              {show2FAPrompt ? (
                <div className="space-y-6 animate-float-quick">
                  <div className="bg-gold/10 border border-gold/30 p-3 rounded-lg flex items-start space-x-3 text-xs text-primary-navy">
                    <Lock className="w-4 h-4 text-gold mt-0.5" />
                    <p><strong>MFA TOTP required.</strong> Please open your Google Authenticator app and enter the 6-digit verification code below.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-extrabold text-gray-500">6-Digit Code</label>
                    <input 
                      type="text" 
                      maxLength="6"
                      placeholder="999999"
                      value={mfaCode}
                      onChange={(e) => setMfaCode(e.target.value)}
                      className="w-full bg-surface border border-gray-200 rounded-lg p-3 text-center text-xl font-bold tracking-widest focus:bg-white"
                    />
                  </div>

                  <button 
                    onClick={() => {
                      if (mfaCode.length === 6 || mfaCode === '999999') {
                        // Redirect depending on role
                        if (role === 'Super Admin') setActiveTab('admin-overview');
                        else if (role === 'HR Manager') setActiveTab('hr-overview');
                        else if (role === 'Payroll Admin') setActiveTab('payroll-overview');
                        else if (role === 'Manager') setActiveTab('mgr-overview');
                        else if (role === 'Employee') setActiveTab('emp-overview');
                        else if (role === 'Finance Auditor') setActiveTab('auditor-overview');
                        setShow2FAPrompt(false);
                        setMfaCode('');
                      }
                    }}
                    className="w-full bg-gold hover:bg-gold/90 text-primary-navy font-black py-3 rounded-lg text-xs shadow-lg transition-all"
                  >
                    Confirm & Proceed
                  </button>
                </div>
              ) : (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  // For demo, let credentials match any user, trigger 2FA Setup or straight Login
                  setShow2FAPrompt(true);
                }} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-extrabold text-gray-500">Corporate Email</label>
                    <input 
                      type="email" 
                      placeholder="admin@payrollos.com" 
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full bg-surface border border-gray-200 rounded-lg p-3 text-xs text-gray-700 focus:bg-white"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-extrabold text-gray-500">Security Password</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        placeholder="••••••••••••" 
                        value={loginPass}
                        onChange={(e) => setLoginPass(e.target.value)}
                        className="w-full bg-surface border border-gray-200 rounded-lg p-3 text-xs text-gray-700 pr-10 focus:bg-white"
                        required
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-[10px] text-gray-400 font-extrabold"
                      >
                        {showPassword ? 'HIDE' : 'SHOW'}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-bold text-gray-500">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-gray-300 text-accent-violet focus:ring-accent-violet" />
                      <span>Keep signed in</span>
                    </label>
                    <a href="#" onClick={() => alert('OTP reset dispatch simulated.')} className="text-accent-violet hover:underline">Forgot password?</a>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-primary-navy hover:bg-accent-violet text-white font-bold py-3 rounded-lg text-xs shadow-lg transition-colors mt-2"
                  >
                    Authenticate Account
                  </button>

                  <div className="text-center pt-2">
                    <p className="text-[11px] text-gray-400">
                      Need a corporate client profile?{' '}
                      <button type="button" onClick={() => setActiveTab('register-page')} className="text-accent-violet font-bold hover:underline">Register onboarding</button>
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          PAGE 3.1: REGISTER PAGE (5-Step wizard Onboarding)
          ========================================== */}
      {activeTab === 'register-page' && (
        <div className="min-h-screen bg-surface flex items-center justify-center p-8">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl p-8 tablet:p-12 max-w-xl w-full text-left space-y-8 relative">
            <button onClick={() => setActiveTab('landing-page')} className="text-xs text-accent-violet font-bold absolute top-6 right-8 hover:underline">← Cancel</button>
            
            {/* Header step tracking */}
            <div className="space-y-4">
              <span className="text-[10px] text-accent-violet font-extrabold uppercase tracking-widest">🏢 CORPORATE WIZARD ONBOARDING</span>
              <h2 className="text-xl font-black text-primary-navy">Register Antigravity Corporate Payouts</h2>
              
              {/* Stepper Progress bar */}
              <div className="flex items-center justify-between pt-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div key={s} className="flex items-center flex-1 last:flex-initial">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      onboardStep === s 
                        ? 'bg-gold text-primary-navy shadow-lg font-black' 
                        : (onboardStep > s ? 'bg-teal text-white' : 'bg-gray-100 text-gray-400')
                    }`}>
                      {onboardStep > s ? '✓' : s}
                    </div>
                    {s < 5 && (
                      <div className={`h-1 flex-1 mx-2 rounded-full ${
                        onboardStep > s ? 'bg-teal' : 'bg-gray-100'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Steps Container */}
            {onboardPending ? (
              <div className="text-center py-12 space-y-6 animate-float-quick">
                <div className="w-16 h-16 rounded-full bg-gold/15 border border-gold flex items-center justify-center mx-auto text-gold animate-bounce">
                  <RefreshCw className="w-8 h-8 animate-spin" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-primary-navy">Verification Review Pending</h3>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">Thank you for submitting passport ID verification documents. Your administrator credentials will activate within 24 hours.</p>
                </div>
                <div className="pt-4">
                  <button 
                    onClick={() => {
                      // Bypass to admin dashboard overview
                      setActiveTab('admin-overview');
                      setOnboardPending(false);
                      setOnboardStep(1);
                    }}
                    className="bg-primary-navy text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-accent-violet shadow-lg transition-colors"
                  >
                    Bypass and Log In as Super Admin (Demo Mode)
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Step 1: Company details */}
                {onboardStep === 1 && (
                  <div className="space-y-4 animate-float-quick">
                    <h3 className="text-sm font-bold text-primary-navy">Step 1: Corporate Profile Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-gray-400">Company Name</label>
                        <input type="text" placeholder="Antigravity Ltd" className="w-full bg-surface border border-gray-200 rounded-lg p-2.5 text-xs focus:bg-white" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-gray-400">Industry</label>
                        <select className="w-full bg-surface border border-gray-200 rounded-lg p-2.5 text-xs focus:bg-white">
                          <option>Technology & Software</option>
                          <option>Finance & Consulting</option>
                          <option>Health & Science</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-gray-400">HQ Country</label>
                        <input type="text" placeholder="India" className="w-full bg-surface border border-gray-200 rounded-lg p-2.5 text-xs focus:bg-white" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-gray-400">Employee Range</label>
                        <select className="w-full bg-surface border border-gray-200 rounded-lg p-2.5 text-xs focus:bg-white">
                          <option>1 - 50 staff</option>
                          <option>50 - 250 staff</option>
                          <option>250+ staff</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Admin accounts */}
                {onboardStep === 2 && (
                  <div className="space-y-4 animate-float-quick">
                    <h3 className="text-sm font-bold text-primary-navy">Step 2: Root Admin Credentials</h3>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-gray-400">Full Name</label>
                      <input type="text" placeholder="Vinay Kumar" className="w-full bg-surface border border-gray-200 rounded-lg p-2.5 text-xs focus:bg-white" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-gray-400">Root Email</label>
                        <input type="email" placeholder="admin@antigravity.com" className="w-full bg-surface border border-gray-200 rounded-lg p-2.5 text-xs focus:bg-white" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-gray-400">Mobile Phone</label>
                        <input type="text" placeholder="+91 98765 43210" className="w-full bg-surface border border-gray-200 rounded-lg p-2.5 text-xs focus:bg-white" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-gray-400">Password</label>
                      <input type="password" placeholder="••••••••••••" className="w-full bg-surface border border-gray-200 rounded-lg p-2.5 text-xs focus:bg-white" />
                      <div className="h-1 bg-gray-150 w-full rounded-full overflow-hidden mt-1.5"><div className="w-3/4 h-full bg-teal" /></div>
                      <p className="text-[9px] text-gray-400">Strength check: Strong (Capital, numerical, and dynamic token characters matched)</p>
                    </div>
                  </div>
                )}

                {/* Step 3: ID verification */}
                {onboardStep === 3 && (
                  <div className="space-y-4 animate-float-quick">
                    <h3 className="text-sm font-bold text-primary-navy">Step 3: Identity Verification (KYC check)</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-gray-400">ID Document Type</label>
                        <select className="w-full bg-surface border border-gray-200 rounded-lg p-2.5 text-xs focus:bg-white">
                          <option>Passport Book</option>
                          <option>National ID / Aadhaar Card</option>
                          <option>Drivers License card</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-gray-400">Document Number</label>
                        <input type="text" placeholder="PP-882211-IN" className="w-full bg-surface border border-gray-200 rounded-lg p-2.5 text-xs focus:bg-white" />
                      </div>
                    </div>
                    
                    <div className="border-2 border-dashed border-gray-200 p-6 rounded-2xl bg-surface/30 text-center space-y-2">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                      <p className="text-[10px] font-bold text-gray-500">Drag and drop passport photo scan files</p>
                      <p className="text-[9px] text-gray-400">PDF, JPG, PNG up to 10MB limits</p>
                    </div>
                  </div>
                )}

                {/* Step 4: OTP Check */}
                {onboardStep === 4 && (
                  <div className="space-y-4 animate-float-quick">
                    <h3 className="text-sm font-bold text-primary-navy">Step 4: Dual-Channel OTP Check</h3>
                    <p className="text-[11px] text-gray-500">We have dispatched a 6-digit OTP code to both your provided mobile number and corporate root inbox simultaneously.</p>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-gray-400">6-Digit Code</label>
                      <input type="text" maxLength="6" placeholder="999999" className="w-full bg-surface border border-gray-200 rounded-lg p-3 text-center text-lg font-bold tracking-widest focus:bg-white" />
                    </div>
                  </div>
                )}

                {/* Step 5: Setup configurations */}
                {onboardStep === 5 && (
                  <div className="space-y-4 animate-float-quick">
                    <h3 className="text-sm font-bold text-primary-navy">Step 5: Base Payroll Configurations</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-gray-400">Base Currency</label>
                        <select className="w-full bg-surface border border-gray-200 rounded-lg p-2.5 text-xs focus:bg-white">
                          <option>USD ($)</option>
                          <option>INR (₹)</option>
                          <option>EUR (€)</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-gray-400">Payroll cutoff Cycle</label>
                        <select className="w-full bg-surface border border-gray-200 rounded-lg p-2.5 text-xs focus:bg-white">
                          <option>Monthly (End of month)</option>
                          <option>Bi-Weekly (Alternate Fridays)</option>
                          <option>Weekly (Every Thursday)</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-gray-400">HQ Timezone</label>
                      <select className="w-full bg-surface border border-gray-200 rounded-lg p-2.5 text-xs focus:bg-white">
                        <option>Asia/Kolkata (GMT+5:30)</option>
                        <option>UTC (GMT+0)</option>
                        <option>America/New_York (GMT-5)</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Wizard Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-150">
                  {onboardStep > 1 ? (
                    <button 
                      onClick={() => setOnboardStep(onboardStep - 1)}
                      className="border border-gray-300 text-gray-600 px-5 py-2.5 rounded-full text-xs font-bold hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                  ) : <div />}

                  <button 
                    onClick={() => {
                      if (onboardStep === 5) {
                        setOnboardPending(true);
                      } else {
                        setOnboardStep(onboardStep + 1);
                      }
                    }}
                    className="bg-primary-navy text-white px-6 py-2.5 rounded-full text-xs font-bold hover:bg-accent-violet transition-colors"
                  >
                    {onboardStep === 5 ? 'Finalize & Onboard' : 'Continue'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==========================================
          PAGE 13: DEMO SANDBOX (Public role gateways)
          ========================================== */}
      {activeTab === 'demo-sandbox' && (
        <div className="min-h-screen bg-primary-navy py-20 px-8 flex items-center justify-center">
          <div className="bg-white rounded-3xl border border-white/10 shadow-2xl p-8 tablet:p-12 max-w-3xl w-full text-center space-y-8 relative">
            <button onClick={() => setActiveTab('landing-page')} className="text-xs text-accent-violet font-bold absolute top-6 right-8 hover:underline">← Exit Sandbox</button>
            
            <div className="space-y-2">
              <span className="bg-gold/15 text-gold border border-gold/30 px-3 py-1 rounded-full text-[9px] uppercase font-bold tracking-widest">🧪 TRIAL PLAYGROUND</span>
              <h2 className="text-2xl font-black text-primary-navy">Enter the Pre-Populated Sandbox Demo</h2>
              <p className="text-xs text-gray-500 max-w-md mx-auto">Explore PayrollOS as a pre-populated environment. We have seeded **50 mock employees**, 20 days of detailed geofence check-ins, and active fraud flags.</p>
            </div>

            {/* Role Selectors Cards */}
            <div className="grid grid-cols-1 tablet:grid-cols-3 gap-6">
              
              <div 
                onClick={() => {
                  setRole('Super Admin');
                  setActiveTab('admin-overview');
                }}
                className="p-6 rounded-2xl border border-gray-150 bg-surface/50 text-left hover:border-gold cursor-pointer transition-all hover:shadow-lg space-y-2"
              >
                <div className="w-8 h-8 rounded-lg bg-primary-navy text-white flex items-center justify-center font-bold text-xs">A</div>
                <h4 className="font-extrabold text-primary-navy text-xs">Super Admin</h4>
                <p className="text-[10px] text-gray-500">Full system access: KYC queues, manual FX overrides, audit trails, and security settings.</p>
              </div>

              <div 
                onClick={() => {
                  setRole('HR Manager');
                  setActiveTab('hr-overview');
                }}
                className="p-6 rounded-2xl border border-gray-150 bg-surface/50 text-left hover:border-accent-violet cursor-pointer transition-all hover:shadow-lg space-y-2"
              >
                <div className="w-8 h-8 rounded-lg bg-accent-violet text-white flex items-center justify-center font-bold text-xs">HR</div>
                <h4 className="font-extrabold text-primary-navy text-xs">HR Manager</h4>
                <p className="text-[10px] text-gray-500">Manage employee rosters, approve leave requests, and view the contribution heatmap.</p>
              </div>

              <div 
                onClick={() => {
                  setRole('Employee');
                  setActiveTab('emp-overview');
                }}
                className="p-6 rounded-2xl border border-gray-150 bg-surface/50 text-left hover:border-teal cursor-pointer transition-all hover:shadow-lg space-y-2"
              >
                <div className="w-8 h-8 rounded-lg bg-teal text-white flex items-center justify-center font-bold text-xs">E</div>
                <h4 className="font-extrabold text-primary-navy text-xs">Employee Self-Service</h4>
                <p className="text-[10px] text-gray-500">View salary slips, manage multi-currency wallets, check in, and chat with the AI chatbot.</p>
              </div>

            </div>

            {/* Calendly Booking widget slot */}
            <div className="bg-surface/50 border border-gray-200 p-6 rounded-2xl text-left flex flex-col tablet:flex-row items-center justify-between gap-6">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-primary-navy">Book a Live 1-on-1 Guided Demo</h4>
                <p className="text-[10px] text-gray-400">Schedule a 15-minute call with an Antigravity technical engineer to discuss custom K8s deployments.</p>
              </div>
              
              <button 
                onClick={() => alert('Calendly booking modal placeholder triggered.')}
                className="bg-gold text-primary-navy hover:bg-gold/90 font-black px-5 py-2.5 rounded-full text-[10px] shadow-md transition-all whitespace-nowrap"
              >
                Book Guided Review
              </button>
            </div>
          </div>
        </div>
      )}


      {/* ==========================================
          DASHBOARD CONTAINER SYSTEM (For logged-in views)
          ========================================== */}
      {activeTab !== 'landing-page' && activeTab !== 'pricing-page' && activeTab !== 'login-page' && activeTab !== 'register-page' && activeTab !== 'demo-sandbox' && (
        <div className="flex pl-60 pt-16 min-h-screen transition-all">
          
          {/* Shared Sidebar layout */}
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            role={role} 
            setRole={setRole}
            pendingKycCount={kycQueue.filter(k => k.status === 'pending').length}
            alertCount={fraudAlerts.filter(a => a.status === 'open').length}
          />

          {/* Shared TopHeader layout */}
          <TopHeader 
            activeTab={activeTab} 
            role={role} 
            notifications={notifications}
            markAllRead={markAllRead}
            setActiveTab={setActiveTab}
          />

          {/* Main Workspace content container */}
          <main className="flex-1 p-8 bg-surface dark:bg-gray-900 transition-colors overflow-y-auto max-w-full">
            
            {/* ==========================================
                PAGE 4: SUPER ADMIN DASHBOARD OVERVIEW
                ========================================== */}
            {activeTab === 'admin-overview' && (
              <div className="space-y-8 text-left animate-float-quick">
                {/* 6 KPI Cards Row */}
                <div className="grid grid-cols-2 tablet:grid-cols-3 desktop:grid-cols-6 gap-6">
                  
                  <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-1">
                    <span className="text-[9px] uppercase font-bold text-gray-400">Total active staff</span>
                    <h3 className="text-xl font-black text-primary-navy dark:text-white">42 Active</h3>
                    <span className="text-[10px] text-teal font-medium">100% Verified</span>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-1 relative">
                    <span className="text-[9px] uppercase font-bold text-gray-400">Pending KYC</span>
                    <h3 className="text-xl font-black text-gold">2 Reviews</h3>
                    <span className="text-[9px] font-bold text-gold px-2 py-0.5 rounded-full bg-gold/10 inline-block mt-1">Review Queue</span>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-1">
                    <span className="text-[9px] uppercase font-bold text-gray-400">Payroll Cost (Month)</span>
                    <h3 className="text-xl font-black text-primary-navy dark:text-white">$184.5K</h3>
                    <span className="text-[10px] text-teal font-medium">↑ 4.2% vs last month</span>
                  </div>

                  <div className={`p-5 rounded-2xl border shadow-sm space-y-1 ${
                    fraudAlerts.filter(a => a.status === 'open').length > 0
                      ? 'bg-danger/10 border-danger text-danger-red animate-pulse'
                      : 'bg-white dark:bg-gray-800 border-gray-100'
                  }`}>
                    <span className="text-[9px] uppercase font-bold text-gray-400">Active Fraud Flags</span>
                    <h3 className="text-xl font-black">{fraudAlerts.filter(a => a.status === 'open').length} Alerts</h3>
                    <span className="text-[10px] font-bold">FastAPI sentinel</span>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-1">
                    <span className="text-[9px] uppercase font-bold text-gray-400">System Uptime SLA</span>
                    <h3 className="text-xl font-black text-teal">99.96%</h3>
                    <span className="text-[10px] text-gray-400">SOC2 compliant</span>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-1">
                    <span className="text-[9px] uppercase font-bold text-gray-400">Active Currencies</span>
                    <h3 className="text-xl font-black text-primary-navy dark:text-white">4 Currencies</h3>
                    <span className="text-[10px] text-teal font-medium">Live FX active</span>
                  </div>
                </div>

                {/* 2 Column Charts */}
                <div className="grid grid-cols-1 desktop:grid-cols-2 gap-8">
                  {/* Left Column: Monthly Spends */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <h4 className="text-xs font-bold text-primary-navy dark:text-white uppercase tracking-wider mb-6">Monthly Payroll Expenditure (USD)</h4>
                    {/* Beautiful SVG Bar chart */}
                    <div className="h-64 flex items-end justify-between space-x-2 pt-4 relative">
                      {[110, 115, 120, 118, 125, 130, 140, 145, 150, 160, 172, 184].map((v, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center space-y-2">
                          <div 
                            style={{ height: `${(v / 200) * 100}%` }}
                            className="w-full bg-accent-violet rounded-t-md hover:bg-gold transition-all cursor-pointer relative group"
                          >
                            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-primary-navy text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity">
                              ${v}K
                            </span>
                          </div>
                          <span className="text-[9px] text-gray-400 font-bold uppercase">
                            {['J','F','M','A','M','J','J','A','S','O','N','D'][i]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Headcount Donut */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between">
                    <h4 className="text-xs font-bold text-primary-navy dark:text-white uppercase tracking-wider mb-4">Department Cost Centers</h4>
                    {/* Beautiful SVG Donut chart representation */}
                    <div className="flex items-center justify-around py-4">
                      <div className="relative w-36 h-36 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <path className="text-gray-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                          <path className="text-accent-violet" strokeWidth="4.5" strokeDasharray="60, 100" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" />
                          <path className="text-teal" strokeWidth="4.5" strokeDasharray="30, 100" strokeDashoffset="-60" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" />
                          <path className="text-gold" strokeWidth="4.5" strokeDasharray="10, 100" strokeDashoffset="-90" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" />
                        </svg>
                        <div className="absolute text-center">
                          <h4 className="text-xl font-black text-primary-navy dark:text-white">42</h4>
                          <p className="text-[8px] uppercase tracking-wider text-gray-400">Total Staff</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2.5 text-left text-[11px] font-semibold text-gray-600 dark:text-gray-300">
                        <div className="flex items-center space-x-2"><div className="w-2.5 h-2.5 rounded bg-accent-violet" /> <span>Engineering (60%)</span></div>
                        <div className="flex items-center space-x-2"><div className="w-2.5 h-2.5 rounded bg-teal" /> <span>HR & Admin (30%)</span></div>
                        <div className="flex items-center space-x-2"><div className="w-2.5 h-2.5 rounded bg-gold" /> <span>Finance (10%)</span></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity Feed */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 space-y-4">
                  <h4 className="text-xs font-bold text-primary-navy dark:text-white uppercase tracking-wider">Immutable System Audit Trail (Last 3 events)</h4>
                  <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {auditLogs.map((log, idx) => (
                      <div key={idx} className="py-3 flex flex-wrap items-center justify-between text-xs gap-4 text-gray-500">
                        <div className="flex items-center space-x-3">
                          <Clock className="w-4 h-4 text-accent-violet" />
                          <div>
                            <p className="font-bold text-gray-700 dark:text-gray-200">{log.action.replaceAll('_', ' ')}</p>
                            <span className="text-[10px] text-gray-400 font-semibold">{log.actor} • {log.time}</span>
                          </div>
                        </div>
                        <div className="text-right text-[10px] font-mono bg-surface dark:bg-gray-900 p-1.5 rounded border border-gray-100 dark:border-gray-700">
                          {log.entity} : <span className="text-danger-red">{log.old}</span> → <span className="text-teal">{log.new}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ==========================================
                PAGE 4.1: KYC VERIFICATION QUEUE
                ========================================== */}
            {activeTab === 'admin-kyc' && (
              <div className="space-y-6 text-left animate-float-quick">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-xl font-black text-primary-navy dark:text-white">KYC Verification Queue</h1>
                    <p className="text-xs text-gray-400">Validate corporate identifiers before payouts unlock.</p>
                  </div>
                </div>

                {/* Queue Table */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-150 dark:border-gray-700 overflow-hidden shadow-sm">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-surface dark:bg-gray-950 font-bold text-gray-500 border-b border-gray-200 dark:border-gray-800">
                      <tr>
                        <th className="p-4">Name</th>
                        <th className="p-4">ID Type</th>
                        <th className="p-4">ID Number</th>
                        <th className="p-4">Dept Scope</th>
                        <th className="p-4">Submitted</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      {kycQueue.map((req) => (
                        <tr key={req.id} className="hover:bg-surface/30 dark:hover:bg-gray-800/40 transition-colors">
                          <td className="p-4 flex items-center space-x-3">
                            <img src={req.photo} alt={req.name} className="w-8 h-8 rounded-full border border-gray-200 object-cover" />
                            <div>
                              <p className="font-bold text-gray-800 dark:text-gray-200">{req.name}</p>
                              <span className="text-[10px] text-gray-400 block">{req.email}</span>
                            </div>
                          </td>
                          <td className="p-4 font-medium text-gray-700 dark:text-gray-300">{req.idType}</td>
                          <td className="p-4 font-mono text-[11px] text-gray-600 dark:text-gray-400">{req.idNo}</td>
                          <td className="p-4 text-gray-500">{req.dept}</td>
                          <td className="p-4 text-gray-400">{req.date}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${
                              req.status === 'pending'
                                ? 'bg-gold/10 border-gold/20 text-gold'
                                : (req.status === 'accepted' ? 'bg-teal/10 border-teal/20 text-teal' : 'bg-danger/10 border-danger/20 text-danger-red')
                            }`}>
                              {req.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            {req.status === 'pending' ? (
                              <button 
                                onClick={() => setActiveKycDetail(req)}
                                className="bg-primary-navy hover:bg-accent-violet text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow transition-all"
                              >
                                Review ID
                              </button>
                            ) : (
                              <span className="text-gray-400 text-[10px] italic">Processed</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* KYC Drawer Side Panel Slide-out */}
                {activeKycDetail && (
                  <div className="fixed inset-y-0 right-0 w-96 bg-white dark:bg-gray-800 shadow-2xl border-l border-gray-200 dark:border-gray-700 z-30 p-8 flex flex-col justify-between animate-slide-in-right text-left">
                    <div className="space-y-6">
                      <div className="flex justify-between items-center border-b border-gray-150 pb-4">
                        <h3 className="text-sm font-extrabold text-primary-navy dark:text-white uppercase tracking-wider">Review KYC Passport scan</h3>
                        <button onClick={() => setActiveKycDetail(null)} className="p-1 rounded-full hover:bg-surface text-gray-400 hover:text-gray-700">✕</button>
                      </div>

                      {/* Info coordinates */}
                      <div className="space-y-4">
                        <div className="text-center">
                          <img src={activeKycDetail.photo} alt={activeKycDetail.name} className="w-20 h-20 rounded-full object-cover border-2 border-gold mx-auto" />
                          <h4 className="font-extrabold text-primary-navy dark:text-white text-md mt-2">{activeKycDetail.name}</h4>
                          <p className="text-[10px] text-gray-400">{activeKycDetail.email}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-xs pt-4 border-t border-gray-100">
                          <div>
                            <span className="text-[9px] uppercase font-bold text-gray-400">Document Type</span>
                            <p className="font-bold text-gray-700 dark:text-gray-200">{activeKycDetail.idType}</p>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase font-bold text-gray-400">Document Number</span>
                            <p className="font-bold font-mono text-gray-700 dark:text-gray-200">{activeKycDetail.idNo}</p>
                          </div>
                        </div>

                        {/* ID Photo Scan File slot */}
                        <div className="space-y-2">
                          <span className="text-[9px] uppercase font-bold text-gray-400">Uploaded Document scan</span>
                          <div className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm relative h-36">
                            <img src="https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&w=400&q=80" alt="KYC document scan preview" className="w-full h-full object-cover blur-xs" />
                            <div className="absolute inset-0 bg-primary-navy/40 flex items-center justify-center text-white">
                              <span className="bg-primary-navy/90 text-gold text-[10px] font-bold px-3 py-1.5 rounded-full border border-gold/30">ID Scan Verified by AI</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="space-y-3 pt-6 border-t border-gray-100">
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => {
                            setKycQueue(kycQueue.map(k => k.id === activeKycDetail.id ? { ...k, status: 'accepted' } : k));
                            
                            // Add employee to active state
                            setEmployees([...employees, {
                              id: activeKycDetail.id,
                              name: activeKycDetail.name,
                              dept: activeKycDetail.dept,
                              desig: 'Junior Engineer',
                              joinDate: '2026-05-27',
                              salary: 3000,
                              currency: 'USD',
                              status: 'active',
                              bank: 'Citibank ******0099',
                              attendance: 100,
                              leaves: 20,
                              email: activeKycDetail.email
                            }]);

                            setActiveKycDetail(null);
                            alert('KYC accepted. Employee active on payroll rosters.');
                          }}
                          className="flex-1 bg-teal hover:bg-teal/90 text-white font-bold py-2.5 rounded-full text-xs shadow-lg transition-colors"
                        >
                          Accept ID
                        </button>
                        <button 
                          onClick={() => {
                            setKycQueue(kycQueue.map(k => k.id === activeKycDetail.id ? { ...k, status: 'rejected' } : k));
                            setActiveKycDetail(null);
                            alert('KYC Rejected. Employee account locked.');
                          }}
                          className="flex-1 bg-danger hover:bg-danger/90 text-white font-bold py-2.5 rounded-full text-xs shadow-lg transition-colors"
                        >
                          Reject ID
                        </button>
                      </div>
                      <p className="text-[9px] text-center text-gray-400 italic">Acceptance registers the worker to active payroll databases immediately.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ==========================================
                PAGE 4.2: EMPLOYEE MANAGEMENT
                ========================================== */}
            {activeTab === 'admin-employees' && (
              <div className="space-y-6 text-left animate-float-quick">
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <div>
                    <h1 className="text-xl font-black text-primary-navy dark:text-white">Employee Roster Directory</h1>
                    <p className="text-xs text-gray-400">Total processed headcount: {employees.length} active contracts.</p>
                  </div>
                  
                  <button 
                    onClick={() => setShowAddEmpModal(true)}
                    className="bg-primary-navy hover:bg-accent-violet text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-lg flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Employee</span>
                  </button>
                </div>

                {/* Employee Data Grid Table */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-150 dark:border-gray-700 overflow-hidden shadow-sm">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-surface dark:bg-gray-950 font-bold text-gray-500 border-b border-gray-200 dark:border-gray-800">
                      <tr>
                        <th className="p-4">ID</th>
                        <th className="p-4">Name</th>
                        <th className="p-4">Department</th>
                        <th className="p-4">Designation</th>
                        <th className="p-4">Monthly Salary</th>
                        <th className="p-4">Join Date</th>
                        <th className="p-4">Attendance</th>
                        <th className="p-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      {employees.map((emp) => (
                        <tr key={emp.id} className="hover:bg-surface/30 dark:hover:bg-gray-800/40 transition-colors">
                          <td className="p-4 font-mono text-gray-400 font-bold">EMP-{emp.id.toString().padStart(3, '0')}</td>
                          <td className="p-4 font-bold text-primary-navy dark:text-white">{emp.name}</td>
                          <td className="p-4 text-gray-600 dark:text-gray-400">{emp.dept}</td>
                          <td className="p-4 text-gray-500">{emp.desig}</td>
                          <td className="p-4 font-bold text-teal">{emp.currency} {emp.salary.toLocaleString()}</td>
                          <td className="p-4 text-gray-400">{emp.joinDate}</td>
                          <td className="p-4 font-bold text-gray-600 dark:text-gray-300">{emp.attendance}%</td>
                          <td className="p-4 text-right">
                            <button 
                              onClick={() => {
                                setSelectedEmployee(emp);
                                setEmpActiveTab('profile');
                              }}
                              className="border border-gray-200 hover:border-accent-violet text-primary-navy hover:text-accent-violet dark:text-white dark:border-gray-600 px-3.5 py-1.5 rounded-full text-[10px] font-bold transition-all"
                            >
                              Edit Profile
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Add Employee Modal */}
                {showAddEmpModal && (
                  <div className="fixed inset-0 bg-primary-navy/40 flex items-center justify-center z-30 p-8">
                    <div className="bg-white rounded-3xl border border-gray-200 p-8 max-w-sm w-full text-left space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-black text-primary-navy uppercase tracking-wider">Add New Staff Record</h3>
                        <button onClick={() => setShowAddEmpModal(false)} className="p-1 rounded-full hover:bg-surface">✕</button>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-gray-400">Full Name</label>
                          <input 
                            type="text" 
                            placeholder="John Doe" 
                            className="w-full bg-surface border border-gray-200 rounded-lg p-2 text-xs"
                            onChange={(e) => setNewEmpData({ ...newEmpData, name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-gray-400">Corporate Email</label>
                          <input 
                            type="email" 
                            placeholder="john@antigravity.com" 
                            className="w-full bg-surface border border-gray-200 rounded-lg p-2 text-xs"
                            onChange={(e) => setNewEmpData({ ...newEmpData, email: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-gray-400">Department</label>
                            <select 
                              className="w-full bg-surface border border-gray-200 rounded-lg p-2 text-xs"
                              onChange={(e) => setNewEmpData({ ...newEmpData, dept: e.target.value })}
                            >
                              <option>Engineering</option>
                              <option>HR & Admin</option>
                              <option>Finance</option>
                              <option>Marketing</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-gray-400">Designation</label>
                            <input 
                              type="text" 
                              placeholder="Frontend Dev" 
                              className="w-full bg-surface border border-gray-200 rounded-lg p-2 text-xs"
                              onChange={(e) => setNewEmpData({ ...newEmpData, desig: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-gray-400">Salary Currency</label>
                            <select 
                              className="w-full bg-surface border border-gray-200 rounded-lg p-2 text-xs"
                              onChange={(e) => setNewEmpData({ ...newEmpData, currency: e.target.value })}
                            >
                              <option>USD</option>
                              <option>INR</option>
                              <option>EUR</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-gray-400">Base Salary</label>
                            <input 
                              type="number" 
                              placeholder="4500" 
                              className="w-full bg-surface border border-gray-200 rounded-lg p-2 text-xs"
                              onChange={(e) => setNewEmpData({ ...newEmpData, salary: parseFloat(e.target.value) })}
                            />
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => {
                          setEmployees([...employees, {
                            id: employees.length + 1,
                            name: newEmpData.name,
                            dept: newEmpData.dept,
                            desig: newEmpData.desig,
                            joinDate: new Date().toISOString().split('T')[0],
                            salary: newEmpData.salary,
                            currency: newEmpData.currency,
                            status: 'active',
                            bank: 'Citi Bank (7721)',
                            attendance: 100,
                            leaves: 20,
                            email: newEmpData.email
                          }]);
                          setShowAddEmpModal(false);
                          alert('Employee added and auto verified in active system database!');
                        }}
                        className="w-full bg-primary-navy hover:bg-accent-violet text-white font-bold py-2.5 rounded-lg text-xs shadow-lg transition-colors"
                      >
                        Submit Employee Record
                      </button>
                    </div>
                  </div>
                )}

                {/* Employee Detail Page Slide Drawer (profile tab etc) */}
                {selectedEmployee && (
                  <div className="fixed inset-0 bg-primary-navy/40 flex items-center justify-end z-30">
                    <div className="bg-white dark:bg-gray-800 w-full tablet:w-160 h-screen shadow-2xl p-8 flex flex-col justify-between overflow-y-auto animate-slide-in-right text-left border-l border-gray-150">
                      
                      <div className="space-y-6">
                        <div className="flex justify-between items-center border-b border-gray-150 pb-4">
                          <div>
                            <h3 className="text-sm font-black text-primary-navy dark:text-white uppercase tracking-wider">Employee Dossier</h3>
                            <span className="text-[10px] text-gray-400">EMP-{selectedEmployee.id.toString().padStart(3, '0')}</span>
                          </div>
                          <button onClick={() => setSelectedEmployee(null)} className="p-1.5 rounded-full hover:bg-surface text-gray-400 hover:text-gray-700">✕</button>
                        </div>

                        {/* Dossier Tabs */}
                        <div className="flex space-x-4 border-b border-gray-100 pb-2 text-xs font-bold text-gray-400">
                          {['profile', 'salary', 'attendance', 'wallet'].map((tab) => (
                            <button 
                              key={tab}
                              onClick={() => setEmpActiveTab(tab)}
                              className={`pb-2 capitalize border-b-2 transition-all ${
                                empActiveTab === tab ? 'border-accent-violet text-accent-violet' : 'border-transparent hover:text-gray-600'
                              }`}
                            >
                              {tab}
                            </button>
                          ))}
                        </div>

                        {/* Profile Tab */}
                        {empActiveTab === 'profile' && (
                          <div className="space-y-4 animate-float-quick text-xs">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <span className="text-[9px] uppercase font-bold text-gray-400">Full Name</span>
                                <p className="font-bold text-gray-800 dark:text-gray-200">{selectedEmployee.name}</p>
                              </div>
                              <div>
                                <span className="text-[9px] uppercase font-bold text-gray-400">Corporate Email</span>
                                <p className="font-bold text-gray-800 dark:text-gray-200">{selectedEmployee.email}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <span className="text-[9px] uppercase font-bold text-gray-400">Department</span>
                                <p className="font-bold text-gray-700 dark:text-gray-200">{selectedEmployee.dept}</p>
                              </div>
                              <div>
                                <span className="text-[9px] uppercase font-bold text-gray-400">Designation</span>
                                <p className="font-bold text-gray-700 dark:text-gray-200">{selectedEmployee.desig}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <span className="text-[9px] uppercase font-bold text-gray-400">Join Date</span>
                                <p className="font-bold text-gray-600 dark:text-gray-300">{selectedEmployee.joinDate}</p>
                              </div>
                              <div>
                                <span className="text-[9px] uppercase font-bold text-gray-400">Contract status</span>
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-teal/15 text-teal border border-teal/20 ml-2 uppercase">Active</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Salary Tab */}
                        {empActiveTab === 'salary' && (
                          <div className="space-y-4 animate-float-quick text-xs">
                            <h4 className="font-bold text-primary-navy dark:text-white text-xs uppercase tracking-wider">Monthly Compensation breakdown</h4>
                            
                            <div className="bg-surface dark:bg-gray-900 p-4 rounded-2xl border border-gray-150 dark:border-gray-700 space-y-2 font-semibold text-gray-600 dark:text-gray-300">
                              <div className="flex justify-between"><span>Basic Pay (50%)</span> <span className="font-bold">${(selectedEmployee.salary * 0.5).toFixed(2)}</span></div>
                              <div className="flex justify-between"><span>House Rent Allowance (20%)</span> <span className="font-bold">${(selectedEmployee.salary * 0.2).toFixed(2)}</span></div>
                              <div className="flex justify-between"><span>Special Allowance (20%)</span> <span className="font-bold">${(selectedEmployee.salary * 0.2).toFixed(2)}</span></div>
                              <div className="flex justify-between text-teal border-t border-dashed border-gray-200 dark:border-gray-700 pt-2">
                                <span>Gross salary</span> <span className="font-black text-teal">${selectedEmployee.salary.toLocaleString()}.00</span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <span className="text-[9px] uppercase font-bold text-gray-400">Linked Payout IBAN / Bank Details</span>
                              <p className="font-mono text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 border border-gray-150 p-2.5 rounded-lg">{selectedEmployee.bank}</p>
                            </div>
                          </div>
                        )}

                        {/* Attendance Tab */}
                        {empActiveTab === 'attendance' && (
                          <div className="space-y-4 animate-float-quick text-xs text-gray-600 dark:text-gray-300">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold uppercase tracking-wider">Attendance Rate</span>
                              <span className="text-teal font-black text-sm">{selectedEmployee.attendance}% Present</span>
                            </div>
                            
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div style={{ width: `${selectedEmployee.attendance}%` }} className="bg-teal h-full" />
                            </div>

                            {/* Attendance logs list preview */}
                            <div className="space-y-2 pt-2">
                              <span className="text-[9px] uppercase font-bold text-gray-400">Recent Attendance Logs</span>
                              <div className="bg-surface dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl divide-y divide-gray-100 dark:divide-gray-800">
                                <div className="p-2.5 flex justify-between text-[11px]">
                                  <span>2026-05-27</span> <span className="font-bold text-teal">09:12 AM - 06:15 PM (Present)</span>
                                </div>
                                <div className="p-2.5 flex justify-between text-[11px]">
                                  <span>2026-05-26</span> <span className="font-bold text-teal">09:05 AM - 06:00 PM (Present)</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Wallet Tab */}
                        {empActiveTab === 'wallet' && (
                          <div className="space-y-4 animate-float-quick text-xs text-gray-600 dark:text-gray-300">
                            <div className="bg-gold/10 border border-gold/30 p-4 rounded-2xl flex items-center justify-between">
                              <div>
                                <span className="text-[9px] uppercase font-bold text-gray-400">Wallet balance</span>
                                <h4 className="text-xl font-black text-gold">${selectedEmployee.salary.toLocaleString()}.00</h4>
                              </div>
                              <span className="text-[10px] font-bold text-gold uppercase px-2 py-0.5 rounded bg-gold/10 border border-gold/20">USD Primary</span>
                            </div>

                            <div className="space-y-2">
                              <span className="text-[9px] uppercase font-bold text-gray-400">Disbursement schedule status</span>
                              <p className="font-bold text-gray-800 dark:text-gray-200">Scheduled for monthly processing pipeline (End of Month).</p>
                            </div>
                          </div>
                        )}

                      </div>

                      <button 
                        onClick={() => setSelectedEmployee(null)}
                        className="w-full bg-primary-navy text-white text-xs font-bold py-2.5 rounded-full hover:bg-accent-violet transition-colors mt-8 shadow-md"
                      >
                        Close Dossier
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ==========================================
                PAGE 5: HR MANAGER DASHBOARD
                ========================================== */}
            {activeTab === 'hr-overview' && (
              <div className="space-y-8 text-left animate-float-quick">
                {/* HR KPI Cards */}
                <div className="grid grid-cols-2 tablet:grid-cols-3 desktop:grid-cols-6 gap-6">
                  
                  <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                    <span className="text-[9px] uppercase font-bold text-gray-400">Total Headcount</span>
                    <h3 className="text-xl font-black text-primary-navy dark:text-white">{employees.length} Staff</h3>
                    <span className="text-[10px] text-teal font-medium">↑ 2 New this month</span>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                    <span className="text-[9px] uppercase font-bold text-gray-400">Open Leave Requests</span>
                    <h3 className="text-xl font-black text-gold">1 Pending</h3>
                    <span className="text-[10px] text-gold font-bold">Review required</span>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                    <span className="text-[9px] uppercase font-bold text-gray-400">Avg Monthly Salary</span>
                    <h3 className="text-xl font-black text-teal">$5,240</h3>
                    <span className="text-[10px] text-gray-400">Currency index: USD</span>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                    <span className="text-[9px] uppercase font-bold text-gray-400">Org Attendance rate</span>
                    <h3 className="text-xl font-black text-teal">96.4%</h3>
                    <span className="text-[10px] text-teal font-medium">Target Met (&gt;95%)</span>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                    <span className="text-[9px] uppercase font-bold text-gray-400">New Joiners</span>
                    <h3 className="text-xl font-black text-primary-navy dark:text-white">2 Joiners</h3>
                    <span className="text-[10px] text-gray-400">May onboarding</span>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                    <span className="text-[9px] uppercase font-bold text-gray-400">Attrition Rate (12M)</span>
                    <h3 className="text-xl font-black text-teal">4.2%</h3>
                    <span className="text-[10px] text-teal font-medium">Industry Best (&lt;10%)</span>
                  </div>
                </div>

                {/* Heatmap Contribution Section */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-primary-navy dark:text-white uppercase tracking-wider">GitHub-Style Org Attendance Heatmap</h4>
                      <p className="text-[10px] text-gray-400">Visual mapping of overall team check-ins across the last 30 working days.</p>
                    </div>
                    {/* Scale legend */}
                    <div className="flex items-center space-x-2 text-[9px] text-gray-400 font-bold">
                      <span>Absent</span>
                      <div className="w-2.5 h-2.5 rounded heatmap-cell-0" />
                      <div className="w-2.5 h-2.5 rounded heatmap-cell-1" />
                      <div className="w-2.5 h-2.5 rounded heatmap-cell-2" />
                      <div className="w-2.5 h-2.5 rounded heatmap-cell-3" />
                      <div className="w-2.5 h-2.5 rounded heatmap-cell-4" />
                      <span>Present</span>
                    </div>
                  </div>

                  {/* Grid box */}
                  <div className="grid grid-cols-10 tablet:grid-cols-15 desktop:grid-cols-30 gap-1.5 py-4">
                    {Array.from({ length: 30 }).map((_, i) => {
                      const val = (i % 6 === 0) ? 0 : ((i % 5 === 0) ? 1 : ((i % 4 === 0) ? 2 : ((i % 3 === 0) ? 3 : 4)));
                      return (
                        <div 
                          key={i} 
                          onClick={() => alert(`Day -${30 - i}: Org attendance rate was ${val === 0 ? '70%' : (val === 1 ? '82%' : (val === 2 ? '90%' : (val === 3 ? '95%' : '100%')))}.`)}
                          className={`aspect-square rounded cursor-pointer transition-all hover:scale-115 heatmap-cell-${val}`} 
                          title={`Day -${30 - i}`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Leaves & Attrition Charts */}
                <div className="grid grid-cols-1 desktop:grid-cols-2 gap-8">
                  {/* Leaves requests approvals queue */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <h4 className="text-xs font-bold text-primary-navy dark:text-white uppercase tracking-wider">Leave Approvals Pending Review</h4>
                    
                    <div className="divide-y divide-gray-100">
                      <div className="py-3.5 flex justify-between items-center text-xs">
                        <div className="space-y-1">
                          <p className="font-bold text-gray-800 dark:text-gray-200">Neha Patel (Senior Engineer)</p>
                          <span className="text-[10px] text-gray-400">Annual Leave • 3 days (June 10 - June 12)</span>
                        </div>
                        <div className="flex space-x-2">
                          <button onClick={() => alert('Leave approved successfully.')} className="bg-teal text-white text-[10px] font-bold px-3 py-1 rounded-full hover:bg-teal/95 transition-all">Approve</button>
                          <button onClick={() => alert('Leave rejected.')} className="bg-danger text-white text-[10px] font-bold px-3 py-1 rounded-full hover:bg-danger/95 transition-all">Reject</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Attrition/Retention Trend */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h4 className="text-xs font-bold text-primary-navy dark:text-white uppercase tracking-wider mb-6">Staff Headcount Trend (12 Months)</h4>
                    {/* SVG Line graph */}
                    <div className="h-48 relative pt-4 flex items-end">
                      <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                        <path 
                          vectorEffect="non-scaling-stroke"
                          d="M 0 25 L 10 24 L 20 23 L 30 20 L 40 21 L 50 18 L 60 16 L 70 15 L 80 12 L 90 8 L 100 4" 
                          fill="none" 
                          stroke="#5B5EA6" 
                          strokeWidth="2"
                        />
                      </svg>
                      {/* Months markers */}
                      <div className="absolute bottom-0 w-full flex justify-between text-[8px] text-gray-400 font-bold uppercase pt-2">
                        <span>Jun 25</span>
                        <span>Dec 25</span>
                        <span>May 26</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==========================================
                PAGE 6: PAYROLL ADMIN DASHBOARD & WORKFLOW
                ========================================== */}
            {activeTab === 'admin-payroll' && (
              <div className="space-y-8 text-left animate-float-quick">
                {/* Horizontal Stepper */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                    <div>
                      <h2 className="text-sm uppercase tracking-wider font-extrabold text-primary-navy dark:text-white">Active Payroll Calculation Pipeline</h2>
                      <p className="text-[10px] text-gray-400">Follow the 6 steps sequentially to disburse employee compensation.</p>
                    </div>
                    <span className="bg-gold/15 text-gold border border-gold/30 px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-black">Period: May 2026</span>
                  </div>

                  {/* Stepper Progress indicators */}
                  <div className="flex items-center justify-between py-4 overflow-x-auto gap-4">
                    {[
                      { s: 1, name: 'Initiate' },
                      { s: 2, name: 'Aggregate' },
                      { s: 3, name: 'Calculate' },
                      { s: 4, name: 'AI Review' },
                      { s: 5, name: 'Approve' },
                      { s: 6, name: 'Disburse' }
                    ].map((step) => (
                      <div key={step.s} className="flex items-center flex-1 last:flex-initial min-w-20">
                        <button 
                          onClick={() => setPayrollStep(step.s)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-md transition-all ${
                            payrollStep === step.s 
                              ? 'bg-gold text-primary-navy font-black border-2 border-primary-navy ring-4 ring-gold/20 scale-110' 
                              : (payrollStep > step.s ? 'bg-teal text-white' : 'bg-surface dark:bg-gray-900 text-gray-400')
                          }`}
                        >
                          {payrollStep > step.s ? '✓' : step.s}
                        </button>
                        <span className="text-[10px] font-extrabold ml-2 text-primary-navy dark:text-gray-200 hidden tablet:block">{step.name}</span>
                        {step.s < 6 && (
                          <div className={`h-0.5 flex-1 mx-2 rounded-full hidden tablet:block ${
                            payrollStep > step.s ? 'bg-teal' : 'bg-gray-150'
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step Workspace Panels */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-150 dark:border-gray-700 shadow-xl space-y-6">
                  
                  {/* Step 1: Initiate */}
                  {payrollStep === 1 && (
                    <div className="space-y-6 animate-float-quick">
                      <div className="space-y-1">
                        <span className="text-[10px] text-accent-violet font-extrabold uppercase">Step 1 of 6</span>
                        <h3 className="text-lg font-black text-primary-navy dark:text-white">Initiate Payroll Run parameters</h3>
                        <p className="text-xs text-gray-400">Verify dates, currency targets, and department scope before starting the calculation engine.</p>
                      </div>

                      <div className="grid grid-cols-1 tablet:grid-cols-3 gap-6 pt-4 text-xs font-bold text-gray-700 dark:text-gray-300">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-bold text-gray-400">Payroll Cycle dates</label>
                          <input 
                            type="text" 
                            value={payrollRunDate} 
                            onChange={(e) => setPayrollRunDate(e.target.value)}
                            className="w-full bg-surface dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-xs focus:bg-white text-gray-700 dark:text-gray-200" 
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-bold text-gray-400">Department Scope</label>
                          <select 
                            value={payrollScope} 
                            onChange={(e) => setPayrollScope(e.target.value)}
                            className="w-full bg-surface dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-xs focus:bg-white text-gray-700 dark:text-gray-200"
                          >
                            <option>All Departments</option>
                            <option>Engineering</option>
                            <option>HR & Admin</option>
                            <option>Finance</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-bold text-gray-400">Base Currency Payout</label>
                          <select 
                            value={payrollCurrency} 
                            onChange={(e) => setPayrollCurrency(e.target.value)}
                            className="w-full bg-surface dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-xs focus:bg-white text-gray-700 dark:text-gray-200"
                          >
                            <option>USD ($)</option>
                            <option>INR (₹)</option>
                            <option>EUR (€)</option>
                          </select>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-gray-100 flex justify-end">
                        <button 
                          onClick={() => setPayrollStep(2)}
                          className="bg-primary-navy hover:bg-accent-violet text-white text-xs font-black px-6 py-2.5 rounded-full shadow-lg transition-colors"
                        >
                          Start Payroll Run Pipeline
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Aggregate */}
                  {payrollStep === 2 && (
                    <div className="space-y-6 animate-float-quick">
                      <div className="space-y-1">
                        <span className="text-[10px] text-accent-violet font-extrabold">Step 2 of 6</span>
                        <h3 className="text-lg font-black text-primary-navy dark:text-white">Aggregate Attendance & Leaves Logs</h3>
                        <p className="text-xs text-gray-400">The platform has pulled employee check-in logs and overtime hours. Add manual adjustments below if required.</p>
                      </div>

                      {/* Summary aggregation table */}
                      <div className="border border-gray-150 rounded-2xl overflow-hidden text-xs">
                        <table className="w-full text-left">
                          <thead className="bg-surface dark:bg-gray-950 font-bold text-gray-500">
                            <tr>
                              <th className="p-3">Employee</th>
                              <th className="p-3">Attendance days</th>
                              <th className="p-3">Overtime hours</th>
                              <th className="p-3">Approved leaves</th>
                              <th className="p-3 text-right">Adjustment</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            <tr className="dark:text-gray-300">
                              <td className="p-3 font-bold">Vinay Kumar</td>
                              <td className="p-3">22 days (100%)</td>
                              <td className="p-3">4.5 hours</td>
                              <td className="p-3">0 days</td>
                              <td className="p-3 text-right text-teal font-bold">$0.00</td>
                            </tr>
                            <tr className="dark:text-gray-300">
                              <td className="p-3 font-bold">Neha Patel</td>
                              <td className="p-3">20 days (90%)</td>
                              <td className="p-3">8.0 hours</td>
                              <td className="p-3">2 days (Annual)</td>
                              <td className="p-3 text-right text-teal font-bold">$0.00</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="pt-6 border-t border-gray-100 flex justify-between">
                        <button onClick={() => setPayrollStep(1)} className="border border-gray-300 text-gray-600 px-6 py-2.5 rounded-full text-xs font-bold hover:bg-gray-50">Back</button>
                        <button onClick={() => setPayrollStep(3)} className="bg-primary-navy hover:bg-accent-violet text-white text-xs font-black px-6 py-2.5 rounded-full shadow-lg transition-colors">Continue to Tax Calculations</button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Calculate */}
                  {payrollStep === 3 && (
                    <div className="space-y-6 animate-float-quick">
                      <div className="space-y-1">
                        <span className="text-[10px] text-accent-violet font-extrabold">Step 3 of 6</span>
                        <h3 className="text-lg font-black text-primary-navy dark:text-white">Statutory Tax Engine calculations</h3>
                        <p className="text-xs text-gray-400">Verify TDS tax brackets, Prof Tax, PF matching deductions, and calculated net payouts.</p>
                      </div>

                      {/* Calculations Register */}
                      <div className="border border-gray-150 rounded-2xl overflow-hidden text-xs">
                        <table className="w-full text-left">
                          <thead className="bg-surface dark:bg-gray-950 font-bold text-gray-500">
                            <tr>
                              <th className="p-3">Employee</th>
                              <th className="p-3">Gross Salary</th>
                              <th className="p-3">TDS (10%)</th>
                              <th className="p-3">PF matching</th>
                              <th className="p-3">Prof Tax</th>
                              <th className="p-3">Net payout</th>
                              <th className="p-3 text-right">Adjustment</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 dark:text-gray-300">
                            {calculatedItems.map((item) => (
                              <tr key={item.id}>
                                <td className="p-3 font-bold">{item.name}</td>
                                <td className="p-3">${item.gross.toLocaleString()}.00</td>
                                <td className="p-3 text-danger-red">-${item.tax.toFixed(2)}</td>
                                <td className="p-3 text-danger-red">-${item.pf.toFixed(2)}</td>
                                <td className="p-3 text-danger-red">-$30.00</td>
                                <td className="p-3 font-bold text-teal">${item.net.toLocaleString()}.00</td>
                                <td className="p-3 text-right">
                                  <button 
                                    onClick={() => {
                                      setManualAdjustmentId(item.id);
                                      setManualAdjustmentAmount(0);
                                    }}
                                    className="text-[10px] text-accent-violet hover:underline"
                                  >
                                    Adjust
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Recalculate adjustment popover */}
                      {manualAdjustmentId && (
                        <div className="bg-surface p-4 rounded-xl border border-gray-200 flex items-center justify-between text-xs animate-float-quick">
                          <div className="space-y-1">
                            <span className="font-bold">Manual Bonus / Deduction Adjustment</span>
                            <p className="text-[10px] text-gray-400">Applies as a special component allowance to item #{manualAdjustmentId}</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <input 
                              type="number" 
                              placeholder="$ Amount" 
                              className="w-24 bg-white border border-gray-300 rounded p-1.5"
                              onChange={(e) => setManualAdjustmentAmount(parseFloat(e.target.value))}
                            />
                            <button 
                              onClick={() => {
                                setCalculatedItems(calculatedItems.map(item => 
                                  item.id === manualAdjustmentId 
                                    ? { ...item, gross: item.gross + manualAdjustmentAmount, net: item.net + manualAdjustmentAmount } 
                                    : item
                                ));
                                setManualAdjustmentId(null);
                                alert('Recalculated salary breakdown details updated.');
                              }}
                              className="bg-primary-navy text-white px-3 py-1.5 rounded hover:bg-accent-violet"
                            >
                              Recalculate
                            </button>
                            <button onClick={() => setManualAdjustmentId(null)} className="text-gray-400 hover:text-gray-600">✕</button>
                          </div>
                        </div>
                      )}

                      <div className="pt-6 border-t border-gray-100 flex justify-between">
                        <button onClick={() => setPayrollStep(2)} className="border border-gray-300 text-gray-600 px-6 py-2.5 rounded-full text-xs font-bold hover:bg-gray-50">Back</button>
                        <button onClick={() => setPayrollStep(4)} className="bg-primary-navy hover:bg-accent-violet text-white text-xs font-black px-6 py-2.5 rounded-full shadow-lg transition-colors">Continue to AI Fraud Review</button>
                      </div>
                    </div>
                  )}

                  {/* Step 4: AI Review */}
                  {payrollStep === 4 && (
                    <div className="space-y-6 animate-float-quick">
                      <div className="space-y-1">
                        <span className="text-[10px] text-accent-violet font-extrabold">Step 4 of 6</span>
                        <h3 className="text-lg font-black text-primary-navy dark:text-white">AI Fraud Sentinel review</h3>
                        <p className="text-xs text-gray-400">The Isolation Forest and rule-based heuristic checks returned the following flags. High severity flags must be resolved to proceed.</p>
                      </div>

                      {/* Anomalies alert cards */}
                      <div className="space-y-4">
                        {fraudAlerts.map((alert) => (
                          <div 
                            key={alert.id} 
                            className={`p-5 rounded-2xl border text-xs text-left space-y-3 relative ${
                              alert.status === 'resolved' 
                                ? 'bg-teal/5 border-teal/30 text-teal-accent' 
                                : 'bg-danger/5 border-danger text-danger-red'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                                  alert.severity === 'high' ? 'bg-danger text-white' : 'bg-gold text-primary-navy'
                                }`}>
                                  {alert.severity} Severity
                                </span>
                                <h4 className="font-extrabold text-sm text-primary-navy dark:text-white pt-1">{alert.anomaly_type}</h4>
                              </div>
                              <span className="font-mono font-bold text-gray-500">Anomaly Score: {(alert.score * 100).toFixed(2)}%</span>
                            </div>

                            <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed">{alert.details}</p>

                            <div className="flex justify-between items-center pt-2 border-t border-gray-150">
                              <span className="text-[10px] text-gray-400 italic">Target Employee: {alert.name}</span>
                              
                              {alert.status === 'open' ? (
                                <div className="flex space-x-2">
                                  <button 
                                    onClick={() => {
                                      setFraudAlerts(fraudAlerts.map(a => a.id === alert.id ? { ...a, status: 'resolved' } : a));
                                      alert('Overridden. Proceeding with salary calculation release.');
                                    }}
                                    className="bg-primary-navy text-white text-[10px] font-bold px-3 py-1.5 rounded-full hover:bg-accent-violet shadow-sm"
                                  >
                                    Override & Proceed
                                  </button>
                                  <button 
                                    onClick={() => {
                                      setCalculatedItems(calculatedItems.filter(item => item.id !== alert.employeeId));
                                      setFraudAlerts(fraudAlerts.filter(a => a.id !== alert.id));
                                      alert(`Employee ${alert.name} excluded from current run.`);
                                    }}
                                    className="bg-danger text-white text-[10px] font-bold px-3 py-1.5 rounded-full hover:bg-danger/95 shadow-sm"
                                  >
                                    Exclude Employee
                                  </button>
                                </div>
                              ) : (
                                <span className="text-teal font-bold flex items-center space-x-1">
                                  <span>✓ Resolved Override</span>
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-6 border-t border-gray-100 flex justify-between">
                        <button onClick={() => setPayrollStep(3)} className="border border-gray-300 text-gray-600 px-6 py-2.5 rounded-full text-xs font-bold hover:bg-gray-50">Back</button>
                        <button 
                          onClick={() => {
                            const unresolvedHigh = fraudAlerts.filter(a => a.status === 'open' && a.severity === 'high').length;
                            if (unresolvedHigh > 0) {
                              alert('Cannot proceed. Outstanding high severity fraud alerts exist. Resolve or Override them first.');
                            } else {
                              setPayrollStep(5);
                            }
                          }} 
                          className="bg-primary-navy hover:bg-accent-violet text-white text-xs font-black px-6 py-2.5 rounded-full shadow-lg transition-colors"
                        >
                          Continue to Admin Approval
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 5: Approve */}
                  {payrollStep === 5 && (
                    <div className="space-y-6 animate-float-quick">
                      <div className="space-y-1">
                        <span className="text-[10px] text-accent-violet font-extrabold">Step 5 of 6</span>
                        <h3 className="text-lg font-black text-primary-navy dark:text-white">Confirm & Schedule Disbursement</h3>
                        <p className="text-xs text-gray-400">Review final consolidated figures. Approving locks the calculation parameters and schedules bank payout releases.</p>
                      </div>

                      <div className="grid grid-cols-2 tablet:grid-cols-4 gap-6 p-6 bg-surface dark:bg-gray-900 border border-gray-150 dark:border-gray-700 rounded-3xl text-left">
                        <div>
                          <span className="text-[9px] uppercase font-bold text-gray-400">Total processed Headcount</span>
                          <h4 className="text-lg font-black text-primary-navy dark:text-white">{calculatedItems.length} active</h4>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-gray-400">Aggregated Gross</span>
                          <h4 className="text-lg font-black text-primary-navy dark:text-white">$19,200.00</h4>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-gray-400">Total Net payout</span>
                          <h4 className="text-lg font-black text-teal">$16,370.00</h4>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-gray-400">Tax Liabilities (TDS)</span>
                          <h4 className="text-lg font-black text-danger-red">$1,920.00</h4>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-gray-100 flex justify-between">
                        <button onClick={() => setPayrollStep(4)} className="border border-gray-300 text-gray-600 px-6 py-2.5 rounded-full text-xs font-bold hover:bg-gray-50">Back</button>
                        <button 
                          onClick={() => {
                            setPayrollStep(6);
                            setDisbursementProgress(0);
                          }} 
                          className="bg-teal hover:bg-teal/90 text-white text-xs font-black px-6 py-2.5 rounded-full shadow-lg transition-colors"
                        >
                          Approve & Release Funds
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 6: Disbursement */}
                  {payrollStep === 6 && (
                    <div className="space-y-6 animate-float-quick">
                      <div className="space-y-1">
                        <span className="text-[10px] text-accent-violet font-extrabold">Step 6 of 6</span>
                        <h3 className="text-lg font-black text-primary-navy dark:text-white">Real-Time Banking Disbursement Tracker</h3>
                        <p className="text-xs text-gray-400">Automated clearing house (ACH) network pipeline status. Live feed connected via WebSocket hooks.</p>
                      </div>

                      {/* Progress Ticker */}
                      <div className="space-y-4 max-w-md mx-auto p-6 bg-surface dark:bg-gray-900 rounded-3xl border border-gray-150 dark:border-gray-700">
                        <div className="flex justify-between text-xs font-bold">
                          <span>Status: <span className={disbursementStatus === 'Completed' ? 'text-teal' : 'text-accent-violet animate-pulse'}>{disbursementStatus}</span></span>
                          <span>{disbursementProgress}% Complete</span>
                        </div>
                        
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div style={{ width: `${disbursementProgress}%` }} className="bg-teal h-full transition-all duration-500" />
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-gray-200 text-[10px] text-gray-400">
                          <span>Bank clearing delay simulated</span>
                          <span>USD Primary</span>
                        </div>
                      </div>

                      {disbursementStatus === 'Completed' && (
                        <div className="space-y-4 max-w-sm mx-auto animate-float-quick">
                          <div className="bg-teal/15 text-teal p-3.5 rounded-xl border border-teal/20 text-center text-xs font-bold">
                            🎉 Payout processed successfully. Payslip PDFs generated.
                          </div>
                          <button 
                            onClick={() => {
                              setPayrollStep(1);
                              setActiveTab('admin-overview');
                            }}
                            className="bg-primary-navy text-white text-xs font-bold px-6 py-2 rounded-full hover:bg-accent-violet transition-colors"
                          >
                            Return to Command overview
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* ==========================================
                PAGE 7: EMPLOYEE SELF-SERVICE DASHBOARD
                ========================================== */}
            {activeTab === 'emp-overview' && (
              <div className="space-y-8 text-left animate-float-quick">
                {/* Welcome Card Banner */}
                <div className="gradient-navy-indigo p-6 rounded-3xl text-white flex flex-col tablet:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
                  <div className="space-y-2 relative z-10">
                    <h2 className="text-xl font-black">Good Morning, Neha Patel!</h2>
                    <p className="text-xs text-surface/80">Your next compensation payout credit is scheduled in **4 days** (June 1st, 2026).</p>
                  </div>
                  
                  <div className="flex items-center space-x-3 bg-white/10 border border-white/20 px-4 py-2 rounded-full text-xs font-bold relative z-10">
                    <MapPin className="w-4 h-4 text-gold animate-bounce" />
                    <span>HQ Geofence status: In Range</span>
                  </div>
                </div>

                {/* Grid Overview widgets */}
                <div className="grid grid-cols-1 desktop:grid-cols-3 gap-8">
                  
                  {/* Left Column: Wallet widget */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-accent-violet font-extrabold uppercase">Wallet Ring</span>
                      <span className="text-teal font-extrabold text-xs">Primary USD</span>
                    </div>

                    <div className="flex items-center justify-around py-4">
                      {/* Circular Progress Balance */}
                      <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <circle className="text-gray-150" strokeWidth="3" stroke="currentColor" fill="transparent" r="16" cx="18" cy="18" />
                          <circle className="text-gold" strokeWidth="4" strokeDasharray="80, 100" strokeLinecap="round" stroke="currentColor" fill="transparent" r="16" cx="18" cy="18" />
                        </svg>
                        <div className="absolute text-center">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Balance</span>
                          <h3 className="text-lg font-black text-primary-navy dark:text-white">${walletBalance.toLocaleString()}</h3>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button 
                        onClick={() => setActiveTab('emp-wallet')}
                        className="flex-1 bg-gold hover:bg-gold/90 text-primary-navy font-black py-2.5 rounded-full text-xs shadow transition-all"
                      >
                        Withdraw funds
                      </button>
                      <button 
                        onClick={() => alert('Bank settings drawer placeholder active')}
                        className="border border-gray-200 hover:bg-surface text-gray-500 py-2.5 rounded-full text-xs font-bold transition-all px-4"
                      >
                        Linked bank
                      </button>
                    </div>
                  </div>

                  {/* Center Column: Quick Stats */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-4 text-xs font-semibold text-gray-600 dark:text-gray-300">
                    <span className="text-[10px] text-accent-violet font-extrabold uppercase">Dossier summary stats</span>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                        <span>Current Month Attendance</span>
                        <span className="font-extrabold text-teal">98% Present</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                        <span>Paid Leave Balance</span>
                        <span className="font-extrabold text-accent-violet">18 days left</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Last Payout Date</span>
                        <span className="font-extrabold text-gray-700 dark:text-gray-200">May 1, 2026</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button 
                        onClick={() => setActiveTab('emp-chatbot')}
                        className="w-full bg-primary-navy text-white text-xs font-bold py-2.5 rounded-full hover:bg-accent-violet flex items-center justify-center space-x-2 shadow-md"
                      >
                        <Brain className="w-4 h-4 text-gold" />
                        <span>Launch AI Assistant panel</span>
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Check-in widget */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-4">
                    <span className="text-[10px] text-accent-violet font-extrabold uppercase">Biometric check-in logs</span>
                    
                    <div className="text-center py-4 space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-teal/10 text-teal flex items-center justify-center mx-auto shadow-sm">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-primary-navy dark:text-white text-xs">HQ Office check-in</h4>
                        <p className="text-[10px] text-gray-400">GPS geofence boundary: Validated</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        if (checkedInToday) {
                          setCheckedInToday(false);
                          alert('Check-out logged successfully.');
                        } else {
                          setCheckedInToday(true);
                          alert('Check-in logged successfully via GPS biometric match.');
                        }
                      }}
                      className={`w-full py-2.5 rounded-full text-xs font-black shadow transition-all ${
                        checkedInToday 
                          ? 'bg-danger text-white hover:bg-danger/90'
                          : 'bg-teal text-white hover:bg-teal/90'
                      }`}
                    >
                      {checkedInToday ? 'Biometric Check-Out' : 'Biometric Check-In'}
                    </button>
                  </div>
                </div>

                {/* Recent Payslips list */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                  <h4 className="text-xs font-bold text-primary-navy dark:text-white uppercase tracking-wider">Recent Paycheck slips</h4>
                  
                  <div className="grid grid-cols-1 tablet:grid-cols-3 gap-6">
                    {['May 2026', 'April 2026', 'March 2026'].map((m, idx) => (
                      <div key={idx} className="bg-surface dark:bg-gray-900 border border-gray-150 dark:border-gray-700 p-4 rounded-2xl text-left space-y-3 shadow-sm">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-primary-navy dark:text-white">{m}</span>
                          <span className="px-2 py-0.5 rounded bg-teal/15 text-teal text-[8px] uppercase tracking-wider font-extrabold">Paid</span>
                        </div>
                        <div className="flex items-baseline space-x-1">
                          <span className="text-lg font-black text-gray-800 dark:text-gray-100">$3,200</span>
                          <span className="text-[10px] text-gray-400">Net payout</span>
                        </div>
                        <button 
                          onClick={() => alert(`Branded payslip PDF download initiated for period ${m}.`)}
                          className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 font-bold py-2 rounded-lg text-[10px] shadow-sm transition-colors"
                        >
                          Download branded PDF
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ==========================================
                PAGE 7.1: MY WALLET PAGE (Employee)
                ========================================== */}
            {activeTab === 'emp-wallet' && (
              <div className="space-y-8 text-left animate-float-quick max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-150 shadow-xl space-y-6">
                  
                  <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                    <div>
                      <h3 className="text-sm font-black text-primary-navy dark:text-white uppercase tracking-wider">Treasury wallet coordinates</h3>
                      <p className="text-xs text-gray-400">Disburse or withdraw local funds to linked bank routing numbers.</p>
                    </div>
                    
                    <select className="bg-surface text-xs font-bold py-1.5 px-3 rounded border border-gray-200">
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>INR (₹)</option>
                    </select>
                  </div>

                  {/* Balance Display */}
                  <div className="bg-gradient-to-br from-primary-navy to-accent-violet p-8 rounded-3xl text-white flex flex-col tablet:flex-row justify-between items-start tablet:items-center gap-6 shadow-2xl relative overflow-hidden">
                    <div className="space-y-1 relative z-10">
                      <span className="text-[9px] uppercase font-bold text-surface/60 tracking-wider">Aggregated Wallet balance</span>
                      <h2 className="text-3xl font-black text-gold">${walletBalance.toLocaleString()}.00</h2>
                    </div>

                    <div className="space-y-4 relative z-10 w-full tablet:w-auto">
                      <div className="space-y-1 text-xs">
                        <label className="text-[9px] uppercase font-bold text-surface/60">Withdraw Amount</label>
                        <div className="flex bg-white/10 rounded-lg overflow-hidden border border-white/20">
                          <span className="p-2.5 text-gold font-bold bg-white/5 border-r border-white/10">$</span>
                          <input 
                            type="number" 
                            placeholder="1000" 
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                            className="bg-transparent text-white px-3 py-2 text-xs focus:outline-none w-32" 
                          />
                        </div>
                      </div>

                      <button 
                        onClick={() => {
                          const val = parseFloat(withdrawAmount);
                          if (val > 0 && val <= walletBalance) {
                            setWalletBalance(walletBalance - val);
                            setWalletTransactions([
                              { date: new Date().toISOString().split('T')[0], type: 'Withdrawal', amount: -val, currency: 'USD', ref: 'Citi Bank transfer', status: 'completed' },
                              ...walletTransactions
                            ]);
                            setWithdrawAmount('');
                            alert(`Withdrawal of $${val} submitted. Funds processing (1-2 business days).`);
                          } else {
                            alert('Invalid withdrawal amount.');
                          }
                        }}
                        className="w-full bg-gold hover:bg-gold/90 text-primary-navy font-black py-2.5 rounded-full text-xs shadow-lg transition-all"
                      >
                        Confirm bank Transfer
                      </button>
                    </div>
                  </div>

                  {/* Ledger Transactions list */}
                  <div className="space-y-3 pt-4">
                    <span className="text-[10px] text-accent-violet font-extrabold uppercase">Transaction Ledger</span>
                    
                    <div className="border border-gray-150 rounded-2xl overflow-hidden text-xs">
                      <table className="w-full text-left">
                        <thead className="bg-surface dark:bg-gray-950 font-bold text-gray-500">
                          <tr>
                            <th className="p-3">Date</th>
                            <th className="p-3">Reference</th>
                            <th className="p-3">Payout type</th>
                            <th className="p-3 text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:text-gray-300">
                          {walletTransactions.map((t, idx) => (
                            <tr key={idx}>
                              <td className="p-3 text-gray-400">{t.date}</td>
                              <td className="p-3 font-bold">{t.ref}</td>
                              <td className="p-3 capitalize">{t.type}</td>
                              <td className={`p-3 text-right font-black ${
                                t.amount > 0 ? 'text-teal' : 'text-danger-red'
                              }`}>
                                {t.amount > 0 ? '+' : ''}${t.amount.toLocaleString()}.00
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* ==========================================
                PAGE 7.2: GPS CHECK-IN & ATTENDANCE Heatmap (Employee)
                ========================================== */}
            {activeTab === 'emp-attendance' && (
              <div className="space-y-8 text-left animate-float-quick max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-150 shadow-xl space-y-6">
                  
                  <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                    <div>
                      <h3 className="text-sm font-black text-primary-navy dark:text-white uppercase tracking-wider">Attendance log registers</h3>
                      <p className="text-xs text-gray-400">Time-card history and biometric check-in utilities.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 tablet:grid-cols-2 gap-8 text-xs font-bold text-gray-700">
                    {/* Checkin trigger tools */}
                    <div className="border border-gray-150 p-6 rounded-2xl space-y-4 bg-surface/30">
                      <span className="text-[10px] text-accent-violet uppercase">Check-In methods</span>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <button 
                          onClick={() => alert('GPS Geofence: verified within Antigravity campus.')}
                          className="p-4 rounded-xl border border-gray-200 bg-white hover:border-gold transition-all text-center space-y-2 flex flex-col items-center shadow-sm"
                        >
                          <MapPin className="w-6 h-6 text-gold" />
                          <span className="text-[10px]">GPS Check-In</span>
                        </button>

                        <button 
                          onClick={() => alert('QR scanner launched.')}
                          className="p-4 rounded-xl border border-gray-200 bg-white hover:border-gold transition-all text-center space-y-2 flex flex-col items-center shadow-sm"
                        >
                          <QrCode className="w-6 h-6 text-accent-violet" />
                          <span className="text-[10px]">Lobby QR check</span>
                        </button>
                      </div>

                      <button 
                        onClick={() => {
                          setCheckedInToday(!checkedInToday);
                          if (!checkedInToday) {
                            setAttendanceLogs([
                              { date: new Date().toISOString().split('T')[0], checkIn: '09:12 AM', checkOut: '--', hours: 0, method: 'GPS', status: 'present' },
                              ...attendanceLogs
                            ]);
                          }
                        }}
                        className="w-full bg-primary-navy text-white text-xs py-2.5 rounded-full hover:bg-accent-violet transition-colors shadow-md"
                      >
                        {checkedInToday ? 'Perform Check-Out' : 'Perform Check-In'}
                      </button>
                    </div>

                    {/* Personal stats ring */}
                    <div className="border border-gray-150 p-6 rounded-2xl bg-surface/30 flex flex-col justify-between">
                      <span className="text-[10px] text-accent-violet uppercase">Attendance Rate this month</span>
                      <div className="flex items-center justify-around py-2">
                        <h4 className="text-3xl font-black text-teal">98%</h4>
                        <div className="space-y-1 text-[11px] font-semibold text-gray-500">
                          <p>Present days: 20 days</p>
                          <p>Leave days: 2 days</p>
                          <p>Absent: 0 days</p>
                        </div>
                      </div>
                      <p className="text-[9px] text-gray-400 italic font-medium">GPS geofenced logs update timesheets automatically daily at 06:00 PM.</p>
                    </div>
                  </div>

                  {/* List history logs */}
                  <div className="space-y-3 pt-4">
                    <span className="text-[10px] text-accent-violet font-extrabold uppercase">Attendance Log history</span>
                    
                    <div className="border border-gray-150 rounded-2xl overflow-hidden text-xs">
                      <table className="w-full text-left">
                        <thead className="bg-surface dark:bg-gray-950 font-bold text-gray-500">
                          <tr>
                            <th className="p-3">Date</th>
                            <th className="p-3">Check-In</th>
                            <th className="p-3">Check-Out</th>
                            <th className="p-3">Total hours</th>
                            <th className="p-3 text-right">Method</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:text-gray-300">
                          {attendanceLogs.map((log, idx) => (
                            <tr key={idx}>
                              <td className="p-3 font-bold">{log.date}</td>
                              <td className="p-3">{log.checkIn}</td>
                              <td className="p-3">{log.checkOut}</td>
                              <td className="p-3 font-semibold">{log.hours > 0 ? `${log.hours} hrs` : '--'}</td>
                              <td className="p-3 text-right">{log.method}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* ==========================================
                PAGE 7.3: LEAVE REQUESTS (Employee Form & List)
                ========================================== */}
            {activeTab === 'emp-leaves' && (
              <div className="space-y-8 text-left animate-float-quick max-w-4xl mx-auto">
                <div className="grid grid-cols-1 tablet:grid-cols-3 gap-6">
                  {leaveBalances.map((bal, idx) => (
                    <div key={idx} className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                      <span className="text-[9px] uppercase font-bold text-gray-400">{bal.type} Leave Balance</span>
                      <h3 className="text-xl font-black text-primary-navy dark:text-white">{bal.remaining} Days left</h3>
                      <span className="text-[10px] text-gray-400 font-bold">Used: {bal.used} / {bal.entitled} entitled</span>
                    </div>
                  ))}
                </div>

                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-150 shadow-xl space-y-6">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                    <h3 className="text-sm font-black text-primary-navy dark:text-white uppercase tracking-wider">Leave Applications</h3>
                    <button 
                      onClick={() => alert('Add leave request modal placeholder launched.')}
                      className="bg-primary-navy text-white text-[10px] font-bold px-3.5 py-1.5 rounded-full hover:bg-accent-violet shadow-sm"
                    >
                      Apply for leave
                    </button>
                  </div>

                  {/* Leave history logs */}
                  <div className="space-y-3">
                    <div className="border border-gray-150 rounded-2xl overflow-hidden text-xs">
                      <table className="w-full text-left">
                        <thead className="bg-surface dark:bg-gray-950 font-bold text-gray-500">
                          <tr>
                            <th className="p-3">Leave Type</th>
                            <th className="p-3">From Date</th>
                            <th className="p-3">To Date</th>
                            <th className="p-3">Total Days</th>
                            <th className="p-3">Reason</th>
                            <th className="p-3 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:text-gray-300">
                          {employeeLeaves.map((l, idx) => (
                            <tr key={idx}>
                              <td className="p-3 font-bold">{l.type}</td>
                              <td className="p-3">{l.from}</td>
                              <td className="p-3">{l.to}</td>
                              <td className="p-3 font-bold">{l.days} days</td>
                              <td className="p-3 text-gray-400">{l.reason}</td>
                              <td className="p-3 text-right">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                  l.status === 'pending'
                                    ? 'bg-gold/15 text-gold'
                                    : (l.status === 'approved' ? 'bg-teal/15 text-teal' : 'bg-danger/15 text-danger-red')
                                }`}>
                                  {l.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==========================================
                PAGE 7.4: AI ASSISTANT CHAT PANEL (Full page Sandbox view)
                ========================================== */}
            {activeTab === 'emp-chatbot' && (
              <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-3xl border border-gray-150 shadow-2xl h-[550px] flex flex-col justify-between overflow-hidden text-left">
                
                {/* Chat Header */}
                <div className="gradient-navy-indigo text-white p-4 flex items-center space-x-3 shadow-md">
                  <div className="w-10 h-10 rounded-full bg-gold/15 border border-gold/45 flex items-center justify-center text-gold shadow-md">
                    <Brain className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-white">AI Payroll assistant</h3>
                    <span className="text-[9px] text-gold font-bold">Model: GPT-4o Online</span>
                  </div>
                </div>

                {/* Messages Box */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-surface/30">
                  {chatMessages.map((m, idx) => (
                    <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'} animate-float-quick`}>
                      <div className={`p-3.5 rounded-2xl max-w-[85%] text-xs shadow-sm leading-relaxed ${
                        m.sender === 'user'
                          ? 'bg-primary-navy text-white rounded-tr-none'
                          : 'bg-white border border-gray-100 text-gray-700 rounded-tl-none'
                      }`}>
                        <p>{m.text}</p>
                        <span className="text-[8px] text-gray-400 font-bold block mt-1.5 text-right">{m.time}</span>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-gray-100 p-3 rounded-2xl text-xs text-gray-400 animate-pulse font-bold">
                        AI is compiling employee database components...
                      </div>
                    </div>
                  )}

                  {/* Escalate to HR banner */}
                  {showHREscalation && (
                    <div className="bg-gold/15 border border-gold/40 p-4 rounded-2xl text-left space-y-2 animate-float-quick">
                      <h4 className="text-xs font-bold text-primary-navy">Connect with Swetha Sharma (HR Manager)?</h4>
                      <p className="text-[10px] text-gray-500">I will compile this chat context and create a priority ticket in Swetha's queue.</p>
                      <button 
                        onClick={() => {
                          setShowHREscalation(false);
                          alert('HR escalation ticket created successfully.');
                        }}
                        className="bg-gold text-primary-navy font-bold px-4 py-1.5 rounded-full text-[10px] shadow"
                      >
                        Create HR Ticket
                      </button>
                    </div>
                  )}
                </div>

                {/* Quick actions chips */}
                <div className="px-4 py-2 border-t border-gray-100 flex flex-wrap gap-2 bg-white">
                  {[
                    "Explain my last payslip",
                    "Why was TDS deducted?",
                    "How many leaves left?",
                    "When is my next salary?"
                  ].map((chip, idx) => (
                    <button 
                      key={idx}
                      onClick={() => sendChatMessage(chip)}
                      className="bg-surface hover:bg-gold/15 hover:text-primary-navy border border-gray-200 text-gray-500 text-[10px] font-bold px-3 py-1.5 rounded-full transition-colors"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                {/* Input box */}
                <div className="p-4 border-t border-gray-150 bg-white flex items-center space-x-3">
                  <input 
                    type="text" 
                    placeholder="Ask about salary, TDS, leaves..." 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendChatMessage(chatInput)}
                    className="flex-1 bg-surface border border-gray-200 rounded-full px-4 py-2.5 text-xs" 
                  />
                  <button 
                    onClick={() => sendChatMessage(chatInput)}
                    className="p-2.5 rounded-full bg-primary-navy text-white hover:bg-accent-violet transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>

              </div>
            )}

            {/* ==========================================
                PAGE 8: REPORTS & ANALYTICS HUB
                ========================================== */}
            {activeTab === 'admin-reports' && (
              <div className="space-y-8 text-left animate-float-quick">
                <div className="flex justify-between items-center flex-wrap gap-4 border-b border-gray-200 pb-4">
                  <div>
                    <h1 className="text-xl font-black text-primary-navy dark:text-white">Reports & Analytics Hub</h1>
                    <p className="text-xs text-gray-400">Role-gated executive compensation analyses and audits.</p>
                  </div>

                  {/* AI Summarizer drawer trigger */}
                  <div className="flex bg-white dark:bg-gray-800 p-2.5 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm relative w-80 items-center">
                    <input 
                      type="text" 
                      placeholder="Ask AI to highlights trends..." 
                      value={reportQuery}
                      onChange={(e) => setReportQuery(e.target.value)}
                      className="bg-transparent text-xs text-gray-700 dark:text-gray-200 flex-1 px-3 focus:outline-none"
                    />
                    <button 
                      onClick={() => {
                        setLoadingAiReport(true);
                        setTimeout(() => {
                          const fallbackText = `### Executive Summary: AI analysis for Antigravity Technologies\n\n- **Workforce count**: **${employees.length} Active Employees**.\n- **Tax accures**: TDS matched at **10%**.\n- **Optimization suggestion**: geofence attendance logs show perfect WFH rates averaging **24%**, indicating physical real-estate utility savings of **$4,500/mo**.`;
                          setAiNarrativeSummary(fallbackText);
                          setLoadingAiReport(false);
                        }, 1200);
                      }}
                      className="bg-gold text-primary-navy px-3.5 py-1.5 rounded-full text-[10px] font-black shadow-md flex items-center space-x-1"
                    >
                      <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
                      <span>Ask AI</span>
                    </button>
                  </div>
                </div>

                {/* AI report summary popover */}
                {aiNarrativeSummary && (
                  <div className="bg-white dark:bg-gray-850 p-6 rounded-3xl border-2 border-gold shadow-2xl space-y-4 animate-float-quick relative">
                    <button onClick={() => setAiNarrativeSummary('')} className="absolute top-4 right-4 text-gray-400">✕</button>
                    <div className="flex items-center space-x-2 text-gold font-extrabold text-xs uppercase tracking-wider">
                      <Sparkles className="w-4 h-4" />
                      <span>AI Analytical Summary</span>
                    </div>
                    <div className="text-xs leading-relaxed text-gray-600 dark:text-gray-300 font-semibold space-y-2">
                      <p><strong>Workforce processed</strong>: 42 verified Active Employees.</p>
                      <p><strong>Gross expenditures</strong>: $184,500.00 base. TDS tax reserves: $18,450.00.</p>
                      <p><strong>Deduction ratios</strong>: Statutory PF at 12%, ESI at 0.75%. Professional tax cap of $200 applied successfully.</p>
                    </div>
                  </div>
                )}

                {/* Report Tabs */}
                <div className="flex flex-wrap space-x-3 border-b border-gray-200 pb-2 text-xs font-bold text-gray-400">
                  {['Summary', 'Salary Register', 'Tax Liability', 'Anomaly Report'].map((tab) => (
                    <button 
                      key={tab}
                      onClick={() => setActiveReportTab(tab)}
                      className={`pb-2 border-b-2 transition-all ${
                        activeReportTab === tab ? 'border-accent-violet text-accent-violet font-black' : 'border-transparent hover:text-gray-600'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                {activeReportTab === 'Summary' && (
                  <div className="grid grid-cols-1 tablet:grid-cols-3 gap-6 animate-float-quick text-left">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-150 dark:border-gray-700 shadow-sm space-y-2">
                      <span className="text-[9px] uppercase font-bold text-gray-400">Gross spend (MTD)</span>
                      <h4 className="text-xl font-black text-primary-navy dark:text-white">$184,500.00</h4>
                      <p className="text-[10px] text-gray-500">Processed in USD Primary</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-150 dark:border-gray-700 shadow-sm space-y-2">
                      <span className="text-[9px] uppercase font-bold text-gray-400">Distributed Net</span>
                      <h4 className="text-xl font-black text-teal">$163,120.00</h4>
                      <p className="text-[10px] text-gray-500">Credited to employee wallets</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-150 dark:border-gray-700 shadow-sm space-y-2">
                      <span className="text-[9px] uppercase font-bold text-gray-400">Statutory matched PF</span>
                      <h4 className="text-xl font-black text-accent-violet">$18,450.00</h4>
                      <p className="text-[10px] text-gray-500">Matched 12% matches</p>
                    </div>
                  </div>
                )}

                {activeReportTab === 'Salary Register' && (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-150 overflow-hidden shadow-sm animate-float-quick">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-surface dark:bg-gray-950 font-bold text-gray-500">
                        <tr>
                          <th className="p-3">Employee</th>
                          <th className="p-3">Dept</th>
                          <th className="p-3">Gross</th>
                          <th className="p-3">TDS (10%)</th>
                          <th className="p-3">PF matching</th>
                          <th className="p-3 text-right">Net Payout</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:text-gray-300">
                        {employees.map(e => (
                          <tr key={e.id}>
                            <td className="p-3 font-bold text-primary-navy dark:text-white">{e.name}</td>
                            <td className="p-3">{e.dept}</td>
                            <td className="p-3">${e.salary.toLocaleString()}.00</td>
                            <td className="p-3 text-danger-red">-${(e.salary * 0.1).toFixed(2)}</td>
                            <td className="p-3 text-danger-red">-${(e.salary * 0.06).toFixed(2)}</td>
                            <td className="p-3 text-right font-bold text-teal">${(e.salary * 0.84).toLocaleString()}.00</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeReportTab === 'Tax Liability' && (
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-150 shadow-sm animate-float-quick text-left space-y-4 text-xs font-semibold text-gray-600 dark:text-gray-300">
                    <span className="text-[10px] text-accent-violet uppercase">Liabilities breakdown</span>
                    <div className="divide-y divide-gray-100 space-y-2">
                      <div className="flex justify-between py-2"><span>Professional Tax (Org Cap)</span> <span className="font-bold">$200.00</span></div>
                      <div className="flex justify-between py-2"><span>TDS Accumulations</span> <span className="font-bold">$18,450.00</span></div>
                      <div className="flex justify-between py-2"><span>Employee PF matched matching</span> <span className="font-bold">$11,070.00</span></div>
                    </div>
                  </div>
                )}

                {activeReportTab === 'Anomaly Report' && (
                  <div className="space-y-4 animate-float-quick">
                    {fraudAlerts.map((a, idx) => (
                      <div key={idx} className="p-5 rounded-2xl border border-danger/30 bg-danger/5 text-danger-red text-left text-xs space-y-2">
                        <div className="flex justify-between font-bold">
                          <span>{a.anomaly_type}</span>
                          <span>Score: {(a.score * 100).toFixed(0)}%</span>
                        </div>
                        <p className="text-[11px] text-gray-600 dark:text-gray-300">{a.details}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ==========================================
                PAGE 9: MULTI-CURRENCY SETTINGS
                ========================================== */}
            {activeTab === 'admin-currencies' && (
              <div className="space-y-8 text-left animate-float-quick max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-150 shadow-xl space-y-6">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                    <div>
                      <h3 className="text-sm font-black text-primary-navy dark:text-white uppercase tracking-wider">Multi-Currency Settings</h3>
                      <p className="text-xs text-gray-400">Cached rates pulled from Open Exchange Rates every 60 minutes.</p>
                    </div>
                    
                    <button 
                      onClick={() => alert('New currency addition modal launched.')}
                      className="bg-primary-navy text-white text-[10px] font-bold px-4 py-2 rounded-full hover:bg-accent-violet shadow-sm"
                    >
                      Add Currency
                    </button>
                  </div>

                  {/* Cache Rate status Alert */}
                  <div className="bg-gold/10 border border-gold/30 p-3 rounded-lg flex items-start space-x-3 text-xs text-primary-navy">
                    <Clock className="w-4 h-4 text-gold mt-0.5" />
                    <p><strong>Live Caching Status</strong>: Open Exchange API reachable. Last refreshed: 24 minutes ago. Cached rate is active.</p>
                  </div>

                  {/* Currency list table */}
                  <div className="border border-gray-150 rounded-2xl overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-surface dark:bg-gray-950 font-bold text-gray-500">
                        <tr>
                          <th className="p-3">Currency Code</th>
                          <th className="p-3">Name</th>
                          <th className="p-3">Symbol</th>
                          <th className="p-3">Live FX Rate (1 USD)</th>
                          <th className="p-3 text-right">Manual Override</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:text-gray-300">
                        {fxRates.map((c, idx) => (
                          <tr key={idx}>
                            <td className="p-3 font-bold text-primary-navy dark:text-white">{c.code}</td>
                            <td className="p-3">{c.name}</td>
                            <td className="p-3 font-mono font-bold text-gray-500">{c.symbol}</td>
                            <td className="p-3 font-bold text-teal">{c.rate.toFixed(4)}</td>
                            <td className="p-3 text-right">
                              <input 
                                type="number" 
                                placeholder={c.rate.toFixed(2)}
                                className="w-20 bg-surface dark:bg-gray-900 border border-gray-200 rounded p-1 text-[10px] text-right font-mono"
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value);
                                  if (val > 0) {
                                    setFxRates(fxRates.map(curr => curr.code === c.code ? { ...curr, rate: val } : curr));
                                  }
                                }}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ==========================================
                PAGE 10: SYSTEM SETTINGS
                ========================================== */}
            {activeTab === 'admin-settings' && (
              <div className="space-y-8 text-left animate-float-quick max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-150 shadow-xl space-y-6">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                    <div>
                      <h3 className="text-sm font-black text-primary-navy dark:text-white uppercase tracking-wider">System Config Settings</h3>
                      <p className="text-xs text-gray-400">Configure geofences, cutoff dates, and statutory rules.</p>
                    </div>
                  </div>

                  {/* Settings sub-tabs */}
                  <div className="flex space-x-4 border-b border-gray-100 pb-2 text-xs font-bold text-gray-400">
                    {['profile', 'geofence', 'security', 'integrations'].map(tab => (
                      <button 
                        key={tab}
                        onClick={() => setSettingsTab(tab)}
                        className={`pb-2 capitalize border-b-2 transition-all ${
                          settingsTab === tab ? 'border-accent-violet text-accent-violet font-black' : 'border-transparent hover:text-gray-600'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {/* Profile tabs */}
                  {settingsTab === 'profile' && (
                    <div className="space-y-4 animate-float-quick text-xs">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-gray-400">Company Name</label>
                          <input type="text" value="Antigravity Technologies" className="w-full bg-surface dark:bg-gray-900 border border-gray-200 rounded p-2" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-gray-400">Registration Number</label>
                          <input type="text" value="CIN-U72200KA2018PTC112" className="w-full bg-surface dark:bg-gray-900 border border-gray-200 rounded p-2" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Geofence Tab */}
                  {settingsTab === 'geofence' && (
                    <div className="space-y-4 animate-float-quick text-xs text-gray-600 dark:text-gray-300">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-gray-400">Geofence Radius (meters)</label>
                          <input type="number" defaultValue="200" className="w-full bg-surface dark:bg-gray-900 border border-gray-200 rounded p-2" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-gray-400">Shift Start time</label>
                          <input type="text" defaultValue="09:00 AM" className="w-full bg-surface dark:bg-gray-900 border border-gray-200 rounded p-2" />
                        </div>
                      </div>
                      <p className="text-[9px] text-gray-400 italic">Employees check-ins beyond coordinates are flagged as WFH automatically.</p>
                    </div>
                  )}

                  {/* Security Tab */}
                  {settingsTab === 'security' && (
                    <div className="space-y-4 animate-float-quick text-xs text-gray-600 dark:text-gray-300 font-semibold">
                      <div className="flex items-center justify-between pb-2 border-b border-gray-50">
                        <span>Enforce 2FA Authenticator for admins</span>
                        <input type="checkbox" defaultChecked className="rounded text-accent-violet" />
                      </div>
                      <div className="flex items-center justify-between pb-2 border-b border-gray-50">
                        <span>Session Auto-invalidation (30 mins)</span>
                        <input type="checkbox" defaultChecked className="rounded text-accent-violet" />
                      </div>
                    </div>
                  )}

                  {/* Integrations Tab */}
                  {settingsTab === 'integrations' && (
                    <div className="grid grid-cols-2 gap-4 animate-float-quick text-xs">
                      <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-xl space-y-2">
                        <div className="flex justify-between font-bold"><span>Slack App</span> <span className="text-teal">Connected</span></div>
                        <p className="text-[10px] text-gray-400">Auto dispatches notifications on channels.</p>
                      </div>
                      <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-xl space-y-2">
                        <div className="flex justify-between font-bold"><span>QuickBooks</span> <span className="text-teal">Connected</span></div>
                        <p className="text-[10px] text-gray-400">Syncs monthly ledgers automatically.</p>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* ==========================================
                PAGE 12: ORG CHART MODULE
                ========================================== */}
            {activeTab === 'hr-attrition' && (
              <div className="space-y-8 text-left animate-float-quick max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-150 shadow-xl space-y-6">
                  
                  <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                    <div>
                      <h3 className="text-sm font-black text-primary-navy dark:text-white uppercase tracking-wider">Organizational reporting Structure</h3>
                      <p className="text-xs text-gray-400">Interactive reporting lines directory.</p>
                    </div>
                    
                    <input 
                      type="text" 
                      placeholder="Search node name..." 
                      value={searchNode}
                      onChange={(e) => setSearchNode(e.target.value)}
                      className="bg-surface text-xs pl-3 pr-8 py-1.5 rounded border border-gray-200 w-48"
                    />
                  </div>

                  {/* Dynamic Interactive Reporting Node boxes */}
                  <div className="flex flex-col items-center space-y-8 pt-4">
                    
                    {/* Root Node: Manager */}
                    <div className="p-4 rounded-xl border-2 border-gold bg-gold/5 text-center space-y-1 shadow w-48">
                      <div className="w-9 h-9 rounded-full bg-primary-navy text-white mx-auto flex items-center justify-center font-bold text-xs">V</div>
                      <h4 className="font-extrabold text-primary-navy dark:text-white text-xs mt-1">Vinay Kumar</h4>
                      <p className="text-[9px] text-gray-400 uppercase tracking-wider">Super Admin</p>
                    </div>

                    <div className="h-6 w-0.5 bg-gray-300 relative">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gray-300" />
                    </div>

                    {/* Children nodes row */}
                    <div className="flex flex-wrap justify-center gap-12 relative">
                      
                      {/* Child 1: HR */}
                      <div className="space-y-4">
                        <div className="p-4 rounded-xl border border-accent-violet bg-white dark:bg-gray-900 text-center space-y-1 shadow w-40">
                          <div className="w-8 h-8 rounded-full bg-accent-violet text-white mx-auto flex items-center justify-center font-bold text-xs">S</div>
                          <h4 className="font-extrabold text-primary-navy dark:text-white text-[11px] mt-1">Swetha Sharma</h4>
                          <p className="text-[8px] text-gray-400">HR Manager</p>
                        </div>
                      </div>

                      {/* Child 2: Engineer Mgr */}
                      <div className="space-y-4">
                        <div className="p-4 rounded-xl border border-accent-violet bg-white dark:bg-gray-900 text-center space-y-1 shadow w-40">
                          <div className="w-8 h-8 rounded-full bg-accent-violet text-white mx-auto flex items-center justify-center font-bold text-xs">A</div>
                          <h4 className="font-extrabold text-primary-navy dark:text-white text-[11px] mt-1">Aditya Roy</h4>
                          <p className="text-[8px] text-gray-400">Engineering Manager</p>
                        </div>
                      </div>

                    </div>

                  </div>

                </div>
              </div>
            )}

          </main>
        </div>
      )}

    </div>
  );
}
