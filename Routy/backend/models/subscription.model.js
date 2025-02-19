import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    plan: {
      type: String,
      required: [true, "Plan is required"],
      default: "Free",
      // default: "Free",
      //       enum: ["Free", "Pro", "Enterprise"],
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
      default: () => Date.now() + 130 * 24 * 60 * 60 * 1000, // 130 days
    },
    active: { type: Boolean, default: true },
    amount: { type: Number, default: 0, min: 0 },
    paymentDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

subscriptionSchema.index({ active: 1 });
subscriptionSchema.index({ plan: 1 });
subscriptionSchema.index({ endDate: 1 });

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
