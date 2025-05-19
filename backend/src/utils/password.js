const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const passwordConfig = require('../config/password');

// Load common passwords blacklist once at startup
const commonPasswordsPath = path.join(__dirname, 'common-passwords.txt');
let commonPasswords = [];
try {
  commonPasswords = fs.readFileSync(commonPasswordsPath, 'utf-8')
    .split('\n')
    .map(pw => pw.trim())
    .filter(Boolean);
} catch (err) {
  // If the file doesn't exist, just use an empty list
  commonPasswords = [];
}

class PasswordError extends Error {
  constructor(message) {
    super(message);
    this.name = 'PasswordError';
  }
}

function validatePassword(password) {
  // Check against common passwords
  if (commonPasswords.includes(password.toLowerCase())) {
    throw new PasswordError('Password is too common. Please choose a more secure password.');
  }
  // Check length
  if (password.length < passwordConfig.minLength) {
    throw new PasswordError(`Password must be at least ${passwordConfig.minLength} characters long`);
  }
  if (password.length > passwordConfig.maxLength) {
    throw new PasswordError(`Password must not exceed ${passwordConfig.maxLength} characters`);
  }

  // Check complexity
  if (passwordConfig.requireUppercase && !/[A-Z]/.test(password)) {
    throw new PasswordError('Password must contain at least one uppercase letter');
  }
  if (passwordConfig.requireLowercase && !/[a-z]/.test(password)) {
    throw new PasswordError('Password must contain at least one lowercase letter');
  }
  if (passwordConfig.requireNumbers && !/\d/.test(password)) {
    throw new PasswordError('Password must contain at least one number');
  }
  if (passwordConfig.requireSpecialChars) {
    // Escape regex meta-characters in specialChars
    const specialCharsEscaped = passwordConfig.specialChars.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const specialCharRegex = new RegExp(`[${specialCharsEscaped}]`);
    if (!specialCharRegex.test(password)) {
      throw new PasswordError('Password must contain at least one special character');
    }
  }

  return true;
}

async function hashPassword(password) {
  // Generate a random salt
  const salt = crypto.randomBytes(16).toString('hex');
  
  // Hash the password using HMAC with SHA-256
  const hmac = crypto.createHmac('sha256', salt);
  hmac.update(password);
  const hash = hmac.digest('hex');
  
  return { hash, salt };
}

async function verifyPassword(password, hash, salt) {
  const hmac = crypto.createHmac('sha256', salt);
  hmac.update(password);
  const computedHash = hmac.digest('hex');
  return computedHash === hash;
}

module.exports = {
  validatePassword,
  hashPassword,
  verifyPassword,
  PasswordError
}; 