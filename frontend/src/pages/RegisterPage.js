import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Button, Box, Alert } from '@mui/material';
import FormField from '../components/common/FormField';
import { auth } from '../services/api';

const passwordRules = [
  'At least 10 characters long',
  'Contains at least one uppercase letter',
  'Contains at least one lowercase letter',
  'Contains at least one number',
  'Contains at least one special character'
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await auth.register(formData);
      navigate('/login', { state: { message: 'Registration successful! Please login.' } });
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Registration failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Register
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <FormField
            name="username"
            label="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <FormField
            name="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <FormField
            name="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Box sx={{ mt: 2, mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Password Requirements:
            </Typography>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              {passwordRules.map((rule, index) => (
                <li key={index}>
                  <Typography variant="body2" color="text.secondary">
                    {rule}
                  </Typography>
                </li>
              ))}
            </ul>
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>

          <Button
            variant="text"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => navigate('/login')}
          >
            Already have an account? Login
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default RegisterPage; 