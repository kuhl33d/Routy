import Driver from '../models/driver.model.js';

export const driverController = {
  // Create driver
  create: async (req, res) => {
    try {
      const driver = new Driver(req.body);
      await driver.save();
      res.status(201).json(driver);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Get all drivers
  getAll: async (req, res) => {
    try {
      const drivers = await Driver.find()
        .populate('busId')
        .sort({ createdAt: -1 });
      res.json(drivers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get driver by ID
  getById: async (req, res) => {
    try {
      const driver = await Driver.findById(req.params.id).populate('busId');
      if (!driver) {
        return res.status(404).json({ message: 'Driver not found' });
      }
      res.json(driver);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update driver
  update: async (req, res) => {
    try {
      const driver = await Driver.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!driver) {
        return res.status(404).json({ message: 'Driver not found' });
      }
      res.json(driver);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete driver
  delete: async (req, res) => {
    try {
      const driver = await Driver.findByIdAndDelete(req.params.id);
      if (!driver) {
        return res.status(404).json({ message: 'Driver not found' });
      }
      res.json({ message: 'Driver deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};
