const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const {
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment,
} = require('../controllers/appointmentsController');

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

const validateAppointment = [
  body('date').notEmpty().withMessage('Date is required'),
  body('time').notEmpty().withMessage('Time is required'),
  body('service').notEmpty().withMessage('Service is required'),
  body('client').notEmpty().withMessage('Client is required'),
  body('status')
    .optional()
    .isIn(['pending', 'confirmed', 'cancelled'])
    .withMessage('Invalid status'),
  handleValidationErrors,
];

const validateUpdateAppointment = [
  body('date').optional().notEmpty().withMessage('Date cannot be empty'),
  body('time').optional().notEmpty().withMessage('Time cannot be empty'),
  body('service').optional().notEmpty().withMessage('Service cannot be empty'),
  body('client').optional().notEmpty().withMessage('Client cannot be empty'),
  body('status')
    .optional()
    .isIn(['pending', 'confirmed', 'cancelled'])
    .withMessage('Invalid status'),
  handleValidationErrors,
];

router.get('/', getAppointments);
router.post('/', validateAppointment, createAppointment);
router.put('/:id', validateUpdateAppointment, updateAppointment);
router.delete('/:id', deleteAppointment);

module.exports = router;
