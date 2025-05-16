const AttendanceSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Invalid student id"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    pickedUp: {
      type: Boolean,
      default: false,
    },
    droppedOff: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Attendance = mongoose.model("Attendance", AttendanceSchema);
export default Attendance;
