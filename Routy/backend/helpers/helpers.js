import mongoose from 'mongoose';

/**
 * Validates if an ObjectId exists in a specified collection
 * @param {string} modelName - The name of the mongoose model
 * @param {string} id - The ObjectId to validate
 * @returns {Promise<boolean>}
 */
export const validateObjectIdExists = async (modelName, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return false;
  }

  const Model = mongoose.model(modelName);
  const exists = await Model.exists({ _id: id });
  return !!exists;
};

/**
 * Formats a phone number to a consistent format
 * @param {string} phoneNumber - The phone number to format
 * @returns {string}
 */
export const formatPhoneNumber = (phoneNumber) => {
  // Remove all non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Check if it's a valid number
  if (cleaned.length < 10) {
    throw new Error('Invalid phone number');
  }

  // Format as: +X (XXX) XXX-XXXX
  return `+${cleaned.slice(0, -10)} (${cleaned.slice(-10, -7)}) ${cleaned.slice(-7, -4)}-${cleaned.slice(-4)}`;
};

/**
 * Calculates the distance between two coordinates
 * @param {Object} coord1 - First coordinate {latitude, longitude}
 * @param {Object} coord2 - Second coordinate {latitude, longitude}
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (coord1, coord2) => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(coord2.latitude - coord1.latitude);
  const dLon = toRad(coord2.longitude - coord1.longitude);
  const lat1 = toRad(coord1.latitude);
  const lat2 = toRad(coord2.latitude);

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const toRad = (value) => {
  return value * Math.PI / 180;
};

/**
 * Validates an email address
 * @param {string} email - The email to validate
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Generates a random string
 * @param {number} length - Length of the string to generate
 * @returns {string}
 */
export const generateRandomString = (length = 10) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

/**
 * Checks if a time is within operating hours
 * @param {Date} time - The time to check
 * @returns {boolean}
 */
export const isWithinOperatingHours = (time) => {
  const hour = time.getHours();
  return hour >= 6 && hour <= 18; // 6 AM to 6 PM
};

/**
 * Validates a license plate number
 * @param {string} plateNumber - The license plate number to validate
 * @returns {boolean}
 */
export const isValidLicensePlate = (plateNumber) => {
  // Customize this regex based on your license plate format
  const plateRegex = /^[A-Z0-9]{3,8}$/;
  return plateRegex.test(plateNumber.toUpperCase());
};

/**
 * Formats a date to a specific string format
 * @param {Date} date - The date to format
 * @returns {string}
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Validates coordinates
 * @param {Object} coordinates - The coordinates to validate
 * @returns {boolean}
 */
export const isValidCoordinates = (coordinates) => {
  const { latitude, longitude } = coordinates;
  return (
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
};

/**
 * Calculates the estimated time of arrival
 * @param {Object} currentLocation - Current coordinates
 * @param {Object} destination - Destination coordinates
 * @param {number} averageSpeed - Average speed in km/h
 * @returns {number} Time in minutes
 */
export const calculateETA = (currentLocation, destination, averageSpeed = 30) => {
  const distance = calculateDistance(currentLocation, destination);
  return Math.round((distance / averageSpeed) * 60);
};

/**
 * Checks if two routes intersect
 * @param {Array} route1 - Array of coordinates for first route
 * @param {Array} route2 - Array of coordinates for second route
 * @returns {boolean}
 */
export const doRoutesIntersect = (route1, route2) => {
  // Implementation of route intersection logic
  // This is a simplified version
  for (let i = 0; i < route1.length; i++) {
    for (let j = 0; j < route2.length; j++) {
      if (calculateDistance(route1[i], route2[j]) < 0.1) { // Within 100 meters
        return true;
      }
    }
  }
  return false;
};

/**
 * Validates a student grade
 * @param {string} grade - The grade to validate
 * @returns {boolean}
 */
export const isValidGrade = (grade) => {
  const validGrades = ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  return validGrades.includes(grade.toString());
};

export default {
  validateObjectIdExists,
  formatPhoneNumber,
  calculateDistance,
  isValidEmail,
  generateRandomString,
  isWithinOperatingHours,
  isValidLicensePlate,
  formatDate,
  isValidCoordinates,
  calculateETA,
  doRoutesIntersect,
  isValidGrade
};