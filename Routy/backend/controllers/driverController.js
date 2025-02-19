import Driver from '../models/driver.model.js';
import Bus  from '../models/bus.model.js';
import Route from '../models/route.model.js';
import Student from '../models/student.model.js';
import  User  from '../models/user.model.js';
import { createNotification } from '../utils/notifications.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendToUser } from '../utils/websocket.js';

export const driverController = {
  create: asyncHandler(async (req, res) => {
    const { 
      name, 
      email, 
      password, 
      licenseNumber, 
      phoneNumber, 
      vehicleType 
    } = req.body;

    
    const user = new User({
      email,
      password,
      name,
      role: 'driver'
    });
    await user.save();

    
    const driver = new Driver({
      userId: user._id,
      name,
      licenseNumber,
      phoneNumber,
      vehicleType,
      isActive: true
    });
    await driver.save();

    res.status(201).json({
      driver,
      message: 'Driver created successfully'
    });
  }),

  getAll: asyncHandler(async (req, res) => {
    const drivers = await Driver.find()
      .populate('busId', 'busNumber')
      .populate('userId', 'email')
      .sort('-createdAt');
    res.json(drivers);
  }),

  getById: asyncHandler(async (req, res) => {
    const driver = await Driver.findById(req.params.id)
      .populate('busId', 'busNumber status currentLocation')
      .populate('userId', 'email');

    if (!driver) {
      const error = new Error('Driver not found');
      error.status = 404;
      throw error;
    }

    res.json(driver);
  }),

  update: asyncHandler(async (req, res) => {
    const { name, licenseNumber, phoneNumber, vehicleType, isActive } = req.body;

    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      {
        name,
        licenseNumber,
        phoneNumber,
        vehicleType,
        isActive
      },
      { new: true, runValidators: true }
    );

    if (!driver) {
      const error = new Error('Driver not found');
      error.status = 404;
      throw error;
    }

    res.json(driver);
  }),

  delete: asyncHandler(async (req, res) => {
    const driver = await Driver.findById(req.params.id);
    
    if (!driver) {
      const error = new Error('Driver not found');
      error.status = 404;
      throw error;
    }

    
    if (driver.busId) {
      await Bus.findByIdAndUpdate(driver.busId, { driverId: null });
    }

    
    await User.findByIdAndDelete(driver.userId);

    
    await driver.delete();

    res.json({ message: 'Driver deleted successfully' });
  }),

  getCurrentRoute: asyncHandler(async (req, res) => {
    const driver = await Driver.findById(req.params.id)
      .populate('busId');

    if (!driver) {
      const error = new Error('Driver not found');
      error.status = 404;
      throw error;
    }

    if (!driver.busId) {
      return res.json({ message: 'No bus assigned to driver' });
    }

    const route = await Route.findById(driver.busId.routeId)
      .populate('startLocation')
      .populate('endLocation')
      .populate('stops.address');

    res.json(route);
  }),

  startRoute: asyncHandler(async (req, res) => {
    const driver = await Driver.findById(req.params.id)
      .populate('busId');

    if (!driver) {
      const error = new Error('Driver not found');
      error.status = 404;
      throw error;
    }

    if (!driver.busId) {
      const error = new Error('No bus assigned to driver');
      error.status = 400;
      throw error;
    }

    
    const bus = await Bus.findByIdAndUpdate(
      driver.busId._id,
      { 
        status: 'On Route',
        currentPassengers: 0,
        studentsOnBoard: []
      },
      { new: true }
    );

    
    const students = await Student.find({ busId: bus._id })
      .populate('parentId');

    for (const student of students) {
      for (const parentId of student.parentId) {
        await createNotification(
          parentId,
          `Bus ${bus.busNumber} has started its route`
        );
      }
    }

    res.json({ 
      message: 'Route started successfully',
      bus
    });
  }),

  endRoute: asyncHandler(async (req, res) => {
    const driver = await Driver.findById(req.params.id)
      .populate('busId');

    if (!driver) {
      const error = new Error('Driver not found');
      error.status = 404;
      throw error;
    }

    if (!driver.busId) {
      const error = new Error('No bus assigned to driver');
      error.status = 400;
      throw error;
    }

    
    const bus = await Bus.findByIdAndUpdate(
      driver.busId._id,
      { 
        status: 'Idle',
        currentPassengers: 0,
        studentsOnBoard: []
      },
      { new: true }
    );

    
    const students = await Student.find({ busId: bus._id })
      .populate('parentId');

    for (const student of students) {
      for (const parentId of student.parentId) {
        await createNotification(
          parentId,
          `Bus ${bus.busNumber} has completed its route`
        );
      }
    }

    res.json({ 
      message: 'Route ended successfully',
      bus
    });
  }),

  updateLocation: asyncHandler(async (req, res) => {
    const { latitude, longitude } = req.body;
    
    const driver = await Driver.findById(req.params.id)
      .populate('busId');

    if (!driver) {
      const error = new Error('Driver not found');
      error.status = 404;
      throw error;
    }

    if (!driver.busId) {
      const error = new Error('No bus assigned to driver');
      error.status = 400;
      throw error;
    }

    
    const bus = await Bus.findByIdAndUpdate(
      driver.busId._id,
      { 
        currentLocation: { latitude, longitude },
        lastLocationUpdate: Date.now()
      },
      { new: true }
    );

    
    const students = await Student.find({ busId: bus._id })
      .populate('parentId');

    for (const student of students) {
      for (const parentId of student.parentId) {
        sendToUser(parentId, {
          type: 'location_update',
          data: {
            busId: bus._id,
            busNumber: bus.busNumber,
            location: bus.currentLocation,
            studentId: student._id
          }
        });
      }
    }

    res.json({ 
      message: 'Location updated successfully',
      location: bus.currentLocation
    });
  }),

  getAssignedStudents: asyncHandler(async (req, res) => {
    const driver = await Driver.findById(req.params.id)
      .populate('busId');

    if (!driver) {
      const error = new Error('Driver not found');
      error.status = 404;
      throw error;
    }

    if (!driver.busId) {
      return res.json({ students: [] });
    }

    const students = await Student.find({ busId: driver.busId._id })
      .populate('parentId', 'name phoneNumber')
      .populate('pickupLocation')
      .sort('pickupLocation.order');

    res.json(students);
  })
};
