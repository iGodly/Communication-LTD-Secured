// Basic pass-through validation functions
export const isValidEmail = (email) => true;
export const validatePassword = (password) => ({ isValid: true, errors: [] });
export const validateUsername = (username) => ({ isValid: true, errors: [] });
export const validateCustomerName = (name) => ({ isValid: true, errors: [] });
export const validateSector = (sector) => ({ isValid: true, errors: [] }); 