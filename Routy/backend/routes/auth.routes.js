import express from 'express';
import { authController } from '../controllers/authController.js';
import { auth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { authValidation } from '../utils/validations.js';

const router = express.Router();

router.post('/register', authValidation.register, validate, authController.register);
router.post('/login', authValidation.login, validate, authController.login);
router.get('/profile', auth, authController.getProfile);

export default router;