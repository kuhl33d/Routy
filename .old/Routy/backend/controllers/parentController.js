import  Parent  from '../models/parent.model.js';
import  User  from '../models/user.model.js';

import { asyncHandler } from '../utils/asyncHandler.js';
import { createNotification } from '../utils/notifications.js';

export const parentController = {
  create: asyncHandler(async (req, res) => {
    const { name, email, password, phone, address, children } = req.body;

    
    const user = new User({
      email,
      password,
      name,
      role: 'parent'
    });
    await user.save();

    
    const parent = new Parent({
      userId: user._id,
      name,
      phone,
      address,
      children: children || []
    });
    await parent.save();

    res.status(201).json(parent);
  }),

  getAll: asyncHandler(async (req, res) => {
    const parents = await Parent.find()
      .populate('children', 'name')
      .populate('address')
      .sort('-createdAt');
    res.json(parents);
  }),

  getById: asyncHandler(async (req, res) => {
    const parent = await Parent.findById(req.params.id)
      .populate('children', 'name status')
      .populate('address');

    if (!parent) {
      const error = new Error('Parent not found');
      error.status = 404;
      throw error;
    }

    res.json(parent);
  }),

  update: asyncHandler(async (req, res) => {
    const { name, email, phone, address } = req.body;
    const parent = await Parent.findById(req.params.id);

    if (!parent) {
      const error = new Error('Parent not found');
      error.status = 404;
      throw error;
    }

    
    if (name) parent.name = name;
    if (phone) parent.phone = phone;
    if (address) parent.address = address;

    await parent.save();

    
    if (email) {
      await User.findByIdAndUpdate(parent.userId, { email });
    }

    res.json(parent);
  }),

  delete: asyncHandler(async (req, res) => {
    const parent = await Parent.findById(req.params.id);
    
    if (!parent) {
      const error = new Error('Parent not found');
      error.status = 404;
      throw error;
    }

    
    await User.findByIdAndDelete(parent.userId);
    
    await parent.remove();

    res.json({ message: 'Parent deleted successfully' });
  }),

  getChildrenLocation: asyncHandler(async (req, res) => {
    const parent = await Parent.findById(req.params.id)
      .populate({
        path: 'children',
        populate: {
          path: 'busId',
          select: 'currentLocation busNumber'
        }
      });

    if (!parent) {
      const error = new Error('Parent not found');
      error.status = 404;
      throw error;
    }

    const childrenLocations = parent.children.map(child => ({
      childId: child._id,
      childName: child.name,
      busNumber: child.busId?.busNumber,
      location: child.busId?.currentLocation,
      status: child.status
    }));

    res.json(childrenLocations);
  }),

  addChild: asyncHandler(async (req, res) => {
    const { studentId } = req.body;
    const parent = await Parent.findById(req.params.id);

    if (!parent) {
      const error = new Error('Parent not found');
      error.status = 404;
      throw error;
    }

    parent.children.push(studentId);
    await parent.save();

    res.json(parent);
  }),

  removeChild: asyncHandler(async (req, res) => {
    const { studentId } = req.body;
    const parent = await Parent.findById(req.params.id);

    if (!parent) {
      const error = new Error('Parent not found');
      error.status = 404;
      throw error;
    }

    parent.children = parent.children.filter(id => id.toString() !== studentId);
    await parent.save();

    res.json(parent);
  }),

  updateNotificationPreferences: asyncHandler(async (req, res) => {
    const parent = await Parent.findByIdAndUpdate(
      req.params.id,
      { notificationPreferences: req.body },
      { new: true }
    );

    if (!parent) {
      const error = new Error('Parent not found');
      error.status = 404;
      throw error;
    }

    res.json(parent.notificationPreferences);
  }),

  updateEmergencyContacts: asyncHandler(async (req, res) => {
    const parent = await Parent.findByIdAndUpdate(
      req.params.id,
      { emergencyContacts: req.body.contacts },
      { new: true }
    );

    if (!parent) {
      const error = new Error('Parent not found');
      error.status = 404;
      throw error;
    }

    res.json(parent.emergencyContacts);
  }),

  updatePickupPreferences: asyncHandler(async (req, res) => {
    const parent = await Parent.findByIdAndUpdate(
      req.params.id,
      { pickupPreferences: req.body },
      { new: true }
    );

    if (!parent) {
      const error = new Error('Parent not found');
      error.status = 404;
      throw error;
    }

    res.json(parent.pickupPreferences);
  }),

  updateAddress: asyncHandler(async (req, res) => {
    const parent = await Parent.findByIdAndUpdate(
      req.params.id,
      { address: req.body },
      { new: true }
    );

    if (!parent) {
      const error = new Error('Parent not found');
      error.status = 404;
      throw error;
    }

    res.json(parent.address);
  })
};