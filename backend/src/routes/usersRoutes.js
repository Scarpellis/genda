const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const { createUser, getUsers, updateUser } = require('../controllers/usersController');
const authMiddleware = require('../middleware/authMiddleware');

const validateUser = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').notEmpty().withMessage('Phone is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateUpdateUser = [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('phone').optional().notEmpty().withMessage('Phone cannot be empty'),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

router.post('/', validateUser, createUser);
router.get('/', authMiddleware, getUsers);
router.put('/:email', authMiddleware, validateUpdateUser, updateUser);

module.exports = router;
