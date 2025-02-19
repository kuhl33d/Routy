import express from 'express';
import { auth } from '../middleware/auth.middleware.js';
import { adminOnly } from '../middleware/admin.middleware.js';
import { userController } from '../controllers/userController.js';
import { driverController } from '../controllers/driverController.js';
import { busController } from '../controllers/busController.js';
import { routeController } from '../controllers/routeController.js';

const router = express.Router();

// Auth routes
router.post('/auth/login', userController.login);

// Protected routes
router.use(auth);

// User routes (admin only)
router.get('/users', adminOnly, userController.getUsers);

// Driver routes
router.post('/drivers', adminOnly, driverController.create);
router.get('/drivers', driverController.getAll);
router.get('/drivers/:id', driverController.getById);
router.put('/drivers/:id', adminOnly, driverController.update);
router.delete('/drivers/:id', adminOnly, driverController.delete);

// Bus routes
router.post('/buses', adminOnly, busController.create);
router.get('/buses', busController.getAll);
router.get('/buses/:id', busController.getById);
router.put('/buses/:id', adminOnly, busController.update);
router.delete('/buses/:id', adminOnly, busController.delete);

// Route routes
router.post('/routes', adminOnly, routeController.create);
router.get('/routes', routeController.getAll);
router.get('/routes/:id', routeController.getById);
router.put('/routes/:id', adminOnly, routeController.update);
router.delete('/routes/:id', adminOnly, routeController.delete);

export default router;