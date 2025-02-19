const mongoose = require("mongoose");
import validateObjectIdExists from "../helpers/helpers";

const busSchema = new mongoose.Schema(
  {
    busNumber: {
      type: String,
      required: [true, "Bus number is required"],
      unique: [true, "Bus number already in use"],
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Driver is required"],
      validate: {
        validator: async (value) => await validateObjectIdExists("User", value),
        message: "Invalid driver id",
      },
    },
    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Route is required"],
    },
    capacity: {
      type: Number,
      required: [true, "Capacity is required"],
    },
    currentPassengers: {
      type: Number,
      default: 0,
    },
    currentLocation: {
      latitude: { type: Number, required: [true, "Latitude is required"] },
      longitude: { type: Number, required: [true, "Longitude is required"] },
    },
    status: {
      type: String,
      enum: ["Idle", "On Route", "Arrived", "Inactive"],
      default: "Idle",
    },
    studentsOnBoard: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
          validate: {
            validator: async (value) =>
              await validateObjectIdExists("Student", value),
            message: "Invalid student id",
          },
        },
        pickedUp: { type: Boolean, default: false },
        droppedOff: { type: Boolean, default: false },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Bus = mongoose.model("Bus", busSchema);

module.exports = Bus;
