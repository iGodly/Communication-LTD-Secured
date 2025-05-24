import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Paper, Typography, Button, Alert, Box } from '@mui/material';
import FormField from '../components/common/FormField';
import { auth } from '../services/api';
import { loginRateLimiter } from '../utils/rateLimit';
import { sanitizeObject } from '../utils/sanitize';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    login: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState(3);
  const [blockedUntil, setBlockedUntil] = useState(null);

  useEffect(() => {
    const loginValue = formData.login;
    if (loginValue) {
      setRemainingAttempts(loginRateLimiter.getRemainingAttempts(loginValue));
      setBlockedUntil(loginRateLimiter.getBlockedUntil(loginValue));
    }
  }, [formData.login]);

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

    const sanitizedData = sanitizeObject(formData);

    if (loginRateLimiter.isBlocked(sanitizedData.login)) {
      setError(`Too many login attempts. Please try again after 15 minutes`);
      setLoading(false);
      return;
    }

    try {
      const response = await auth.login(sanitizedData);
      loginRateLimiter.resetAttempts(sanitizedData.login);
      localStorage.setItem('token', response.data.data.token);
      navigate('/customers');
    } catch (err) {
      loginRateLimiter.recordAttempt(sanitizedData.login);
      setRemainingAttempts(loginRateLimiter.getRemainingAttempts(sanitizedData.login));
      setBlockedUntil(loginRateLimiter.getBlockedUntil(sanitizedData.login));
      if (loginRateLimiter.isBlocked(sanitizedData.login)) {
        setError(`Too many login attempts. Please try again after 15 minutes`);
      } else {
        setError('Email/username or password is incorrect');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Login
        </Typography>

        {location.state?.message && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {location.state.message}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {remainingAttempts < 3 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {remainingAttempts} login attempts remaining
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <FormField
            name="login"
            label="Email or Username"
            type="text"
            value={formData.login}
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

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading || !!blockedUntil}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>

          <Button
            variant="text"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => navigate('/register')}
          >
            Don't have an account? Register
          </Button>

          <Button
            variant="text"
            fullWidth
            onClick={() => navigate('/forgot-password')}
          >
            Forgot Password?
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default LoginPage; 