const mongoose = require("mongoose");
const { validateObjectIdExists } = require("../helpers/helpers");

const parentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: [
      {
        type: String,
        required: [true, "Phone number is required"],
        trim: true,
      },
    ],
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: [true, "Address is required"],
      trim: true,
    },
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
  },
  {
    timestamps: true,
  }
);

const Parent = mongoose.model("Parent", parentSchema);

module.exports = Parent;
