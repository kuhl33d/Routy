import Route from '../models/route.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { geocodeAddress } from '../utils/geocoding.js';

export const routeController = {
  create: asyncHandler(async (req, res) => {
    const route = new Route(req.body);
    await route.save();
    res.status(201).json(route);
  }),

  getAll: asyncHandler(async (req, res) => {
    const routes = await Route.find()
      .populate('startLocation')
      .populate('endLocation')
      .populate('stops.address')
      .populate('busses', 'busNumber')
      .sort('-createdAt');
    res.json(routes);
  }),

  getById: asyncHandler(async (req, res) => {
    const route = await Route.findById(req.params.id)
      .populate('startLocation')
      .populate('endLocation')
      .populate('stops.address')
      .populate('busses', 'busNumber');

    if (!route) {
      const error = new Error('Route not found');
      error.status = 404;
      throw error;
    }

    res.json(route);
  }),

  update: asyncHandler(async (req, res) => {
    const route = await Route.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!route) {
      const error = new Error('Route not found');
      error.status = 404;
      throw error;
    }

    res.json(route);
  }),

  delete: asyncHandler(async (req, res) => {
    const route = await Route.findByIdAndDelete(req.params.id);
    
    if (!route) {
      const error = new Error('Route not found');
      error.status = 404;
      throw error;
    }

    res.json({ message: 'Route deleted successfully' });
  }),

  optimizeRoute: asyncHandler(async (req, res) => {
    const route = await Route.findById(req.params.id);
    if (!route) {
      const error = new Error('Route not found');
      error.status = 404;
      throw error;
    }

    // Implement route optimization logic here
    // This could include calculating the most efficient order of stops
    
    res.json(route);
  })
};