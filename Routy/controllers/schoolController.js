import { School } from '../models/school.model.js';
import { User } from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const schoolController = {
  create: asyncHandler(async (req, res) => {
    const { name, address, phoneNumber, email, adminEmails, website } = req.body;

    // Create school admin user accounts
    const adminUsers = await Promise.all(
      adminEmails.map(async (email) => {
        const user = new User({
          email,
          password: Math.random().toString(36).slice(-8), // Generate random password
          name: `${name} Admin`,
          role: 'school'
        });
        await user.save();
        return user._id;
      })
    );

    const school = new School({
      name,
      address,
      phoneNumber,
      email,
      adminEmails,
      website,
      adminUsers
    });

    await school.save();
    res.status(201).json(school);
  }),

  getAll: asyncHandler(async (req, res) => {
    const schools = await School.find()
      .populate('address')
      .populate('buses', 'busNumber')
      .sort('-createdAt');
    res.json(schools);
  }),

  getById: asyncHandler(async (req, res) => {
    const school = await School.findById(req.params.id)
      .populate('address')
      .populate('buses', 'busNumber')
      .populate('adminUsers', 'name email');

    if (!school) {
      const error = new Error('School not found');
      error.status = 404;
      throw error;
    }

    res.json(school);
  }),

  update: asyncHandler(async (req, res) => {
    const school = await School.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!school) {
      const error = new Error('School not found');
      error.status = 404;
      throw error;
    }

    res.json(school);
  }),

  delete: asyncHandler(async (req, res) => {
    const school = await School.findByIdAndDelete(req.params.id);
    
    if (!school) {
      const error = new Error('School not found');
      error.status = 404;
      throw error;
    }

    // Delete associated admin users
    await User.deleteMany({ _id: { $in: school.adminUsers } });

    res.json({ message: 'School deleted successfully' });
  }),

  getDashboardStats: asyncHandler(async (req, res) => {
    const schoolId = req.params.id;
    
    const stats = await School.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(schoolId) } },
      {
        $lookup: {
          from: 'students',
          localField: '_id',
          foreignField: 'schoolId',
          as: 'students'
        }
      },
      {
        $lookup: {
          from: 'buses',
          localField: 'buses',
          foreignField: '_id',
          as: 'activeBuses'
        }
      },
      {
        $project: {
          totalStudents: { $size: '$students' },
          totalBuses: { $size: '$buses' },
          activeRoutes: {
            $size: {
              $filter: {
                input: '$activeBuses',
                as: 'bus',
                cond: { $eq: ['$$bus.status', 'On Route'] }
              }
            }
          }
        }
      }
    ]);

    res.json(stats[0]);
  })
};