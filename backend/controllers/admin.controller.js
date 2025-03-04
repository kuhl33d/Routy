import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import School from "../models/school.model.js";
import Bus from "../models/bus.model.js";
import Driver from "../models/driver.model.js";
import Route from "../models/route.model.js";
import Student from "../models/student.model.js";
import { controllerWrapper } from "../utils/wrappers.js";
import Notification from "../models/notification.model.js";
import { paginateQuery } from "../helpers/pagination.js";
import Subscription from "../models/subscription.model.js";
import Parent from "../models/parent.model.js";

export const getDashboardStats = controllerWrapper(
  "getDashboardStats",
  async (req, res) => {
    try {
      const [
        totalParents,
        totalDrivers,
        totalSchools,
        totalBuses,
        totalRoutes,
        totalStudents,
      ] = await Promise.all([
        User.countDocuments({ role: "parent" }),
        User.countDocuments({ role: "driver" }),
        School.countDocuments(),
        Bus.countDocuments(),
        Route.countDocuments(),
        Student.countDocuments(),
      ]);

      return res.json({
        success: true,
        stats: {
          totalParents,
          totalDrivers,
          totalSchools,
          totalBuses,
          totalRoutes,
          totalStudents,
        },
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Server error", error });
    }
  }
);

export const getSystemOverview = controllerWrapper(
  "getSystemOverview",
  async (req, res) => {
    const activeRoutes = await Route.find()
      .populate("busses", "status currentLocation")
      .populate("stops.address");

    const activeBuses = await Bus.find({ status: "On Route" })
      .populate("driverId", "name phoneNumber")
      .populate("routeId", "name");

    const recentAlerts = await Notification.find().sort("-createdAt").limit(10);

    return res.json({
      activeRoutes,
      activeBuses,
      recentAlerts,
    });
  }
);

export const getAnalytics = controllerWrapper(async (req, res) => {
  const { startDate, endDate } = req.query;

  const analytics = {
    routeEfficiency: await calculateRouteEfficiency(startDate, endDate),
    busUtilization: await calculateBusUtilization(startDate, endDate),
    studentAttendance: await calculateStudentAttendance(startDate, endDate),
  };

  res.json(analytics);
});

export const schoolSubscriptions = controllerWrapper(
  "schoolSubscriptions",
  async (req, res) => {
    const { page, limit } = req.body;
    const { schoolId } = req.params;
    const school = await School.findOne({ _id: schoolId });
    console.log("school ", school);
    const admin = school.adminEmails[0];
    const user = await User.findOne({ email: admin });
    const userId = user._id;
    // const userId = school.userId;
    const subscriptions = await paginateQuery(
      page,
      limit,
      Subscription.find({ userId }).sort("-createdAt")
    );
    return res.status(subscriptions.success ? 200 : 400).json(subscriptions);
  }
);

export const addSubscription = controllerWrapper(
  "addSubscription",
  async (req, res) => {
    const { schoolId } = req.params;
    const { plan = "paid for 0 busses for 1 month", amount = 0 } = req.body;

    const school = await School.findById(schoolId);
    if (!school) {
      return res
        .status(404)
        .json({ success: false, message: "School not found" });
    }
    const user = await User.findOne({ email: school.adminEmails[0] });
    const userId = user._id;
    console.log("school ", school);
    const subscription = new Subscription({
      plan,
      amount,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      userId: userId,
    });
    await subscription.save();

    return res.status(201).json({
      success: true,
      message: "Subscription added successfully",
    });
  }
);

export const approveSchool = controllerWrapper(
  "approveSchool",
  async (req, res) => {
    const { schoolId } = req.params;
    const school = await School.findOne({ _id: schoolId });
    const user = await User.findByIdAndUpdate(
      { email: school.adminEmails[0] },
      { active: true },
      { new: true }
    );
    if (!school) {
      return res
        .status(404)
        .json({ success: false, message: "School not found" });
    }

    return res.json({
      success: true,
      message: "School approved successfully",
      school,
    });
  }
);

export const approveDriver = controllerWrapper(
  "approveDriver",
  async (req, res) => {
    const { driverId } = req.params;

    const driver = await User.findByIdAndUpdate(
      driverId,
      { role: "driver", approved: true },
      { new: true }
    );

    if (!driver) {
      return res
        .status(404)
        .json({ success: false, message: "Driver not found" });
    }

    return res.json({
      success: true,
      message: "Driver approved successfully",
      driver,
    });
  }
);

export const payFees = controllerWrapper("payFees", async (req, res) => {
  const { studentId } = req.params;
  const { amount, plan = "subscribed to bus" } = req.body;

  const student = await Student.findById(studentId);
  if (!student) {
    return res
      .status(404)
      .json({ success: false, message: "Student not found" });
  }
  // create and save the subscription
  const subscription = await Subscription.create({
    plan,
    userId: studentId,
    amount,
    paymentDate: Date.now(),
    startDate: Date.now(),
    endDate: Date.now() + 30 * 24 * 60 * 60 * 1000,
  });

  student.fees = Math.max(0, student.fees - amount);
  await student.save();

  return res.json({
    success: true,
    message: "Fees paid successfully",
    data: student,
  });
});
export const getFullReview = controllerWrapper(
  "getFullReview",
  async (req, res) => {
    const selectUserSchema =
      "-password -verificationToken -verificationTokenExpiresAt  -active -lastLogin -createdAt -updatedAt -__v";
    const schools = await School.find()
      .sort("-createdAt")
      .populate({ path: "adminUsers", model: User, select: selectUserSchema })
      .populate("userId", selectUserSchema)
      .populate("buses drivers routes")
      .populate({
        path: "students",
        populate: {
          path: "userId",
          model: User,
          select: selectUserSchema,
        },
      })
      .populate({
        path: "drivers",
        populate: {
          path: "userId",
          model: User,
          select: selectUserSchema,
        },
      });
    const drivers = await Driver.find()
      .populate("userId", selectUserSchema)
      .populate("schoolId");
    const students = await Student.find()
      .populate("userId", selectUserSchema)
      .populate("schoolId");
    const parents = await Parent.find().populate("userId", selectUserSchema);
    return res
      .status(200)
      .json({ success: true, data: { schools, drivers, parents } });
  }
);
