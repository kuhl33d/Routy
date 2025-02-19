// backend/controllers/adminController.js
const Admin = {
    // Dashboard statistics
    getDashboardStats: async (req, res) => {
      try {
        const stats = {
          totalStudents: await Student.countDocuments(),
          totalDrivers: await Driver.countDocuments(),
          totalBuses: await Bus.countDocuments(),
          activeRoutes: await Route.countDocuments({ status: 'active' })
        };
        res.json(stats);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },
  
    // Manage drivers
    assignDriverToBus: async (req, res) => {
      const { driverId, busId } = req.body;
      try {
        const updatedBus = await Bus.findByIdAndUpdate(
          busId,
          { driverId },
          { new: true }
        );
        res.json(updatedBus);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },
  
    // Manage routes
    createRoute: async (req, res) => {
      try {
        const newRoute = await Route.create(req.body);
        res.status(201).json(newRoute);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  };
  
  export default Admin;