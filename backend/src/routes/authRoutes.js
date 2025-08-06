const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const { loginUser } = require('../controllers/authController');

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

router.post('/login', validateLogin, loginUser);

module.exports = router;

