const mongoose = require("mongoose");
const { validateObjectIdExists } = require("../helpers/helpers");

const Schema = mongoose.Schema;

const driverSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    licenseNumber: {
      type: String,
      required: [true, "License Number is required"],
      unique: true,
    },
    vehicleType: {
      type: String,
      required: [true, "Vehicle Type is required"],
    },
    phoneNumber: [
      {
        type: String,
        required: [true, "Phone number is required"],
      },
    ],
    busId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      validate: {
        validator: async (value) => await validateObjectIdExists("Bus", value),
        message: "Invalid Bus ID: Bus does not exist",
      },
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Driver = mongoose.model("Driver", driverSchema);

module.exports = Driver;
