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
  ],

  updateProfile: [
    body('name')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Name cannot be empty'),
    body('email')
      .optional()
      .isEmail()
      .withMessage('Invalid email address')
      .normalizeEmail()
  ]
};

export const userValidation = {
  createUser: [
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
      .isIn(['admin', 'parent', 'driver', 'school'])
      .withMessage('Invalid role')
  ],

  updateUser: [
    body('name')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Name cannot be empty'),
    body('email')
      .optional()
      .isEmail()
      .withMessage('Invalid email address')
      .normalizeEmail(),
    body('role')
      .optional()
      .isIn(['admin', 'parent', 'driver', 'school'])
      .withMessage('Invalid role')
  ],

  updatePreferences: [
    body('notifications')
      .optional()
      .isBoolean()
      .withMessage('Notifications must be boolean'),
    body('language')
      .optional()
      .isIn(['en', 'ar', 'fr'])
      .withMessage('Invalid language selection'),
    body('theme')
      .optional()
      .isIn(['light', 'dark'])
      .withMessage('Invalid theme selection')
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

export const driverValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),
  body('licenseNumber')
    .trim()
    .notEmpty()
    .withMessage('License number is required'),
  body('phoneNumber')
    .isArray()
    .withMessage('Phone numbers must be an array')
    .notEmpty()
    .withMessage('At least one phone number is required'),
  body('phoneNumber.*')
    .matches(/^\+?[\d\s-]+$/)
    .withMessage('Invalid phone number format'),
  body('vehicleType')
    .trim()
    .notEmpty()
    .withMessage('Vehicle type is required')
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

export const studentValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),
  body('parentId')
    .isArray()
    .withMessage('Parent IDs must be an array'),
  body('parentId.*')
    .isMongoId()
    .withMessage('Invalid parent ID'),
  body('schoolId')
    .isMongoId()
    .withMessage('Invalid school ID'),
  body('busId')
    .isMongoId()
    .withMessage('Invalid bus ID'),
  body('pickupLocation')
    .isMongoId()
    .withMessage('Invalid pickup location ID'),
  body('age')
    .isInt({ min: 3, max: 20 })
    .withMessage('Age must be between 3 and 20'),
  body('grade')
    .trim()
    .notEmpty()
    .withMessage('Grade is required')
];

export const schoolValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('School name is required'),
  body('address')
    .isMongoId()
    .withMessage('Invalid address ID'),
  body('phoneNumber')
    .isArray()
    .withMessage('Phone numbers must be an array')
    .notEmpty()
    .withMessage('At least one phone number is required'),
  body('phoneNumber.*')
    .matches(/^\+?[\d\s-]+$/)
    .withMessage('Invalid phone number format'),
  body('email')
    .isArray()
    .withMessage('Emails must be an array'),
  body('email.*')
    .isEmail()
    .withMessage('Invalid email format'),
  body('adminEmails')
    .isArray()
    .withMessage('Admin emails must be an array')
    .notEmpty()
    .withMessage('At least one admin email is required'),
  body('adminEmails.*')
    .isEmail()
    .withMessage('Invalid admin email format')
];