import mongoose from "mongoose";
import School from "../models/school.model.js";
import User from "../models/user.model.js";
import { controllerWrapper } from "../utils/wrappers.js";
import { paginateQuery } from "../helpers/pagination.js";
import Bus from "../models/bus.model.js";

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

export const getSchoolById = controllerWrapper(
  "getSchoolById",
  async (req, res) => {
    const school = await School.findById(req.params.id)
      .populate("buses routes")
      .populate({
        path: "drivers",
        populate: {
          path: "userId",
          model: User,
          select:
            "-password -verificationToken -verificationTokenExpiresAt  -active -lastLogin -createdAt -updatedAt -__v",
        },
      })
      .populate({
        path: "students",
        populate: {
          path: "userId",
          model: User,
          select:
            "-password -verificationToken -verificationTokenExpiresAt  -active -lastLogin -createdAt -updatedAt -__v",
        },
      })
      .populate("userId", "name email")
      .populate("adminUsers", "name email");

    if (!school)
      return res
        .status(404)
        .json({ success: false, message: "School not found" });

    return res.status(200).json(school);
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
