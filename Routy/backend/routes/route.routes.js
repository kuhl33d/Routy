import express from 'express';
import { routeController } from '../controllers/routeController.js';
import { auth } from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';
import { validate } from '../middleware/validate.js';
import { routeValidation } from '../utils/validations.js';

const router = express.Router();

router.use(auth);

router.post('/', 
  checkRole('admin'), 
  routeValidation, 
  validate, 
  routeController.create
);

router.get('/', routeController.getAll);
router.get('/:id', routeController.getById);

router.put('/:id', 
  checkRole('admin'), 
  routeValidation, 
  validate, 
  routeController.update
);

router.delete('/:id', 
  checkRole('admin'), 
  routeController.delete
);

router.post('/:id/optimize',
  checkRole('admin'),
  routeController.optimizeRoute
);

export default router;