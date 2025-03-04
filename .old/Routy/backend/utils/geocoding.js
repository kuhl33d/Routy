import axios from 'axios';
import { config } from '../config/config.js';

export const geocodeAddress = async (address) => {
  try {
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        address
      )}.json?access_token=${config.mapboxToken}`
    );

    if (response.data.features && response.data.features.length > 0) {
      const [longitude, latitude] = response.data.features[0].center;
      return {
        latitude,
        longitude,
        formattedAddress: response.data.features[0].place_name,
      };
    }
    throw new Error('Address not found');
  } catch (error) {
    throw new Error('Geocoding failed: ' + error.message);
  }
};