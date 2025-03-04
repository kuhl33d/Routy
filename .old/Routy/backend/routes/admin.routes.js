import express from 'express';
import { adminController } from '../controllers/adminController.js';
import { auth } from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';

const router = express.Router();

router.use(auth);
router.use(checkRole('admin'));

router.get('/dashboard', adminController.getDashboardStats);
router.get('/overview', adminController.getSystemOverview);
router.get('/users', adminController.manageUsers);
router.patch('/users/:userId/status', adminController.updateUserStatus);
router.get('/logs', adminController.getSystemLogs);
router.get('/analytics', adminController.getAnalytics);

export default router;