import mongoose from "mongoose";
const AddressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    latitude: { type: Number, required: [true, "Latitude is required"] },
    longitude: { type: Number, required: [true, "Longitude is required"] },
    address: { type: String, required: [true, "Address is required"] },
    city: { type: String, required: [true, "City is required"] },
    zipCode: { type: String },
    notes: String,
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
AddressSchema.index({ userId: 1, deleted: 1 });

const Address = mongoose.model("Address", AddressSchema);
export default Address;
