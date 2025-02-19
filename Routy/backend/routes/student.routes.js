import express from 'express';
import { studentController } from '../controllers/studentController.js';
import { auth } from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';
import { validate } from '../middleware/validate.js';
import { studentValidation } from '../utils/validation.js';

const router = express.Router();

router.use(auth);

router.post('/', 
  checkRole('admin', 'school'), 
  studentValidation, 
  validate, 
  studentController.create
);

router.get('/', 
  checkRole('admin', 'school'), 
  studentController.getAll
);

router.get('/:id', studentController.getById);

router.put('/:id', 
  checkRole('admin', 'school'), 
  studentValidation, 
  validate, 
  studentController.update
);

router.delete('/:id', 
  checkRole('admin', 'school'), 
  studentController.delete
);

router.put('/:id/status',
  checkRole('driver'),
  studentController.updateStatus
);

router.get('/:id/attendance',
  studentController.getAttendance
);

export default router;