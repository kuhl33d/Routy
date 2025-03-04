import mongoose from "mongoose";
import { validateObjectIdExists } from "../helpers/helpers.js";

const schoolSchema = new mongoose.Schema(
  {
    website: {
      type: String,
      trim: true,
    },
    adminUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        validate: {
          validator: async (value) =>
            await validateObjectIdExists("User", value),
          message: "Invalid User ID: User does not exist",
        },
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      validate: {
        validator: async (value) => await validateObjectIdExists("User", value),
        message: "Invalid User ID: User does not exist",
      },
    },
  },
  {
    timestamps: true,
  }
);
schoolSchema.set("toJSON", { virtuals: true });
schoolSchema.set("toObject", { virtuals: true });

schoolSchema.virtual("buses", {
  ref: "Bus",
  localField: "_id",
  foreignField: "schoolId",
});
schoolSchema.virtual("routes", {
  ref: "Route",
  localField: "_id",
  foreignField: "schoolId",
});
schoolSchema.virtual("students", {
  ref: "Student",
  localField: "_id",
  foreignField: "schoolId",
});
schoolSchema.virtual("drivers", {
  ref: "Driver",
  localField: "_id",
  foreignField: "schoolId",
});
const School = mongoose.model("School", schoolSchema);

export default School;
