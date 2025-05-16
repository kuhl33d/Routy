import mongoose from "mongoose";
import { validateObjectIdExists } from "../helpers/helpers.js";

const routeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    distance: {
      type: Number,
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
      validate: {
        validator: async (value) =>
          await validateObjectIdExists("School", value),
        message: "Invalid School ID: School does not exist",
      },
    },
    duration: {
      type: Number,
    },
    startLocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      validate: {
        validator: async (value) =>
          await validateObjectIdExists("Address", value),
        message: "Invalid Address ID: Address does not exist",
      },
      required: true,
    },
    endLocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      validate: {
        validator: async (value) =>
          await validateObjectIdExists("Address", value),
        message: "Invalid Address ID: Address does not exist",
      },
      required: true,
    },
    busses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bus",
      },
    ],
    stops: [
      {
        address: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Address",
          validate: {
            validator: async (value) =>
              await validateObjectIdExists("Address", value),
            message: "Invalid Address ID: Address does not exist",
          },
          required: true,
        },
        stopName: {
          type: String,
          required: true,
        },
        order: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Route = mongoose.model("Route", routeSchema);

export default Route;
