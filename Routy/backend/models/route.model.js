const mongoose = require("mongoose");
const { validateObjectIdExists } = require("../helpers/helpers");

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
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        validate: {
          validator: async (value) =>
            await validateObjectIdExists("Address", value),
          message: "Invalid Address ID: Address does not exist",
        },
        stopName: { type: String, required: true },
        order: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

const Route = mongoose.model("Route", routeSchema);

export default Route;
