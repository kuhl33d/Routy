import mongoose from "mongoose";
import { validateObjectIdExists } from "../helpers/helpers.js";

const Schema = mongoose.Schema;

const driverSchema = new Schema(
  {
    licenseNumber: {
      type: String,
      // required: [true, "License Number is required"],
      unique: true,
    },
    vehicleType: {
      type: String,
      // required: [true, "Vehicle Type is required"],
    },
    busId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      validate: {
        validator: async (value) => await validateObjectIdExists("Bus", value),
        message: "Invalid Bus ID: Bus does not exist",
      },
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      validate: {
        validator: async (value) => await validateObjectIdExists("User", value),
        message: "Invalid User ID: User does not exist",
      },
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      validate: {
        validator: async (value) =>
          await validateObjectIdExists("School", value),
        message: "Invalid School ID: School does not exist",
      },
    },
  },
  {
    timestamps: true,
  }
);

const Driver = mongoose.model("Driver", driverSchema);

export default Driver;
