import express from 'express';
import { parentController } from '../controllers/parentController.js';
import { auth } from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';
import { validate } from '../middleware/validate.js';
import { parentValidation } from '../utils/validation.js';

const router = express.Router();

router.use(auth);

// Use parentValidation.create instead of parentValidation
router.post('/', 
  checkRole('admin'), 
  parentValidation.create,  // Changed this line
  validate, 
  parentController.create
);

router.get('/', 
  checkRole('admin', 'school'), 
  parentController.getAll
);

router.get('/:id', 
  parentController.getById
);

// Use parentValidation.update instead of parentValidation
router.put('/:id', 
  checkRole('admin'), 
  parentValidation.update,  // Changed this line
  validate, 
  parentController.update
);

router.delete('/:id', 
  checkRole('admin'), 
  parentController.delete
);

router.get('/:id/children-location',
  parentController.getChildrenLocation
);

// Add routes for other parent-specific operations
router.post('/:id/add-child',
  checkRole('admin'),
  parentValidation.addChild,
  validate,
  parentController.addChild
);

router.delete('/:id/remove-child',
  checkRole('admin'),
  parentValidation.removeChild,
  validate,
  parentController.removeChild
);

router.put('/:id/notification-preferences',
  parentValidation.updateNotificationPreferences,
  validate,
  parentController.updateNotificationPreferences
);

router.put('/:id/emergency-contacts',
  parentValidation.updateEmergencyContacts,
  validate,
  parentController.updateEmergencyContacts
);

router.put('/:id/pickup-preferences',
  parentValidation.updatePickupPreferences,
  validate,
  parentController.updatePickupPreferences
);

router.put('/:id/address',
  parentValidation.updateAddress,
  validate,
  parentController.updateAddress
);

export default router;