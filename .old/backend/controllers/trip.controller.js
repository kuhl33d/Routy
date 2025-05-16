import Trip from "../models/trip.model.js";
import Driver from "../models/driver.model.js";
import School from "../models/school.model.js";
import Parent from "../models/parent.model.js";
import Student from "../models/student.model.js";
import { controllerWrapper } from "../utils/wrappers.js";
import User from "../models/user.model.js";

export const createTrip = controllerWrapper("createTrip", async (req, res) => {
  const { driverId, schoolId, routeId } = req.body;
  const trip = await Trip.create({
    driverId,
    schoolId,
    routeId,
  });
  res.status(201).json({ success: true, trip });
});
export const startTrip = controllerWrapper("startTrip", async (req, res) => {
  const { tripId } = req.params;
  const trip = await Trip.findById(tripId);

  if (!trip) {
    return res.status(404).json({ success: false, message: "Trip not found" });
  }

  trip.status = "Started";
  await trip.save();
  // send notifications to parents and students and school

  return res.status(200).json(trip);
});

export const endTrip = controllerWrapper("endTrip", async (req, res) => {
  const { tripId } = req.params;
  const trip = await Trip.findById(tripId);

  if (!trip) {
    return res.status(404).json({ success: false, message: "Trip not found" });
  }

  trip.status = "Ended";
  await trip.save();
  // send notifications to parents and students and school

  return res.status(200).json(trip);
});

export const getAllTrips = controllerWrapper(
  "getAllTrips",
  async (req, res) => {
    let query = {};
    switch (req.user.role) {
      case "driver":
        const driver = await Driver.findOne({ userId: req.user._id });
        query = { driverId: driver._id };
        break;
      case "school":
        const school = await School.findOne({ userId: req.user._id });
        query = { schoolId: school._id };
        break;
      case "admin":
        query = {};
        break;
      case "parent":
        const parent = await Parent.findOne({ userId: req.user._id }).populate(
          "children"
        );

        console.log("children", parent.children);
        let routes = [];
        parent.children.forEach((child) => routes.push(child.routeId));
        query = { routeId: { $in: routes } };
        break;
      case "student":
        const student = Student.findOne({ userId: req.user._id });
        query = { routeId: student.routeId };
        break;
      default:
        break;
    }

    const trips = await Trip.find(query)
      .populate({
        path: "driverId",
        populate: {
          path: "userId",
          model: User,
          select: "name email",
        },
      })
      .populate({
        path: "schoolId",
        populate: {
          path: "userId",
          model: User,
          select: "name email",
        },
      })
      .populate("routeId")
      .populate({
        path: "students",
        populate: {
          path: "userId",
          model: User,
          select: "name email",
        },
      });

    if (!trips)
      return res
        .status(404)
        .json({ success: false, message: "Trip not found" });

    return res.status(200).json(trips);
  }
);

export const getTripsById = controllerWrapper(
  "getTripsById",
  async (req, res) => {
    const trips = await Trip.findById(req.params.id)
      .populate({
        path: "driverId",
        populate: {
          path: "userId",
          model: User,
          select: "name email",
        },
      })
      .populate({
        path: "schoolId",
        populate: {
          path: "userId",
          model: User,
          select: "name email",
        },
      })
      .populate("routeId")
      .populate({
        path: "students",
        populate: {
          path: "userId",
          model: User,
          select: "name email",
        },
      });

    if (!trips) {
      return res
        .status(404)
        .json({ success: false, message: "Trip not found" });
    }

    return res.status(200).json(trips);
  }
);

export const pickStudent = controllerWrapper(
  "pickStudent",
  async (req, res) => {
    const { tripId, studentId } = req.params;

    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res
        .status(404)
        .json({ success: false, message: "Trip not found" });
    }

    trip.students.push(studentId);
    await trip.save();
    // send notifications to parents and students and school
    // edit the student state in the student collection to picked

    return res.status(200).json(trip);
  }
);

export const deleteTrip = controllerWrapper("deleteTrip", async (req, res) => {
  const trips = await Trip.findById(req.params.id);

  if (!trips) {
    return res.status(404).json({ success: false, message: "Trip not found" });
  }

  await Trip.findByIdAndDelete(req.params.id);

  return res
    .status(200)
    .json({ success: true, message: "Trip deleted successfully" });
});
