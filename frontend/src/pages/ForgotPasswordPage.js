import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Button, Alert, Stepper, Step, StepLabel, Box } from '@mui/material';
import FormField from '../components/common/FormField';
import { auth } from '../services/api';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    token: '',
    newPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordRules = [
    'At least 10 characters long',
    'Contains at least one uppercase letter',
    'Contains at least one lowercase letter',
    'Contains at least one number',
    'Contains at least one special character'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const extractErrorMessage = (err, fallback = 'An error occurred') => {
    if (!err) return fallback;
    if (typeof err === 'string') return err;
    if (err.response?.data?.message) return err.response.data.message;
    if (err.response?.data?.error) return err.response.data.error;
    if (err.message) return err.message;
    try {
      return JSON.stringify(err);
    } catch {
      return fallback;
    }
  };

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await auth.forgotPassword({ email: formData.email });
      setSuccess('If the email exists, a token has been sent');
      setActiveStep(1);
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to send reset token'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyToken = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Verify token validity without changing password yet
      await auth.verifyResetToken({ token: formData.token });
      setSuccess('Token verified successfully');
      setActiveStep(2);
    } catch (err) {
      setError(extractErrorMessage(err, 'Invalid or expired token'));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await auth.resetPassword({
        token: formData.token,
        newPassword: formData.newPassword
      });
      setSuccess('Password has been reset successfully');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to reset password'));
    } finally {
      setLoading(false);
    }
  };

  const steps = ['Request Reset Token', 'Verify Token', 'Reset Password'];

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <form onSubmit={handleRequestReset}>
            <FormField
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Token'}
            </Button>
          </form>
        );

      case 1:
        return (
          <form onSubmit={handleVerifyToken}>
            <FormField
              name="token"
              label="Reset Token"
              value={formData.token}
              onChange={handleChange}
              required
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify Token'}
            </Button>
          </form>
        );

      case 2:
        return (
          <form onSubmit={handleResetPassword}>
            <FormField
              name="newPassword"
              label="New Password"
              type="password"
              value={formData.newPassword}
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
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Forgot Password
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {renderStep()}

        <Button
          variant="text"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => navigate('/login')}
        >
          Back to Login
        </Button>
      </Paper>
    </Container>
  );
};

export default ForgotPasswordPage; 