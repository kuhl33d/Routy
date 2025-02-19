import express from 'express';
import { busController } from '../controllers/busController.js';
import { auth } from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';
import { validate } from '../middleware/validate.js';
import { busValidation } from '../utils/validations.js';

const router = express.Router();

router.use(auth);

router.post('/', 
  checkRole('admin'), 
  busValidation, 
  validate, 
  busController.create
);

router.get('/', busController.getAll);
router.get('/:id', busController.getById);

router.put('/:id', 
  checkRole('admin'), 
  busValidation, 
  validate, 
  busController.update
);

router.delete('/:id', 
  checkRole('admin'), 
  busController.delete
);

router.post('/:id/location',
  checkRole('driver'),
  busController.updateLocation
);

export default router;