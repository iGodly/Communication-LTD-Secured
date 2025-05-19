import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Button, Alert, Box } from '@mui/material';
import FormField from '../components/common/FormField';
import { customers } from '../services/api';

const CustomerManagementPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    sector: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
    setSuccess('');
    setLoading(true);

    try {
      await customers.add(formData);
      setSuccess(`New customer added: ${formData.name}`);
      setFormData({ name: '', sector: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add customer');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Customer Management
          </Typography>
          <Button variant="outlined" onClick={handleLogout}>
            Logout
          </Button>
        </Box>

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
            name="name"
            label="Customer Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <FormField
            name="sector"
            label="Sector"
            value={formData.sector}
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
            {loading ? 'Adding Customer...' : 'Add Customer'}
          </Button>

          <Button
            variant="text"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => navigate('/change-password')}
          >
            Change Password
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default CustomerManagementPage; 