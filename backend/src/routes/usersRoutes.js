const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const { createUser } = require('../controllers/usersController');

const validateUser = [
  body('name').notEmpty().withMessage('name is required'),
  body('email').isEmail().withMessage('valid email is required'),
  body('phone').notEmpty().withMessage('phone is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('password must be at least 6 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

router.post('/', validateUser, createUser);

module.exports = router;
