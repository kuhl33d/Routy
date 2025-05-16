import mongoose from "mongoose";
import School from "../models/school.model.js";
import User from "../models/user.model.js";
import { controllerWrapper } from "../utils/wrappers.js";
import { paginateQuery } from "../helpers/pagination.js";
import Bus from "../models/bus.model.js";
import Parent from "../models/parent.model.js";
import Route from "../models/route.model.js";
import Driver from "../models/driver.model.js";
import Student from "../models/student.model.js";
export const getAllSchools = controllerWrapper(
  "getAllSchools",
  async (req, res) => {
    const { page, limit } = req.query;

    const schools = await paginateQuery(
      page,
      limit,
      School.find()
        .sort("-createdAt")
        .populate({
          path: "adminUsers",
          select: "name email",
        })
        .populate("userId", "name email addresses")
        .populate("buses")
    );

    return res.status(schools.success ? 200 : 400).json(schools);
  }
);

const getSchoolIdbyUserId = async (userId) => {
  console.log("getSchoolIdbyUserId - userId", userId);
  const school = await School.findOne({ userId });
  if (!school) return null;
  console.log("getSchoolIdbyUserId - schoolId", school._id);
  return school._id;
};

export const getSchoolById = controllerWrapper(
  "getSchoolById",
  async (req, res) => {
    // Step 1: Fetch the school ID using the user ID from the request parameters
    const schoolId = await getSchoolIdbyUserId(req.params.id);

    // Step 2: If no school ID is found, return a 404 error
    if (!schoolId)
      return res
        .status(404)
        .json({ success: false, message: "School not found" });

    // Step 3: Fetch the school document by ID and populate related fields
    const school = await School.findById(schoolId)
      // Populate the 'buses' and 'routes' fields with their respective documents
      .populate("buses routes")
      // Populate the 'drivers' field and then populate the 'userId' field within each driver
      .populate({
        path: "drivers",
        populate: {
          path: "userId", // Populate the 'userId' field in the 'drivers' array
          model: User, // Use the 'User' model for population
          select:
            "-password -verificationToken -verificationTokenExpiresAt -active -lastLogin -createdAt -updatedAt -__v", // Exclude sensitive or unnecessary fields
        },
      })
      // Populate the 'students' field and then populate the 'userId', 'parentId', and 'routeId' fields within each student
      .populate({
        path: "students",
        populate: [
          {
            path: "userId", // Populate the 'userId' field in the 'students' array
            model: User, // Use the 'User' model for population
            select:
              "-password -verificationToken -verificationTokenExpiresAt -active -lastLogin -createdAt -updatedAt -__v", // Exclude sensitive or unnecessary fields
          },
          {
            path: "parentId", // Populate the 'parentId' field in the 'students' array
            model: Parent, // Use the 'Parent' model for population
            populate: {
              path: "userId", // Populate the 'userId' field within each parent
              model: User, // Use the 'User' model for population
              select: "name phoneNumber email", // Include only necessary fields
            },
          },
          {
            path: "routeId", // Populate the 'routeId' field in the 'students' array
            model: Route, // Use the 'Route' model for population
            select: "name startLocation endLocation buses stops", // Include only necessary fields
          },
        ],
      })
      // Populate the 'userId' field in the school document (if it exists)
      .populate("userId", "name email")
      // Populate the 'adminUsers' field in the school document (if it exists)
      .populate("adminUsers", "name email");

    // Step 4: Transform the 'students' array to include organized and clean data
    if (school.students) {
      school.students = school.students.map((student) => {
        // Extract and format parent details from the 'parentId' array
        const parents = student.parentId.map((parent) => ({
          name: parent.userId.name,
          email: parent.userId.email,
          phoneNumber: parent.userId.phoneNumber,
        }));

        // Extract and format route details from the 'routeId' field
        const route = student.routeId
          ? {
              name: student.routeId.name,
              startLocation: student.routeId.startLocation,
              endLocation: student.routeId.endLocation,
              buses: student.routeId.buses, // Array of buses
              stops: student.routeId.stops, // Array of stops
            }
          : null;

        // Return a clean and organized student object
        return {
          _id: student._id,
          _id: student.userId._id, // Include the user ID of the student
          name: student.userId.name,
          email: student.userId.email,
          role: student.userId.role,
          age: student.age,
          grade: student.grade,
          status: student.status,
          enrolled: student.enrolled,
          fees: student.fees,
          createdAt: student.createdAt,
          updatedAt: student.updatedAt,

          parents: parents, // Include formatted parent details
          route: route, // Include formatted route details
          schoolId: student.schoolId,
        };
      });
    }

    // Step 5: Return the school document with the transformed data
    return res.status(200).json(school);
  }
);

export const getSchoolStatsById = controllerWrapper(
  "getSchoolStatsById",
  async (req, res) => {
    try {
      // Step 1: Fetch the school ID using the user ID from the request parameters
      const schoolId = await getSchoolIdbyUserId(req.params.id);

      // Step 2: If no school ID is found, return a 404 error
      if (!schoolId) {
        return res
          .status(404)
          .json({ success: false, message: "School not found" });
      }

      // Step 3: Execute parallel count queries
      const [studentsCount, routesCount, busesCount, driversCount] =
        await Promise.all([
          Student.countDocuments({
            schoolId: new mongoose.Types.ObjectId(schoolId),
          }),
          Route.countDocuments({
            schoolId: new mongoose.Types.ObjectId(schoolId),
          }),
          Bus.countDocuments({
            schoolId: new mongoose.Types.ObjectId(schoolId),
          }),
          Driver.countDocuments({
            schoolId: new mongoose.Types.ObjectId(schoolId),
          }),
        ]);

      // Step 4: Prepare the response
      const stats = {
        totalStudents: studentsCount,
        totalRoutes: routesCount,
        totalBuses: busesCount,
        totalDrivers: driversCount,
      };

      // Step 5: Return the statistics
      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error("Error in getSchoolStatsById:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }
);
export const updateSchool = controllerWrapper(
  "updateSchool",
  async (req, res) => {
    const school = await School.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!school) {
      const error = new Error("School not found");
      error.status = 404;
      throw error;
    }

    res.json(school);
  }
);

export const deleteSchool = controllerWrapper(
  "deleteSchool",
  async (req, res) => {
    const school = await School.findByIdAndDelete(req.params.id);

    if (!school) {
      const error = new Error("School not found");
      error.status = 404;
      throw error;
    }

    await User.deleteMany({ _id: { $in: school.adminUsers } });

    res.json({ message: "School deleted successfully" });
  }
);

export const getDashboardStats = controllerWrapper(
  "getDashboardStats",
  async (req, res) => {
    const schoolId = req.params.id;

    const stats = await School.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(schoolId) } },
      {
        $lookup: {
          from: "students",
          localField: "_id",
          foreignField: "schoolId",
          as: "students",
        },
      },
      {
        $lookup: {
          from: "buses",
          localField: "buses",
          foreignField: "_id",
          as: "activeBuses",
        },
      },
      {
        $project: {
          totalStudents: { $size: "$students" },
          totalBuses: { $size: "$buses" },
          activeRoutes: {
            $size: {
              $filter: {
                input: "$activeBuses",
                as: "bus",
                cond: { $eq: ["$$bus.status", "On Route"] },
              },
            },
          },
        },
      },
    ]);

    res.json(stats[0]);
  }
);

export const addBusToSchool = controllerWrapper(
  "addBusToSchool",
  async (req, res) => {
    const schoolId = req.params.schoolId;
    const { busNumber, capacity, status = "Idle" } = req.body;
    const bus = await Bus.create({
      busNumber,
      capacity,
      status,
      schoolId,
    });
    if (bus)
      return res.status(201).json({
        success: true,
        message: "bus Created Successfully",
        data: bus,
      });
    return res.status(400).json({
      success: false,
      message: "Bus Creation Failed",
    });
  }
);

export const addDriverToSchool = controllerWrapper(
  "addDriverToSchool",
  async (req, res) => {
    const { schoolId, driverId } = req.params.id;
    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }
    driver.schoolId = schoolId;
    await driver.save();
    return res.status(201).json({
      success: true,
      message: "Driver added to school successfully",
      data: driver,
    });
  }
);

export const addDriver = controllerWrapper("addDriver", async (req, res) => {
  const { schoolId, driverEmail } = req.body;
  console.log("body", req.body);
  const school = await School.findById(schoolId);
  if (!school)
    return res
      .status(404)
      .json({ success: false, message: "School with this id not found" });

  const driverUser = await User.findOne({
    email: driverEmail,
    role: "driver",
  });
  if (!driverUser)
    return res
      .status(404)
      .json({ success: false, message: "User with this email not found" });

  const driver = await Driver.findOne({ userId: driverUser._id });
  if (!driver)
    return res
      .status(404)
      .json({ success: false, message: "Driver not found" });
  if (driver.schoolId && driver.schoolId !== schoolId)
    return res.status(400).json({
      success: false,
      message: "Driver already added to another school",
    });
  if (driver.schoolId === schoolId)
    return res.status(400).json({
      success: false,
      message: "Driver already added to the same school",
    });
  if (!driver.schoolId) {
    driver.schoolId = schoolId;
    await driver.save();
    return res
      .status(200)
      .json({ success: true, message: "Driver added to school" });
  }
});
export const addStudent = controllerWrapper("addStudent", async (req, res) => {
  const { schoolId, studentEmail } = req.body;
  const school = await School.findById(schoolId);
  if (!school)
    return res
      .status(404)
      .json({ success: false, message: "School with this id not found" });

  const studentUser = await User.findOne({
    email: studentEmail,
    role: "student",
  });
  if (!studentUser)
    return res
      .status(404)
      .json({ success: false, message: "User with this email not found" });

  const student = await Student.findOne({ userId: studentUser._id });
  if (!student)
    return res
      .status(404)
      .json({ success: false, message: "Student not found" });
  if (student.schoolId && student.schoolId !== schoolId)
    return res.status(400).json({
      success: false,
      message: "Student already added to another school",
    });
  if (student.schoolId === schoolId)
    return res.status(400).json({
      success: false,
      message: "Student already added to the same school",
    });
  if (!student.schoolId) {
    student.schoolId = schoolId;
    await student.save();
    return res
      .status(200)
      .json({ success: true, message: "Student added to school" });
  }
});
