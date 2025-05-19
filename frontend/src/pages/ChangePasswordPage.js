import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Button, Alert, Box } from '@mui/material';
import FormField from '../components/common/FormField';
import { auth } from '../services/api';

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await auth.changePassword(formData);
      setSuccess('Password changed successfully');
      setFormData({ currentPassword: '', newPassword: '' });
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Failed to change password';
      setError(errorMessage);
      // Stay on the same page
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Change Password
        </Typography>

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

        <form onSubmit={handleSubmit}>
          <FormField
            name="currentPassword"
            label="Current Password"
            type="password"
            value={formData.currentPassword}
            onChange={handleChange}
            required
          />

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
            {loading ? 'Changing Password...' : 'Change Password'}
          </Button>

          <Button
            variant="text"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => navigate('/customers')}
          >
            Back to Customers
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default ChangePasswordPage; 