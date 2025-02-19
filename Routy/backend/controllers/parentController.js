import { Parent } from '../models/parent.model.js';
import  User  from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const parentController = {
  create: asyncHandler(async (req, res) => {
    const { email, password, name, phone, address, children } = req.body;

    // Create user account
    const user = new User({
      email,
      password,
      name,
      role: 'parent'
    });
    await user.save();

    // Create parent profile
    const parent = new Parent({
      userId: user._id,
      phone,
      address,
      children
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
    const parent = await Parent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!parent) {
      const error = new Error('Parent not found');
      error.status = 404;
      throw error;
    }

    res.json(parent);
  }),

  delete: asyncHandler(async (req, res) => {
    const parent = await Parent.findByIdAndDelete(req.params.id);
    
    if (!parent) {
      const error = new Error('Parent not found');
      error.status = 404;
      throw error;
    }

    // Also delete user account
    await User.findByIdAndDelete(parent.userId);

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
  })
};