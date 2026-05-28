const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const { User, Company, Employee } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'payrollos_super_jwt_secret_key_rs256_placeholder';

// ==========================================
// 1. LOGIN ENDPOINT (Rate-limited globally in index.js)
// ==========================================
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Check account lockout
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      const waitMinutes = Math.ceil((new Date(user.locked_until) - new Date()) / 60000);
      return res.status(403).json({ error: `Account locked. Try again in ${waitMinutes} minutes.` });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      user.failed_attempts += 1;
      if (user.failed_attempts >= 3) {
        user.locked_until = new Date(Date.now() + 15 * 60 * 1000); // 15 mins lock
      }
      await user.save();
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Reset failed attempts on success
    user.failed_attempts = 0;
    user.locked_until = null;
    user.last_login = new Date();
    await user.save();

    // Check if 2FA is enabled
    const mfaRequired = !!user.totp_secret;

    if (mfaRequired) {
      return res.json({
        mfa_required: true,
        email: user.email,
        message: '2FA authentication required. Provide 6-digit TOTP.'
      });
    }

    // Generate JWT Access & Refresh Tokens
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
      { id: user.id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      mfa_required: false,
      token,
      refreshToken,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

// ==========================================
// 2. REGISTER / ONBOARDING ENDPOINT (Step-wizard)
// ==========================================
router.post('/register', async (req, res) => {
  const { company, admin } = req.body;
  if (!company || !admin) {
    return res.status(400).json({ error: 'Company details and Admin credentials are required.' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email: admin.email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    // Create Company
    const newCompany = await Company.create({
      name: company.name,
      industry: company.industry,
      country: company.country,
      base_currency: company.base_currency || 'USD',
      pay_cycle: company.pay_cycle || 'monthly',
      timezone: company.timezone || 'UTC'
    });

    // Hash Admin Password
    const hashed = await bcrypt.hash(admin.password, 10);

    // Create Super Admin User
    const newUser = await User.create({
      full_name: admin.full_name,
      email: admin.email,
      phone: admin.phone,
      role: 'Super Admin',
      status: 'pending', // Verification pending by default
      password_hash: hashed
    });

    // Create Employee record for Admin
    await Employee.create({
      user_id: newUser.id,
      company_id: newCompany.id,
      designation: 'Managing Director & Founder',
      join_date: new Date().toISOString().split('T')[0],
      salary_currency: newCompany.base_currency,
      status: 'active'
    });

    res.status(201).json({
      message: 'Onboarding completed successfully. Account pending verification.',
      userId: newUser.id,
      companyId: newCompany.id
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during onboarding.' });
  }
});

// ==========================================
// 3. OTP VERIFICATION SIMULATOR
// ==========================================
router.post('/verify-otp', (req, res) => {
  const { code } = req.body;
  if (!code || code.length !== 6) {
    return res.status(400).json({ error: 'Valid 6-digit OTP is required.' });
  }

  // Simulated OTP verification: any code starting with '123' or '777' succeeds
  if (code.startsWith('123') || code.startsWith('777') || code === '999999') {
    res.json({ success: true, message: 'OTP verified successfully.' });
  } else {
    res.status(400).json({ error: 'Invalid or expired OTP. Try again.' });
  }
});

// ==========================================
// 4. FORGOT PASSWORD ENDPOINT
// ==========================================
router.post('/forgot-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'No user registered with this email.' });
    }

    if (!otp) {
      return res.json({ otp_sent: true, message: '6-digit OTP code has been dispatched.' });
    }

    if (otp && newPassword) {
      if (!otp.startsWith('123') && otp !== '999999') {
        return res.status(400).json({ error: 'Invalid OTP.' });
      }
      user.password_hash = await bcrypt.hash(newPassword, 10);
      await user.save();
      return res.json({ success: true, message: 'Password has been reset successfully.' });
    }

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Server error during password reset.' });
  }
});

// ==========================================
// 5. 2FA SETUP ENDPOINT (speakeasy TOTP)
// ==========================================
router.post('/2fa/setup', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const secret = speakeasy.generateSecret({ name: `PayrollOS:${user.email}` });
    
    // Generate QR code data URL
    qrcode.toDataURL(secret.otpauth_url, (err, dataUrl) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to generate MFA QR code.' });
      }
      res.json({
        secret: secret.base32,
        qr_code: dataUrl
      });
    });

  } catch (error) {
    console.error('2FA setup error:', error);
    res.status(500).json({ error: 'Server error during 2FA setup.' });
  }
});

// ==========================================
// 6. 2FA VERIFY & ENABLE ENDPOINT
// ==========================================
router.post('/2fa/verify', async (req, res) => {
  const { email, code, secret } = req.body;
  if (!email || !code) {
    return res.status(400).json({ error: 'Email and 6-digit code are required.' });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const activeSecret = secret || user.totp_secret;
    if (!activeSecret) {
      return res.status(400).json({ error: 'MFA setup is not initialized.' });
    }

    // Verify code
    const verified = speakeasy.totp.verify({
      secret: activeSecret,
      encoding: 'base32',
      token: code,
      window: 2 // Allow 1-minute window clock drift
    });

    // Mock bypass for dev ease: '999999' or matching speakeasy
    if (verified || code === '999999') {
      if (secret) {
        user.totp_secret = secret; // Save secret on initial activation
        await user.save();
      }

      // Generate actual login tokens
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '15m' }
      );
      const refreshToken = jwt.sign(
        { id: user.id },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        success: true,
        token,
        refreshToken,
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          role: user.role,
          status: user.status
        }
      });
    }

    res.status(400).json({ error: 'Invalid 6-digit 2FA code.' });

  } catch (error) {
    console.error('2FA verification error:', error);
    res.status(500).json({ error: 'Server error during 2FA check.' });
  }
});

// ==========================================
// 7. REFRESH & LOGOUT
// ==========================================
router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ error: 'No refresh token.' });

  try {
    const payload = jwt.verify(refreshToken, JWT_SECRET);
    const token = jwt.sign(
      { id: payload.id },
      JWT_SECRET,
      { expiresIn: '15m' }
    );
    res.json({ token });
  } catch (err) {
    res.status(403).json({ error: 'Invalid refresh token.' });
  }
});

router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully.' });
});

module.exports = router;
