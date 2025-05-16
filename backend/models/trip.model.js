import mongoose from "mongoose";
import { validateObjectIdExists } from "../helpers/helpers.js";
import { stat } from "fs";

const tripSchema = new mongoose.Schema(
  {
    busId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      validate: {
        validator: async function (value) {
          return await validateObjectIdExists("Bus", value);
        },
        message: "Invalid Bus ID: Bus does not exist",
      },
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      validate: {
        validator: async function (value) {
          return await validateObjectIdExists("Driver", value);
        },
        message: "Invalid Driver ID: Driver does not exist",
      },
    },
    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      validate: {
        validator: async function (value) {
          return await validateObjectIdExists("Route", value);
        },
        message: "Invalid Route ID: Route does not exist",
      },
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      validate: {
        validator: async function (value) {
          return await validateObjectIdExists("School", value);
        },
        message: "Invalid School ID: School does not exist",
      },
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        validate: {
          validator: async function (value) {
            return await validateObjectIdExists("Student", value);
          },
          message: "Invalid Student ID: Student does not exist",
        },
      },
    ],
    status: {
      type: String,
      // enum: ["Waiting", "Picked Up", "Dropped Off", "Idle", "Absent"],
      default: "Idle",
    },
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
    notifications: [
      {
        notification: {
          type: String,
        },
        time: {
          type: Date,
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          validate: {
            validator: async function (value) {
              return await validateObjectIdExists("User", value);
            },
            message: "Invalid User ID: User does not exist",
          },
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Trip = mongoose.model("Trip", tripSchema);

export default Trip;
