import express from 'express';
import authRoutes from './auth.routes.js';
import adminRoutes from './admin.routes.js';
import userRoutes from './user.routes.js';
import busRoutes from './bus.routes.js';
import driverRoutes from './driver.routes.js';
import routeRoutes from './route.routes.js';
import parentRoutes from './parent.routes.js';
import schoolRoutes from './school.routes.js';
import studentRoutes from './student.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/users', userRoutes);
router.use('/buses', busRoutes);
router.use('/drivers', driverRoutes);
router.use('/routes', routeRoutes);
router.use('/parents', parentRoutes);
router.use('/schools', schoolRoutes);
router.use('/students', studentRoutes);

export default router;