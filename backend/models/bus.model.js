import mongoose from "mongoose";
import { validateObjectIdExists } from "../helpers/helpers.js";

const busSchema = new mongoose.Schema(
  {
    busNumber: {
      type: String,
      required: [true, "Bus number is required"],
      unique: [true, "Bus number already in use"],
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      validate: {
        validator: async (value) =>
          await validateObjectIdExists("School", value),
        message: "Invalid school id",
      },
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      validate: {
        validator: async (value) =>
          await validateObjectIdExists("Driver", value),
        message: "Invalid driver id",
      },
    },
    routeId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    capacity: {
      type: Number,
      required: [true, "Capacity is required"],
    },
    currentLocation: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    status: {
      type: String,
      enum: ["Idle", "Going", "Going Back", "Arrived", "Inactive"],
      default: "Idle",
    },
  },
  {
    timestamps: true,
  }
);

const Bus = mongoose.model("Bus", busSchema);

export default Bus;
