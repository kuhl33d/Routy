import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: [true, "Email already in use"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    phones: [
      {
        type: String,
        required: [true, "Phone number is required"],
        unique: [true, "Phone number already in use"],
        validate: {
          validator: function (phone) {
            return /^\d{10}$/.test(phone);
          },
          message: (props) => `${props.value} is not a valid phone number!`,
        },
      },
    ],
    addresses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        validate: {
          validator: async (value) => await ("Address", value),
          message: "Invalid Address ID: Brand does not exist",
        },
      },
    ],
    role: {
      type: String,
      enum: ["user", "school", "parent", "admin", "driver"],
      default: "user",
    },
    deleted: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
  },
  { timestamps: true }
);

// Pre-save hook to hash password before saving to database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    console.error("Error hashing password:", error);
    next(error);
  }
});

userSchema.methods.generateVerificationToken = function () {
  const token = crypto.randomBytes(20).toString("hex");
  this.verificationToken = crypto
    .createHash("sha256") // define the hash algorithm
    .update(token) // for input
    .digest("hex"); // for output
  this.verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  return token; // Send raw token to the user
};

userSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error("Error comparing passwords " + error.message);
  }
};

userSchema.index({ email: 1, phone: 1, role: 1, isVerified: 1 }); // for searching by email and phone

const User = mongoose.model("User", userSchema);
export default User;
