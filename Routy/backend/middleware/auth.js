import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import { User } from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const auth = asyncHandler(async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    const error = new Error('Authentication required');
    error.status = 401;
    throw error;
  }

  const decoded = jwt.verify(token, config.jwtSecret);
  const user = await User.findById(decoded.id).select('-password');

  if (!user) {
    const error = new Error('User not found');
    error.status = 401;
    throw error;
  }

  req.user = user;
  next();
});
