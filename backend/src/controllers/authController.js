const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const { validatePassword, hashPassword, verifyPassword, PasswordError } = require('../utils/password');
const { ValidationError, AuthenticationError, NotFoundError } = require('../utils/errors');
const passwordConfig = require('../config/password');

// Register new user
const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if username or email already exists
    const [existingUsers] = await pool.query(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUsers.length > 0) {
      throw new ValidationError('Username or email already exists');
    }

    // Validate and hash password
    validatePassword(password);
    const { hash, salt } = await hashPassword(password);

    // Store user
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password_hash, salt) VALUES (?, ?, ?, ?)',
      [username, email, hash, salt]
    );

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: { userId: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

// Login user
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      throw new AuthenticationError('Invalid email or password');
    }

    const user = users[0];

    // Verify password
    const isValid = await verifyPassword(password, user.password_hash, user.salt);
    if (!isValid) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      status: 'success',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Change password
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id; // From auth middleware

    // Get user
    const [users] = await pool.query(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      throw new NotFoundError('User not found');
    }

    const user = users[0];

    // Verify current password
    const isValid = await verifyPassword(currentPassword, user.password_hash, user.salt);
    if (!isValid) {
      throw new AuthenticationError('Current password is incorrect');
    }

    // Validate and hash new password
    validatePassword(newPassword);
    const { hash, salt } = await hashPassword(newPassword);

    // Check password history
    const [passwordHistory] = await pool.query(
      'SELECT password_hash, salt FROM password_history WHERE user_id = ? ORDER BY created_at DESC LIMIT ?',
      [userId, passwordConfig.passwordHistoryCount]
    );

    // Check if new password matches any previous passwords
    for (const history of passwordHistory) {
      const isMatch = await verifyPassword(newPassword, history.password_hash, history.salt);
      if (isMatch) {
        throw new ValidationError('Cannot reuse any of your last 5 passwords');
      }
    }

    // Store current password in history
    await pool.query(
      'INSERT INTO password_history (user_id, password_hash, salt) VALUES (?, ?, ?)',
      [userId, user.password_hash, user.salt]
    );

    // Update password
    await pool.query(
      'UPDATE users SET password_hash = ?, salt = ? WHERE id = ?',
      [hash, salt, userId]
    );

    res.json({
      status: 'success',
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Forgot password
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Find user
    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    console.log('\n==================================================');
    console.log('Password Reset Request Received');
    console.log('Email:', email);

    if (users.length === 0) {
      console.log('No user found with email:', email);
      // We still send a success response for security
      return res.json({
        status: 'success',
        message: 'If the email exists, a token has been sent'
      });
    }

    // Generate reset token
    const resetToken = crypto.createHash('sha1').update(crypto.randomBytes(32)).digest('hex');
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    // Store token
    await pool.query(
      'UPDATE users SET reset_token = ?, reset_expires = ? WHERE email = ?',
      [resetToken, resetExpires, email]
    );

    // Log the token to console
    console.log('\n=============== PASSWORD RESET TOKEN ===============');
    console.log('Email:', email);
    console.log('Token:', resetToken);
    console.log('Expires:', resetExpires);
    console.log('==================================================\n');

    // TODO: Send email with reset token
    // For now, just return the token (in production, send via email)
    res.json({
      status: 'success',
      message: 'If the email exists, a token has been sent',
      data: { resetToken }
    });
  } catch (error) {
    next(error);
  }
};

// Verify reset token
const verifyResetToken = async (req, res, next) => {
  try {
    const { token } = req.body;

    // Find user with valid reset token
    const [users] = await pool.query(
      'SELECT * FROM users WHERE reset_token = ? AND reset_expires > NOW()',
      [token]
    );

    if (users.length === 0) {
      throw new ValidationError('Invalid or expired reset token');
    }

    res.json({
      status: 'success',
      message: 'Token is valid'
    });
  } catch (error) {
    next(error);
  }
};

// Reset password
const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    // Find user with valid reset token
    const [users] = await pool.query(
      'SELECT * FROM users WHERE reset_token = ? AND reset_expires > NOW()',
      [token]
    );

    if (users.length === 0) {
      throw new ValidationError('Invalid or expired reset token');
    }

    const user = users[0];

    // Validate and hash new password
    validatePassword(newPassword);
    const { hash, salt } = await hashPassword(newPassword);

    // Check password history
    const [passwordHistory] = await pool.query(
      'SELECT password_hash, salt FROM password_history WHERE user_id = ? ORDER BY created_at DESC LIMIT ?',
      [user.id, passwordConfig.passwordHistoryCount]
    );

    // Check if new password matches any previous passwords
    for (const history of passwordHistory) {
      const isMatch = await verifyPassword(newPassword, history.password_hash, history.salt);
      if (isMatch) {
        throw new ValidationError('Cannot reuse any of your last 3 passwords');
      }
    }

    // Store current password in history before updating
    await pool.query(
      'INSERT INTO password_history (user_id, password_hash, salt) VALUES (?, ?, ?)',
      [user.id, user.password_hash, user.salt]
    );

    // Update password and clear reset token
    await pool.query(
      'UPDATE users SET password_hash = ?, salt = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?',
      [hash, salt, user.id]
    );

    res.json({
      status: 'success',
      message: 'Password reset successful'
    });
  } catch (error) {
    next(error);
  }
};

// Logout (dummy, for JWT just remove token on client)
const logout = (req, res) => {
  res.json({ status: 'success', message: 'Logged out' });
};

module.exports = {
  register,
  login,
  changePassword,
  forgotPassword,
  resetPassword,
  logout,
  verifyResetToken
}; 