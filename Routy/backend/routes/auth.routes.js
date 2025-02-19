// routes/auth.routes.js
import express from 'express';
import { authController } from '../controllers/authController.js';
import { auth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { authValidation } from '../utils/validation.js';

const router = express.Router();

router.post('/register', authValidation.register, validate, authController.register);
router.post('/login', authValidation.login, validate, authController.login);
router.get('/profile', auth, authController.getProfile);

// Protected routes
router.use(auth);
router.get('/profile', authController.getProfile);
router.put('/profile', authValidation.updateProfile, validate, authController.updateProfile);
router.put('/change-password', authValidation.changePassword, validate, authController.changePassword);
router.post('/logout', authController.logout);

export default router;
