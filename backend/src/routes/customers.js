const express = require('express');
const { body } = require('express-validator');
const { validateRequest, sanitizeRequest } = require('../middleware/validation');
const { protect } = require('../middleware/auth');
const {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
} = require('../controllers/customers');

const router = express.Router();

// Protect all customer routes
router.use(protect);

// Get all customers
router.get('/', getAllCustomers);

// Get customer by ID
router.get('/:id', getCustomerById);

// Create new customer
router.post('/',
  [
    body('name')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    
    body('sector')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Sector must be between 2 and 50 characters'),
    
    body('contactEmail')
      .optional()
      .trim()
      .isEmail()
      .withMessage('Please enter a valid email address')
      .normalizeEmail(),
    
    body('contactPhone')
      .optional()
      .trim()
      .matches(/^\+?[\d\s-]{10,}$/)
      .withMessage('Please enter a valid phone number')
  ],
  sanitizeRequest,
  validateRequest,
  createCustomer
);

// Update customer
router.put('/:id',
  [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    
    body('sector')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Sector must be between 2 and 50 characters'),
    
    body('contactEmail')
      .optional()
      .trim()
      .isEmail()
      .withMessage('Please enter a valid email address')
      .normalizeEmail(),
    
    body('contactPhone')
      .optional()
      .trim()
      .matches(/^\+?[\d\s-]{10,}$/)
      .withMessage('Please enter a valid phone number')
  ],
  sanitizeRequest,
  validateRequest,
  updateCustomer
);

// Delete customer
router.delete('/:id', deleteCustomer);

module.exports = router; 