import React from 'react';
import { TextField } from '@mui/material';
import { sanitizeString } from '../../utils/sanitize';

const FormField = ({ 
  name, 
  label, 
  type = 'text', 
  value, 
  onChange, 
  error, 
  helperText,
  required = false,
  fullWidth = true,
  validate,
  ...props 
}) => {
  const handleChange = (e) => {
    const sanitizedValue = sanitizeString(e.target.value);
    e.target.value = sanitizedValue;
    onChange(e);
  };

  const handleBlur = (e) => {
    if (validate) {
      const validationResult = validate(e.target.value);
      if (!validationResult.isValid) {
        e.target.setCustomValidity(validationResult.errors[0]);
      } else {
        e.target.setCustomValidity('');
      }
    }
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <label htmlFor={name} style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
        {label}{required && ' *'}
      </label>
      <TextField
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!error}
        helperText={error || helperText}
        required={required}
        fullWidth={fullWidth}
        margin="normal"
        variant="outlined"
        inputProps={{
          'aria-label': label,
          'data-testid': `${name}-input`
        }}
        {...props}
      />
    </div>
  );
};

export default FormField; 