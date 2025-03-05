import mongoose from "mongoose";
import { validateObjectIdExists } from "../helpers/helpers.js";

const parentSchema = new mongoose.Schema(
  {
    children: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        validate: {
          validator: async (value) =>
            await validateObjectIdExists("Student", value),
          message: "Invalid Student ID: Student does not exist",
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

const Parent = mongoose.model("Parent", parentSchema);

export default Parent;
