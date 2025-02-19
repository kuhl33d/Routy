import { asyncHandler } from '../utils/asyncHandler.js';
import  User  from '../models/user.model.js';
import  School  from '../models/school.model.js';
import  Bus  from '../models/bus.model.js';
import  Driver  from '../models/driver.model.js';
import  Route  from '../models/route.model.js';
import  Student  from '../models/student.model.js';

export const adminController = {
  getDashboardStats: asyncHandler(async (req, res) => {
    const stats = await Promise.all([
      User.countDocuments({ role: 'parent' }),
      User.countDocuments({ role: 'driver' }),
      School.countDocuments(),
      Bus.countDocuments(),
      Route.countDocuments(),
      Student.countDocuments()
    ]);

    res.json({
      totalParents: stats[0],
      totalDrivers: stats[1],
      totalSchools: stats[2],
      totalBuses: stats[3],
      totalRoutes: stats[4],
      totalStudents: stats[5]
    });
  }),

  getSystemOverview: asyncHandler(async (req, res) => {
    const activeRoutes = await Route.find()
      .populate('busses', 'status currentLocation')
      .populate('stops.address');

    const activeBuses = await Bus.find({ status: 'On Route' })
      .populate('driverId', 'name phoneNumber')
      .populate('routeId', 'name');

    const recentAlerts = await Notification.find()
      .sort('-createdAt')
      .limit(10);

    res.json({
      activeRoutes,
      activeBuses,
      recentAlerts
    });
  }),

  manageUsers: asyncHandler(async (req, res) => {
    const { role, page = 1, limit = 10 } = req.query;
    const query = role ? { role } : {};

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
        currentPage: page,
        limit
      }
    });
  }),

  updateUserStatus: asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { active } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { active },
      { new: true }
    ).select('-password');

    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }

    res.json(user);
  }),

  getSystemLogs: asyncHandler(async (req, res) => {
    // Implement system logs retrieval
    res.json({ message: 'System logs functionality to be implemented' });
  }),

  getAnalytics: asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;

    const analytics = {
      routeEfficiency: await calculateRouteEfficiency(startDate, endDate),
      busUtilization: await calculateBusUtilization(startDate, endDate),
      studentAttendance: await calculateStudentAttendance(startDate, endDate)
    };

    res.json(analytics);
  })
};