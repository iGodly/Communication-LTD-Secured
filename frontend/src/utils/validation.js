// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const validatePassword = (password) => {
  const errors = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Username validation
export const validateUsername = (username) => {
  const errors = [];

  if (username.length < 3) {
    errors.push('Username must be at least 3 characters long');
  }

  if (username.length > 50) {
    errors.push('Username must not exceed 50 characters');
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.push('Username can only contain letters, numbers, and underscores');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Customer name validation
export const validateCustomerName = (name) => {
  const errors = [];

  if (!name.trim()) {
    errors.push('Customer name is required');
  }

  if (name.length > 100) {
    errors.push('Customer name must not exceed 100 characters');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Sector validation
export const validateSector = (sector) => {
  const errors = [];

  if (!sector.trim()) {
    errors.push('Sector is required');
  }

  if (sector.length > 50) {
    errors.push('Sector must not exceed 50 characters');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}; 