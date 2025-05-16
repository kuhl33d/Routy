import mongoose from "mongoose";
import { validateObjectIdExists } from "../helpers/helpers.js";

const subscriptionSchema = new mongoose.Schema(
  {
    plan: {
      type: String,
      default: "Free",
    },
    busses: {
      type: Number,
      min: 0,
      default: 0,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      default: () => Date.now() + 130 * 24 * 60 * 60 * 1000, // 130 days
    },
    active: { type: Boolean, default: true },
    price: { type: Number, default: 0, min: 0 },
    paymentDate: { type: Date, default: Date.now },
    description: { type: String, default: "" },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: [true, "School is required"],
      validate: {
        validator: async (value) =>
          await validateObjectIdExists("School", value),
        message: "Invalid School ID: School does not exist",
      },
    },
  },
  { timestamps: true }
);

subscriptionSchema.index({ active: 1 });
subscriptionSchema.index({ plan: 1 });
subscriptionSchema.index({ endDate: 1 });

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
