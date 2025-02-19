import { body } from 'express-validator';

export const authValidation = {
  register: [
    body('email')
      .isEmail()
      .withMessage('Invalid email address')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required'),
    body('role')
      .optional()
      .isIn(['admin', 'parent', 'driver', 'school'])
      .withMessage('Invalid role')
  ],
  login: [
    body('email')
      .isEmail()
      .withMessage('Invalid email address')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ]
};

export const busValidation = [
  body('busNumber')
    .trim()
    .notEmpty()
    .withMessage('Bus number is required'),
  body('capacity')
    .isInt({ min: 1 })
    .withMessage('Capacity must be a positive number'),
  body('driverId')
    .optional()
    .isMongoId()
    .withMessage('Invalid driver ID'),
  body('routeId')
    .optional()
    .isMongoId()
    .withMessage('Invalid route ID')
];

export const routeValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Route name is required'),
  body('startLocation')
    .isMongoId()
    .withMessage('Invalid start location ID'),
  body('endLocation')
    .isMongoId()
    .withMessage('Invalid end location ID'),
  body('stops')
    .isArray()
    .withMessage('Stops must be an array'),
  body('stops.*.address')
    .isMongoId()
    .withMessage('Invalid stop address ID'),
  body('stops.*.order')
    .isInt({ min: 0 })
    .withMessage('Stop order must be a non-negative integer')
];
