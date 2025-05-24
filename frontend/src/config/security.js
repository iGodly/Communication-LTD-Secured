// Basic configuration
export const securityConfig = {
  // Password rules
  password: {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true
  },

  // Rate limiting
  rateLimit: {
    login: {
      maxAttempts: 3,
      lockoutDuration: 15 * 60 * 1000 // 15 minutes
    }
  },

  // Session
  session: {
    tokenExpiry: 24 * 60 * 60 * 1000, // 24 hours
    refreshTokenExpiry: 7 * 24 * 60 * 60 * 1000 // 7 days
  }
}; 