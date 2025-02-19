import bcrypt from 'bcryptjs';
import User  from '../models/user.model.js';
import { generateToken, generateRefreshToken } from '../utils/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const authController = {
  register: asyncHandler(async (req, res) => {
    const { email, password, name, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error('Email already registered');
      error.status = 400;
      throw error;
    }

    const user = new User({
      email,
      password,
      name,
      role: role || 'user'
    });

    await user.save();

    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token,
      refreshToken
    });
  }),

  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      const error = new Error('Invalid credentials');
      error.status = 401;
      throw error;
    }

    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token,
      refreshToken
    });
  }),

  getProfile: asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }
    res.json(user);
  }),

  updateProfile: asyncHandler(async (req, res) => {
    const { name, email } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();
    res.json(user);
  }),

  changePassword: asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user || !(await user.comparePassword(currentPassword))) {
      const error = new Error('Invalid current password');
      error.status = 400;
      throw error;
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  }),
  logout: asyncHandler(async (req, res) => {
    // If you're using refresh tokens, you might want to invalidate them here
    const user = await User.findById(req.user.id);
    
    if (user) {
      // Update last logout timestamp
      user.lastLogin = Date.now();
      await user.save();
    }

    // You might want to add the token to a blacklist if you're implementing token invalidation
    // await BlacklistedToken.create({ token: req.token });

    res.json({ 
      message: 'Logged out successfully',
      success: true
    });
  })
};