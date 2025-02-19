import express from 'express';
import { parentController } from '../controllers/parentController.js';
import { auth } from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';
import { validate } from '../middleware/validate.js';
import { parentValidation } from '../utils/validation.js';

const router = express.Router();

router.use(auth);

router.post('/', 
  checkRole('admin'), 
  parentValidation, 
  validate, 
  parentController.create
);

router.get('/', 
  checkRole('admin', 'school'), 
  parentController.getAll
);

router.get('/:id', parentController.getById);

router.put('/:id', 
  checkRole('admin'), 
  parentValidation, 
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

export default router;