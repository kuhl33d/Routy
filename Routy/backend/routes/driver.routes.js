import express from 'express';
import { driverController } from '../controllers/driverController.js';
import { auth } from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';
import { validate } from '../middleware/validate.js';
import { driverValidation } from '../utils/validations.js';

const router = express.Router();

router.use(auth);

router.post('/', 
  checkRole('admin'), 
  driverValidation, 
  validate, 
  driverController.create
);

router.get('/', 
  checkRole('admin', 'school'), 
  driverController.getAll
);

router.get('/:id', 
  checkRole('admin', 'school', 'driver'), 
  driverController.getById
);

router.put('/:id', 
  checkRole('admin'), 
  driverValidation, 
  validate, 
  driverController.update
);

router.delete('/:id', 
  checkRole('admin'), 
  driverController.delete
);

router.get('/:id/current-route', 
  checkRole('admin', 'school', 'driver'), 
  driverController.getCurrentRoute
);

router.post('/:id/start-route', 
  checkRole('driver'), 
  driverController.startRoute
);

router.post('/:id/end-route', 
  checkRole('driver'), 
  driverController.endRoute
);

router.post('/:id/update-location', 
  checkRole('driver'), 
  driverController.updateLocation
);

router.get('/:id/students', 
  checkRole('driver'), 
  driverController.getAssignedStudents
);

export default router;