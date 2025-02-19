import  Student  from '../models/student.model.js';
import  Attendance  from '../models/attendance.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const studentController = {
  create: asyncHandler(async (req, res) => {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  }),

  getAll: asyncHandler(async (req, res) => {
    const students = await Student.find()
      .populate('parentId', 'name')
      .populate('schoolId', 'name')
      .populate('busId', 'busNumber')
      .populate('pickupLocation')
      .sort('-createdAt');
    res.json(students);
  }),

  getById: asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id)
      .populate('parentId', 'name')
      .populate('schoolId', 'name')
      .populate('busId', 'busNumber')
      .populate('pickupLocation');

    if (!student) {
      const error = new Error('Student not found');
      error.status = 404;
      throw error;
    }

    res.json(student);
  }),

  update: asyncHandler(async (req, res) => {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!student) {
      const error = new Error('Student not found');
      error.status = 404;
      throw error;
    }

    res.json(student);
  }),

  delete: asyncHandler(async (req, res) => {
    const student = await Student.findByIdAndDelete(req.params.id);
    
    if (!student) {
      const error = new Error('Student not found');
      error.status = 404;
      throw error;
    }

    res.json({ message: 'Student deleted successfully' });
  }),

  updateStatus: asyncHandler(async (req, res) => {
    const { status } = req.body;
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!student) {
      const error = new Error('Student not found');
      error.status = 404;
      throw error;
    }

    
    if (status === 'Picked Up' || status === 'Dropped Off') {
      await Attendance.create({
        studentId: student._id,
        date: new Date(),
        pickedUp: status === 'Picked Up',
        droppedOff: status === 'Dropped Off'
      });
    }

    res.json(student);
  }),

  getAttendance: asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;
    
    const attendance = await Attendance.find({
      studentId: req.params.id,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).sort('-date');

    res.json(attendance);
  })
};