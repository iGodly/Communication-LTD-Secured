const pool = require('../config/database');
const { ValidationError } = require('../utils/errors');

// Add new customer
const addCustomer = async (req, res, next) => {
  try {
    const { name, sector } = req.body;

    // Validate input
    if (!name || !sector) {
      throw new ValidationError('Name and sector are required');
    }

    // Insert customer
    const [result] = await pool.query(
      'INSERT INTO customers (name, sector) VALUES (?, ?)',
      [name, sector]
    );

    res.status(201).json({
      status: 'success',
      message: 'Customer added successfully',
      data: {
        customerId: result.insertId,
        name,
        sector
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get latest customer
const getLatestCustomer = async (req, res, next) => {
  try {
    const [customers] = await pool.query(
      'SELECT name FROM customers ORDER BY created_at DESC LIMIT 1'
    );

    if (customers.length === 0) {
      return res.json({
        status: 'success',
        data: null
      });
    }

    res.json({
      status: 'success',
      data: {
        name: customers[0].name
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addCustomer,
  getLatestCustomer
}; 