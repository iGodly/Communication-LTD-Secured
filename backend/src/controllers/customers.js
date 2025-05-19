const pool = require('../config/database');
const { createLogger } = require('../utils/logger');
const { NotFoundError } = require('../utils/errors');

const logger = createLogger('customer-controller');

// Get all customers
async function getAllCustomers(req, res) {
  try {
    const [customers] = await pool.query(
      'SELECT * FROM customers ORDER BY created_at DESC'
    );
    
    res.json(customers);
  } catch (error) {
    logger.error('Error fetching customers:', error);
    res.status(500).json({ message: 'Error fetching customers' });
  }
}

// Get customer by ID
async function getCustomerById(req, res) {
  try {
    const [customers] = await pool.query(
      'SELECT * FROM customers WHERE id = ?',
      [req.params.id]
    );

    if (customers.length === 0) {
      throw new NotFoundError('Customer not found');
    }

    res.json(customers[0]);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ message: error.message });
    } else {
      logger.error('Error fetching customer:', error);
      res.status(500).json({ message: 'Error fetching customer' });
    }
  }
}

// Create new customer
async function createCustomer(req, res) {
  try {
    const { name, sector, contactEmail, contactPhone } = req.body;

    const [result] = await pool.query(
      'INSERT INTO customers (name, sector, contact_email, contact_phone) VALUES (?, ?, ?, ?)',
      [name, sector, contactEmail, contactPhone]
    );

    const [newCustomer] = await pool.query(
      'SELECT * FROM customers WHERE id = ?',
      [result.insertId]
    );

    logger.info(`New customer created: ${name}`);
    res.status(201).json(newCustomer[0]);
  } catch (error) {
    logger.error('Error creating customer:', error);
    res.status(500).json({ message: 'Error creating customer' });
  }
}

// Update customer
async function updateCustomer(req, res) {
  try {
    const { name, sector, contactEmail, contactPhone } = req.body;
    const customerId = req.params.id;

    // Check if customer exists
    const [existingCustomers] = await pool.query(
      'SELECT * FROM customers WHERE id = ?',
      [customerId]
    );

    if (existingCustomers.length === 0) {
      throw new NotFoundError('Customer not found');
    }

    // Update customer
    await pool.query(
      `UPDATE customers 
       SET name = COALESCE(?, name),
           sector = COALESCE(?, sector),
           contact_email = COALESCE(?, contact_email),
           contact_phone = COALESCE(?, contact_phone)
       WHERE id = ?`,
      [name, sector, contactEmail, contactPhone, customerId]
    );

    // Get updated customer
    const [updatedCustomer] = await pool.query(
      'SELECT * FROM customers WHERE id = ?',
      [customerId]
    );

    logger.info(`Customer updated: ${updatedCustomer[0].name}`);
    res.json(updatedCustomer[0]);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ message: error.message });
    } else {
      logger.error('Error updating customer:', error);
      res.status(500).json({ message: 'Error updating customer' });
    }
  }
}

// Delete customer
async function deleteCustomer(req, res) {
  try {
    const customerId = req.params.id;

    // Check if customer exists
    const [existingCustomers] = await pool.query(
      'SELECT * FROM customers WHERE id = ?',
      [customerId]
    );

    if (existingCustomers.length === 0) {
      throw new NotFoundError('Customer not found');
    }

    // Delete customer
    await pool.query('DELETE FROM customers WHERE id = ?', [customerId]);

    logger.info(`Customer deleted: ${existingCustomers[0].name}`);
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ message: error.message });
    } else {
      logger.error('Error deleting customer:', error);
      res.status(500).json({ message: 'Error deleting customer' });
    }
  }
}

module.exports = {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
}; 