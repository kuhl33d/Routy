import User from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createNotification } from '../utils/notifications.js';

const userController = {
  create: asyncHandler(async (req, res) => {
    const { email, password, name, role, phoneNumber, address } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error('Email already registered');
      error.status = 400;
      throw error;
    }

    // Create new user
    const user = new User({
      email,
      password,
      name,
      role: role || 'user',
      phones: phoneNumber ? [phoneNumber] : [],
      addresses: address ? [address] : [],
      isVerified: true, // Since admin is creating the user
      active: true
    });

    await user.save();

    // Create specific role-based profile if needed
    if (role) {
      switch (role) {
        case 'driver':
          await Driver.create({
            userId: user._id,
            name,
            phoneNumber: phoneNumber || []
          });
          break;
        case 'parent':
          await Parent.create({
            userId: user._id,
            name,
            phone: phoneNumber || [],
            address: address || null
          });
          break;
        case 'school':
          await School.create({
            name,
            adminUsers: [user._id],
            phoneNumber: phoneNumber || [],
            address: address || null
          });
          break;
      }
    }

    // Generate welcome notification
    await createNotification(
      user._id,
      'Welcome to the system! Your account has been created by an administrator.'
    );

    // Send response without password
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: 'User created successfully',
      user: userResponse
    });
  }),
  getAll: asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, role, search } = req.query;

    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit)
      }
    });
  }),

  getById: asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
      .select('-password');

    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }

    res.json(user);
  }),

  update: asyncHandler(async (req, res) => {
    const { name, email, role, active } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }

    // Check email uniqueness if email is being changed
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        const error = new Error('Email already in use');
        error.status = 400;
        throw error;
      }
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (typeof active === 'boolean') user.active = active;

    await user.save();

    // Create notification for role change
    if (role && role !== user.role) {
      await createNotification(user._id, `Your role has been updated to ${role}`);
    }

    res.json(user);
  }),

  delete: asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }

    // Soft delete
    user.active = false;
    user.deleted = true;
    await user.save();

    res.json({ message: 'User deleted successfully' });
  }),

  getNotifications: asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const notifications = await Notification.find({ userId: req.user.id })
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Notification.countDocuments({ userId: req.user.id });

    res.json({
      notifications,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit)
      }
    });
  }),

  markNotificationRead: asyncHandler(async (req, res) => {
    const { notificationId } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId: req.user.id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      const error = new Error('Notification not found');
      error.status = 404;
      throw error;
    }

    res.json(notification);
  }),

  updatePreferences: asyncHandler(async (req, res) => {
    const { notifications, language, theme } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }

    user.preferences = {
      ...user.preferences,
      notifications,
      language,
      theme
    };

    await user.save();

    res.json(user.preferences);
  })
};

export default userController;