// const mongoose = require("mongoose");
import mongoose from "mongoose";
// const { validateObjectIdExists } = require("../helpers/helpers.js");
import { validateObjectIdExists } from "../helpers/helpers.js";
const schoolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      validate: {
        validator: async (value) =>
          await validateObjectIdExists("Address", value),
        message: "Invalid Address ID: Address does not exist",
      },
      required: [true, "Address is required"],
    },
    phoneNumber: [
      {
        type: String,
        required: [true, "Phone number is required"],
        trim: true,
      },
    ],
    email: [
      {
        type: String,
        trim: true,
      },
    ],
    adminEmails: [
      {
        type: String,
        required: [true, "Admin email is required"],
      },
    ],
    website: {
      type: String,
      trim: true,
    },
    buses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bus",
        validate: {
          validator: async (value) =>
            await validateObjectIdExists("Bus", value),
          message: "Invalid Bus ID: Brand does not exist",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const School = mongoose.model("School", schoolSchema);

export default School;
