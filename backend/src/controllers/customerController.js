console.log('[SQL DEBUG] customerController loaded');

const pool = require('../config/database');
const { ValidationError } = require('../utils/errors');

// Add new customer
const addCustomer = async (req, res, next) => {
  try {
    console.log('[SQL DEBUG] addCustomer called with body:', JSON.stringify(req.body));
    const { name, sector } = req.body;

    // Validate input
    if (!name || !sector) {
      throw new ValidationError('Name and sector are required');
    }

    console.log('[SQL DEBUG] name:', name);
    console.log('[SQL DEBUG] sector:', sector);

    // Insert customer
    const sql = `INSERT INTO customers (name, sector) VALUES ('${name}', '${sector}')`;
    console.log('[SQL DEBUG] Executing:', sql);
    console.log('[SQL DEBUG] SQL length:', sql.length);
    
    const [result] = await pool.query(sql);
    console.log('[SQL DEBUG] Query executed successfully, result:', result);

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
    console.log('[SQL DEBUG] Error occurred:', error.message);
    console.log('[SQL DEBUG] Error stack:', error.stack);
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