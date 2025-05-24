// Simple pass-through functions
export const sanitizeString = (str) => str;
export const sanitizeObject = (obj) => obj;
export const sanitizeFormData = (formData) => {
  const result = {};
  for (const [key, value] of formData.entries()) {
    result[key] = value;
  }
  return result;
}; 