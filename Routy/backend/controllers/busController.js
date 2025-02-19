import  Bus  from '../models/bus.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const busController = {
  create: asyncHandler(async (req, res) => {
    const bus = new Bus(req.body);
    await bus.save();
    res.status(201).json(bus);
  }),

  getAll: asyncHandler(async (req, res) => {
    const buses = await Bus.find()
      .populate('driverId', 'name')
      .populate('routeId', 'name')
      .sort('-createdAt');
    res.json(buses);
  }),

  getById: asyncHandler(async (req, res) => {
    const bus = await Bus.findById(req.params.id)
      .populate('driverId', 'name')
      .populate('routeId', 'name')
      .populate('studentsOnBoard.studentId', 'name');

    if (!bus) {
      const error = new Error('Bus not found');
      error.status = 404;
      throw error;
    }

    res.json(bus);
  }),

  update: asyncHandler(async (req, res) => {
    const bus = await Bus.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!bus) {
      const error = new Error('Bus not found');
      error.status = 404;
      throw error;
    }

    res.json(bus);
  }),

  delete: asyncHandler(async (req, res) => {
    const bus = await Bus.findByIdAndDelete(req.params.id);
    
    if (!bus) {
      const error = new Error('Bus not found');
      error.status = 404;
      throw error;
    }

    res.json({ message: 'Bus deleted successfully' });
  }),

  updateLocation: asyncHandler(async (req, res) => {
    const { latitude, longitude } = req.body;
    
    const bus = await Bus.findByIdAndUpdate(
      req.params.id,
      { 
        currentLocation: { latitude, longitude },
        lastLocationUpdate: Date.now()
      },
      { new: true }
    );

    if (!bus) {
      const error = new Error('Bus not found');
      error.status = 404;
      throw error;
    }

    res.json(bus);
  })
};