const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const { createLogger } = require('../utils/logger');

const logger = createLogger('auth-controller');

// Register a new user
async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const [existingUsers] = await pool.query(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert new user
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password_hash, salt) VALUES (?, ?, ?, ?)',
      [username, email, passwordHash, salt]
    );

    logger.info(`New user registered: ${username}`);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
}

// Login user
async function login(req, res) {
  try {
    const { username, password } = req.body;

    // Find user
    const [users] = await pool.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    logger.info(`User logged in: ${username}`);
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
}

// Logout user
function logout(req, res) {
  // Since we're using JWT, we don't need to do anything server-side
  // The client should remove the token
  res.json({ message: 'Logged out successfully' });
}

module.exports = {
  register,
  login,
  logout
}; 