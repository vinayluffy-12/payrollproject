const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'payrollos_super_jwt_secret_key_rs256_placeholder';

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Access denied. No authorization header provided.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Access denied. Format must be Bearer <token>.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    // Optional: check user status in database
    const dbUser = await User.findByPk(decoded.id);
    if (!dbUser || dbUser.status !== 'active') {
      return res.status(403).json({ error: 'Account suspended or pending verification.' });
    }

    next();
  } catch (error) {
    console.error('JWT Token verification error:', error);
    return res.status(401).json({ error: 'Invalid or expired session token.' });
  }
};

// Role authorization middleware
const checkRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    const { role } = req.user;
    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
      return res.status(403).json({ error: 'Access denied. Insufficient permissions for this action.' });
    }

    next();
  };
};

module.exports = {
  verifyToken,
  checkRole
};
