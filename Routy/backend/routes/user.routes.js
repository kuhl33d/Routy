import express from 'express';
import { userController } from '../controllers/userController.js';
import { auth } from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';
import { validate } from '../middleware/validate.js';
import { userValidation } from '../utils/validation.js';

const router = express.Router();

router.use(auth);

// Admin only routes
router.get('/', checkRole('admin'), userController.getAll);
router.post('/', checkRole('admin'), userValidation.createUser, validate, userController.create);

// Mixed access routes
router.get('/:id', userController.getById);
router.put('/:id', userValidation.updateUser, validate, userController.update);
router.delete('/:id', checkRole('admin'), userController.delete);

// User specific routes
router.get('/notifications', userController.getNotifications);
router.patch('/notifications/:notificationId', userController.markNotificationRead);
router.put('/preferences', userValidation.updatePreferences, validate, userController.updatePreferences);

export default router;