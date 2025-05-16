import mongoose from "mongoose";
import { validateObjectIdExists } from "../helpers/helpers.js";

const studentSchema = new mongoose.Schema(
  {
    parentId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Parent",
        // required: [true, "Parent ID is required"],
        validate: {
          validator: async (value) =>
            await validateObjectIdExists("Parent", value),
          message: "Invalid Parent ID: Parent does not exist",
        },
      },
    ],
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      // required: true,
      validate: {
        validator: async (value) =>
          await validateObjectIdExists("School", value),
        message: "Invalid School ID: School does not exist",
      },
    },
    status: {
      type: String,
      enum: ["Waiting", "Picked Up", "Dropped Off", "Idle", "Absent"],
      default: "Waiting",
    },
    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      validate: {
        validator: async (value) =>
          await validateObjectIdExists("Route", value),
        message: "Invalid Route ID: Route does not exist",
      },
      // required: [true, "Route ID is required"],
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
    pickupLocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      validate: {
        validator: async (value) =>
          await validateObjectIdExists("Address", value),
        message: "Invalid Address ID: Address does not exist",
      },
    },
    age: {
      type: Number,
      // required: [true, "Age is required"],
    },
    grade: {
      type: String,
      // required: [true, "Grade is required"],
    },
    enrolled: {
      type: Boolean,
      default: false,
    },
    fees: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);

export default Student;
