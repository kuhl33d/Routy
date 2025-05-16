import Driver from "../models/driver.model.js";
import Bus from "../models/bus.model.js";
import Route from "../models/route.model.js";
import Student from "../models/student.model.js";
import User from "../models/user.model.js";
import { createNotification } from "../utils/notifications.js";
import { sendToUser } from "../utils/websocket.js";
import { controllerWrapper } from "../utils/wrappers.js";
import { paginateQuery } from "../helpers/pagination.js";
import School from "../models/school.model.js";

export const createDriver = controllerWrapper(
  "createDriver",
  async (req, res) => {
    const { name, password, email, phoneNumber, licenseNumber, vehicleType } =
      req.body;
    console.log("req.body ", req.body);

    const user = new User({
      name,
      email,
      password,
      role: "driver",
      phoneNumber,
    });
    await user.save();

    const driver = new Driver({
      userId: user._id,
      licenseNumber,
      vehicleType,
    });
    await driver.save();

    const populatedDriver = await Driver.findById(driver._id).populate(
      "userId",
      "name"
    );

    res.status(201).json({
      success: true,
      data: populatedDriver,
      message: "Driver created successfully",
    });
  }
);

export const getAllDrivers = controllerWrapper(
  "getAllDrivers",
  async (req, res) => {
    try {
      let selector = {};
      
      if (req.user.role === "school") {
        const school = await School.findOne({ userId: req.user._id });
        if (!school) {
          return res
            .status(404)
            .json({ success: false, message: "School not found" });
        }
        selector = { schoolId: school._id };
      }

      const drivers = await Driver.find(selector)
        .populate("busId", "busNumber status")
        .populate("userId", "name email phoneNumber")
        .populate("schoolId", "name")
        .sort("-createdAt");

      return res.status(200).json({
        success: true,
        data: drivers
      });
    } catch (error) {
      console.error("Error in getAllDrivers:", error);
      return res.status(500).json({
        success: false,
        message: "Server error fetching drivers",
        error: error.message
      });
    }
  }
);

export const getDriverById = controllerWrapper(
  "getDriverById",
  async (req, res) => {
    const { state } = req.query;
    const selector =
      state === "user" ? { userId: req.params.id } : { _id: req.params.id };
    const driver = await Driver.findOne(selector).populate("busId userId");
    // const driver = await Driver.findById(req.params.id)
    //   .populate("busId", "busNumber status currentLocation")
    //   .populate("userId", "name email");

    if (!driver) {
      const error = new Error("Driver not found");
      error.status = 404;
      throw error;
    }
    res.json(driver);
  }
);

export const updateDriver = controllerWrapper(
  "updateDriver",
  async (req, res) => {
    const { id } = req.params;
    const { name, licenseNumber, phoneNumber, vehicleType, isActive } =
      req.body;

    const driver = await Driver.findByIdAndUpdate(
      id,
      {
        name,
        licenseNumber,
        phoneNumber,
        vehicleType,
        isActive,
      },
      { new: true, runValidators: true }
    );

    if (!driver) {
      const error = new Error("Driver not found");
      error.status = 404;
      throw error;
    }

    res.json({
      success: true,
      message: "Driver updated successfully",
      data: driver,
    });
  }
);

export const deleteDriver = controllerWrapper(
  "deleteDriver",
  async (req, res) => {
    const driver = await Driver.findById(req.params.id);

    if (!driver) {
      return res
        .status(404)
        .json({ success: false, message: "Driver not found" });
    }
    const userId = driver.userId;

    await Driver.findByIdAndDelete(req.params.id);

    await User.findByIdAndDelete(userId);

    res.json({ success: true, message: "Driver deleted successfully" });
  }
);

export const getCurrentRoute = controllerWrapper(
  "getCurrentRoute",
  async (req, res) => {
    const driver = await Driver.findById(req.params.id).populate("busId");

    if (!driver) {
      return res
        .status(404)
        .json({ success: false, message: "Driver not found" });
    }

    if (!driver.busId) {
      return res.json({ success: false, message: "No bus assigned to driver" });
    }

    const route = await Route.findById(driver.busId.routeId)
      .populate("startLocation")
      .populate("endLocation")
      .populate("stops.address");

    res.json(route);
  }
);

export const startRoute = controllerWrapper("startRoute", async (req, res) => {
  const driver = await Driver.findById(req.params.id).populate("busId");

  if (!driver)
    return res
      .status(400)
      .json({ success: false, message: "Driver not found" });

  if (!driver.busId)
    return res
      .status(400)
      .json({ success: false, message: "No bus assigned to driver" });

  const bus = await Bus.findByIdAndUpdate(
    driver.busId._id,
    {
      status: "On Route",
      currentPassengers: 0,
      studentsOnBoard: [],
    },
    { new: true }
  );

  const students = await Student.find({ busId: bus._id }).populate("parentId");

  for (const student of students) {
    for (const parentId of student.parentId) {
      await createNotification(
        parentId,
        `Bus ${bus.busNumber} has started its route`
      );
    }
  }

  res.json({
    message: "Route started successfully",
    bus,
  });
});

export const endRoute = controllerWrapper("endRoute", async (req, res) => {
  const driver = await Driver.findById(req.params.id).populate("busId");

  if (!driver) {
    const error = new Error("Driver not found");
    error.status = 404;
    throw error;
  }

  if (!driver.busId) {
    const error = new Error("No bus assigned to driver");
    error.status = 400;
    throw error;
  }

  const bus = await Bus.findByIdAndUpdate(
    driver.busId._id,
    {
      status: "Idle",
      currentPassengers: 0,
      studentsOnBoard: [],
    },
    { new: true }
  );

  const students = await Student.find({ busId: bus._id }).populate("parentId");

  for (const student of students) {
    for (const parentId of student.parentId) {
      await createNotification(
        parentId,
        `Bus ${bus.busNumber} has completed its route`
      );
    }
  }

  res.json({
    message: "Route ended successfully",
    bus,
  });
});

export const updateLocation = controllerWrapper(
  "updateLocation",
  async (req, res) => {
    const { latitude, longitude } = req.body;

    const driver = await Driver.findById(req.params.id).populate("busId");

    if (!driver) {
      const error = new Error("Driver not found");
      error.status = 404;
      throw error;
    }

    if (!driver.busId) {
      const error = new Error("No bus assigned to driver");
      error.status = 400;
      throw error;
    }

    const bus = await Bus.findByIdAndUpdate(
      driver.busId._id,
      {
        currentLocation: { latitude, longitude },
        lastLocationUpdate: Date.now(),
      },
      { new: true }
    );

    const students = await Student.find({ busId: bus._id }).populate(
      "parentId"
    );

    for (const student of students) {
      for (const parentId of student.parentId) {
        sendToUser(parentId, {
          type: "location_update",
          data: {
            busId: bus._id,
            busNumber: bus.busNumber,
            location: bus.currentLocation,
            studentId: student._id,
          },
        });
      }
    }

    res.json({
      message: "Location updated successfully",
      location: bus.currentLocation,
    });
  }
);

export const getAssignedStudents = controllerWrapper(
  "getAssignedStudents",
  async (req, res) => {
    const driver = await Driver.findById(req.params.id).populate("busId");

    if (!driver) {
      const error = new Error("Driver not found");
      error.status = 404;
      throw error;
    }

    if (!driver.busId) {
      return res.json({ students: [] });
    }

    const students = await Student.find({ busId: driver.busId._id })
      .populate("parentId", "name phoneNumber")
      .populate("pickupLocation")
      .sort("pickupLocation.order");

    res.json(students);
  }
);

export const updateStudentStatus = controllerWrapper(
  "updateStudentStatus",
  async (req, res) => {
    const { id: driverId, studentId } = req.params;
    const { status } = req.body; // Expect "picked_up" or "dropped_off"

    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res
        .status(404)
        .json({ success: false, message: "Driver not found" });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    if (student.busId.toString() !== driver.busId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Student not assigned to this driver's bus",
      });
    }

    student.status = status;
    await student.save();

    // Notify parents
    for (const parentId of student.parentId) {
      await createNotification(
        parentId,
        `${student.name} has been ${status} by the driver.`
      );
    }

    res.json({
      success: true,
      message: "Student status updated",
      data: student,
    });
  }
);

export const markStopCompleted = controllerWrapper(
  "markStopCompleted",
  async (req, res) => {
    const { id: driverId, stopId } = req.params;

    const driver = await Driver.findById(driverId).populate("busId");
    if (!driver) {
      return res
        .status(404)
        .json({ success: false, message: "Driver not found" });
    }

    const route = await Route.findById(driver.busId.routeId);
    if (!route) {
      return res
        .status(404)
        .json({ success: false, message: "Route not found" });
    }

    const stop = route.stops.id(stopId);
    if (!stop) {
      return res
        .status(404)
        .json({ success: false, message: "Stop not found" });
    }

    stop.status = "completed";
    await route.save();

   
    const students = await Student.find({ busId: driver.busId._id }).populate(
      "parentId"
    );
    for (const student of students) {
      for (const parentId of student.parentId) {
        await createNotification(
          parentId,
          `Stop ${stop.address.name} has been completed.`
        );
      }
    }

    res.json({
      success: true,
      message: "Stop marked as completed",
      data: route,
    });
  }
);
