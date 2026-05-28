const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { Wallet, WalletTransaction } = require('../models');

router.use(verifyToken);

// ==========================================
// 1. GET WALLET BY EMPLOYEE ID
// ==========================================
router.get('/:employeeId', async (req, res) => {
  try {
    const wallet = await Wallet.findOne({
      where: { employee_id: req.params.employeeId }
    });

    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found.' });
    }

    res.json(wallet);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch wallet information.' });
  }
});

// ==========================================
// 2. GET WALLET TRANSACTION LEDGER
// ==========================================
router.get('/:id/transactions', async (req, res) => {
  try {
    const transactions = await WalletTransaction.findAll({
      where: { wallet_id: req.params.id },
      order: [['created_at', 'DESC']]
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch wallet transactions.' });
  }
});

// ==========================================
// 3. WITHDRAWAL PIPELINE (debit)
// ==========================================
router.post('/:id/withdraw', async (req, res) => {
  const { amount, bank_account_id } = req.body;
  if (!amount || parseFloat(amount) <= 0) {
    return res.status(400).json({ error: 'Provide a valid positive withdrawal amount.' });
  }

  try {
    const wallet = await Wallet.findByPk(req.params.id);
    if (!wallet) return res.status(404).json({ error: 'Wallet not found.' });

    const balance = parseFloat(wallet.balance);
    const withdrawVal = parseFloat(amount);

    if (balance < withdrawVal) {
      return res.status(400).json({ error: 'Insufficient wallet balance.' });
    }

    // Process debit transaction
    wallet.balance = balance - withdrawVal;
    await wallet.save();

    const transaction = await WalletTransaction.create({
      wallet_id: wallet.id,
      type: 'withdrawal',
      amount: withdrawVal,
      currency: wallet.currency,
      reference: `Bank Transfer (Acc: ${bank_account_id || 'PrimaryLinked'})`,
      status: 'completed' // In production, this can start as 'pending' and resolve asynchronously
    });

    res.json({
      success: true,
      message: 'Withdrawal completed successfully. Funds transferred to bank.',
      wallet,
      transaction
    });

  } catch (error) {
    console.error('Withdrawal error:', error);
    res.status(500).json({ error: 'Failed to process withdrawal transaction.' });
  }
});

module.exports = router;
