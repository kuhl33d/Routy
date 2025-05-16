import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/routy',
  jwtSecret: process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex'),
  jwtExpiration: '24h',
  environment: process.env.NODE_ENV || 'development',
  mapboxToken: process.env.MAPBOX_TOKEN,
  maxLoginAttempts: 5,
  lockTime: 2 * 60 * 60 * 1000, // 2 hours
};