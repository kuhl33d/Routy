import express from 'express';
import { schoolController } from '../controllers/schoolController.js';
import { auth } from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';
import { validate } from '../middleware/validate.js';
import { schoolValidation } from '../utils/validations.js';

const router = express.Router();

router.use(auth);

router.post('/', 
  checkRole('admin'), 
  schoolValidation, 
  validate, 
  schoolController.create
);

router.get('/', 
  checkRole('admin'), 
  schoolController.getAll
);

router.get('/:id', 
  checkRole('admin', 'school'), 
  schoolController.getById
);

router.put('/:id', 
  checkRole('admin'), 
  schoolValidation, 
  validate, 
  schoolController.update
);

router.delete('/:id', 
  checkRole('admin'), 
  schoolController.delete
);

router.get('/:id/dashboard', 
  checkRole('admin', 'school'), 
  schoolController.getDashboardStats
);

export default router;