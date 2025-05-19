// Security configuration
export const securityConfig = {
  // Password rules
  password: {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    // Common passwords to prevent
    blockedPasswords: [
      'password123',
      'admin123',
      'qwerty123',
      '12345678',
      'welcome123'
    ]
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
  },

  // Headers
  headers: {
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
  }
}; 