import Route from "../models/route.model.js";
import { geocodeAddress } from "../utils/geocoding.js";
import { controllerWrapper } from "../utils/wrappers.js";
import mongoose from "mongoose";

export const createRoute = controllerWrapper(
  "createRoute",
  async (req, res) => {
    const { name, startLocation, endLocation, stops, schoolId } = req.body;

    const route = await Route.create({
      name,
      startLocation: new mongoose.Types.ObjectId(startLocation),
      endLocation: new mongoose.Types.ObjectId(endLocation),
      stops,
      schoolId,
    });

    return res.status(201).json({ success: true, route });
  }
);

export const getAllRoutes = controllerWrapper(
  "getAllRoutes",
  async (req, res) => {
    const routes = await Route.find()
      .populate("startLocation")
      .populate("endLocation")
      .populate("stops.address")
      .populate("busses", "busNumber")
      .sort("-createdAt");
    res.json(routes);
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
      const error = new Error("Route not found");
      error.status = 404;
      throw error;
    }

    res.json({ message: "Route deleted successfully" });
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
