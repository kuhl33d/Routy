const mongoose = require("mongoose");
import validateObjectIdExists from "../helpers/helpers.js";

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  parentId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Parent ID is required"],
      validate: {
        validator: async (value) => await validateObjectIdExists("User", value),
        message: "Invalid Parent ID: Parent does not exist",
      },
    },
  ],
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
    required: true,
    validate: {
      validator: async (value) => await validateObjectIdExists("School", value),
      message: "Invalid School ID: School does not exist",
    },
  },
  status: {
    type: String,
    enum: ["Waiting", "Picked Up", "Dropped Off", "Idle", "Absent"],
    default: "Waiting",
  },
  busId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bus",
    validate: {
      validator: async (value) => await validateObjectIdExists("Bus", value),
      message: "Invalid Bus ID: Bus does not exist",
    },
    required: [true, "Bus ID is required"],
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
    required: [true, "Age is required"],
  },
  grade: {
    type: String,
    required: [true, "Grade is required"],
  },
  enrolled: {
    type: Boolean,
    default: false,
  },
});

const Student = mongoose.model("Student", studentSchema);

export default Student;
