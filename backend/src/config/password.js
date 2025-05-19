module.exports = {
  // min & max password length
  minLength: 10,
  maxLength: 15,

  // Password req's
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  specialChars: '!@#$%^&*()_+-=[]{}|;:,.<>?',

  // Password history
  passwordHistoryCount: 3,

  // Login attempts
  maxLoginAttempts: 3,
  lockoutDuration: 15 * 60 * 1000, // 15 minutes user locked out

  // The password will expire in within the below days
  passwordExpiryDays: 90
}; 