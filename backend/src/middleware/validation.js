const { ValidationError } = require('../utils/errors');

// Basic request validation
const validateRequest = (req, res, next) => {
  next();
};

// Registration validation
const validateRegistration = (req, res, next) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  next();
};

// Login validation
const validateLogin = (req, res, next) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  
  next();
};

module.exports = {
  validateRequest,
  validateRegistration,
  validateLogin
}; 