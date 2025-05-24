const express = require('express');
const { body } = require('express-validator');
const { validateRequest } = require('../middleware/validation');
const { protect } = require('../middleware/auth');
const {
  register,
  login,
  changePassword,
  forgotPassword,
  resetPassword,
  logout,
  verifyResetToken
} = require('../controllers/authController');

const router = express.Router();

// Registration
router.post('/register',
  [
    body('username')
      .trim()
      .isLength({ min: 3, max: 50 })
      .withMessage('Username must be between 3 and 50 characters')
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('Username can only contain letters, numbers, and underscores'),
    
    body('email')
      .trim()
      .isEmail()
      .withMessage('Please enter a valid email')
      .normalizeEmail(),
    
    body('password')
      .trim()
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
  ],
  validateRequest,
  register
);

// Login
router.post('/login',
  [
    body('email')
      .trim()
      .isEmail()
      .withMessage('Please enter a valid email')
      .normalizeEmail(),
    
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password is required')
  ],
  validateRequest,
  login
);

// Change password (protected route)
router.post('/change-password',
  protect,
  [
    body('currentPassword')
      .trim()
      .notEmpty()
      .withMessage('Current password is required'),
    
    body('newPassword')
      .trim()
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters long')
  ],
  validateRequest,
  changePassword
);

// Forgot password
router.post('/forgot-password',
  [
    body('email')
      .trim()
      .isEmail()
      .withMessage('Please enter a valid email')
      .normalizeEmail()
  ],
  validateRequest,
  forgotPassword
);

// Verify reset token
router.post('/verify-reset-token',
  [
    body('token')
      .trim()
      .notEmpty()
      .withMessage('Reset token is required')
  ],
  validateRequest,
  verifyResetToken
);

// Reset password
router.post('/reset-password',
  [
    body('token')
      .trim()
      .notEmpty()
      .withMessage('Reset token is required'),
    
    body('newPassword')
      .trim()
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters long')
  ],
  validateRequest,
  resetPassword
);

// Logout
router.post('/logout', logout);

module.exports = router; 