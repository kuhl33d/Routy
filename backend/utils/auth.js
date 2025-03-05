import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import User  from '../models/user.model.js';

export const verifyToken = async (token) => {
  try {
    if (!token) {
      throw new Error('No token provided');
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id,
      role: user.role,
      email: user.email 
    },
    config.jwtSecret,
    { 
      expiresIn: config.jwtExpiration 
    }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    config.jwtSecret,
    { expiresIn: '7d' }
  );
};

export const verifyRefreshToken = async (token) => {
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};