import Route from "../models/route.model.js";
import { geocodeAddress } from "../utils/geocoding.js";
import { controllerWrapper } from "../utils/wrappers.js";
import mongoose from "mongoose";
import { getSchoolIdbyUserId } from "../utils/getSchoolIdbyUserId.js";
export const createRoute = controllerWrapper(
  "createRoute",
  async (req, res) => {
    const { name, schoolId } = req.body;

    const route = await Route.create({
      name,
      schoolId,
    });

    return res.status(201).json({ success: true, data: route });
  }
);

export const getAllRoutes = controllerWrapper(
  "getAllRoutes",
  async (req, res) => {
    const user = req.user;

    let schoolId = req.query.schoolId;

    // Fallback if not provided in query
    if (!schoolId && user.role === "school") {
      schoolId = await getSchoolIdbyUserId(user._id);
    }

    if (!schoolId) {
      return res.status(400).json({
        success: false,
        message: "Missing schoolId for school user",
      });
    }

    const routes = await Route.find({ schoolId }).populate("stops");

    return res.status(200).json({ success: true, routes });
  }
);
export const getRouteById = controllerWrapper(
  "getRouteById",
  async (req, res) => {
    const route = await Route.findById(req.params.id)
      .populate("startLocation")
      .populate("endLocation")
      .populate("stops.address")
      .populate("busses", "busNumber");

    if (!route) {
      const error = new Error("Route not found");
      error.status = 404;
      throw error;
    }

    res.json(route);
  }
);

export const updateRoute = controllerWrapper(
  "updateRoute",
  async (req, res) => {
    const route = await Route.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!route) {
      const error = new Error("Route not found");
      error.status = 404;
      throw error;
    }

    res.json(route);
  }
);

export const deleteRoute = controllerWrapper(
  "deleteRoute",
  async (req, res) => {
    const route = await Route.findByIdAndDelete(req.params.id);

    if (!route) {
      return res
        .status(404)
        .json({ success: false, message: "Route not found" });
    }

    // res.json({ message: "Route deleted successfully" });
    return res
      .status(200)
      .json({ success: true, message: "Route deleted successfully" });
  }
);

export const optimizeRoute = controllerWrapper(
  "optimizeRoute",
  async (req, res) => {
    const route = await Route.findById(req.params.id);
    if (!route) {
      const error = new Error("Route not found");
      error.status = 404;
      throw error;
    }

    res.json(route);
  }
);
