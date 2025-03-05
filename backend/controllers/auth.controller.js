import crypto from "crypto";
import User from "../models/user.model.js";
import Address from "../models/address.model.js";
import { paginateQuery } from "../helpers/pagination.js";
import {
  loginValidationSchema,
  signupValidationSchema,
} from "../validators/auth.validator.js";
import { generateTokenAndSetCookie } from "../middleware/verifyToken.js";
import { controllerWrapper } from "../utils/wrappers.js";
import School from "../models/school.model.js";
import Parent from "../models/parent.model.js";
import Driver from "../models/driver.model.js";
import Student from "../models/student.model.js";
export const signup = controllerWrapper("signup", async (req, res) => {
  const { email, password, name, phoneNumber, role } = req.body;
  console.log("req ", req.body);

  if (await User.findOne({ email }))
    return res
      .status(400)
      .json({ success: false, message: "User already exists" });

  const verificationToken = crypto.randomBytes(3).toString("hex").toUpperCase();

  const user = new User({
    role,
    email,
    password,
    name,
    phoneNumber,
    verificationToken,
    verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  });

  await user.save();

  generateTokenAndSetCookie(res, user._id);
  switch (role) {
    case "school":
      await School.create({ userId: user._id });
      break;
    case "driver":
      await Driver.create({ userId: user._id });
      break;
    case "parent":
      await Parent.create({ userId: user._id });
      break;

    case "student":
      await Student.create({ userId: user._id });
      break;
  }

  res.status(201).json({
    success: true,
    message: "User created successfully",
    user: {
      ...user._doc,
      password: undefined,
    },
  });
});

export const reSendVerificationEmail = controllerWrapper(
  "reSendVerificationEmail",
  async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "User already verified" });
    }

    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    user.verificationToken = verificationToken;
    user.verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    await user.save();

    res.status(200).json({
      success: true,
      message: "Verification email sent successfully",
    });
  }
);

export const verifyEmail = controllerWrapper(
  "verifyEmail",
  async (req, res) => {
    const { code, email } = req.body;
    const user = await User.findOne({
      verificationToken: code,
      email,
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code or User not found",
      });
    }
    if (user.verificationTokenExpiresAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Expired verification code",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  }
);

export const login = controllerWrapper("login", async (req, res) => {
  const { email, phone, password } = req.body;
  let user;
  if (email) user = await User.findOne({ email });
  // if (phone) user = await User.findOne({ phones: { $in: [phone] } });
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid credentials",
    });
  }
  console.log("user ", user);

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid)
    return res
      .status(400)
      .json({ success: false, message: "Invalid credentials" });

  generateTokenAndSetCookie(res, user._id);

  user.lastLogin = new Date();
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Logged in successfully",
    user: {
      ...user._doc,
      password: undefined,
    },
  });
});

export const logout = controllerWrapper("logout", async (req, res) => {
  res.clearCookie("accessToken");
  return res
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
});

export const forgotPassword = controllerWrapper(
  "forgotPassword",
  async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
      resetToken, // !Danger! must be send via email
    });
  }
);

export const resetPassword = controllerWrapper(
  "resetPassword",
  async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  }
);

export const makeNewAddress = controllerWrapper(
  "makeNewAddress",
  async (req, res) => {
    const { latitude, longitude, address, city, zipCode, notes } = req.body;

    if (!address || !city) {
      return res
        .status(400)
        .json({ success: false, message: "Address and city are required" });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    const newAddress = new Address({
      latitude,
      longitude,
      address,
      city,
      zipCode,
      notes,
      userId: req.user._id,
    });
    await newAddress.save();
    user.addresses.push(newAddress._id);
    await user.save();
    res
      .status(201)
      .json({ success: true, message: "Address added", data: newAddress });
  }
);

export const deleteAddress = controllerWrapper(
  "deleteAddress",
  async (req, res) => {
    const { addressId } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    if (!addressId) {
      return res
        .status(400)
        .json({ success: false, message: "Address ID is required" });
    }
    const address = await Address.findById(addressId);
    if (!address) {
      return res
        .status(400)
        .json({ success: false, message: "Address not found" });
    }
    if (address.userId.toString() !== req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You are not authorized to delete this address",
      });
    }
    await address.deleteOne();
    user.addresses.pull(addressId);
    await user.save();
    res.status(200).json({ success: true, message: "Address deleted" });
  }
);

export const updateAddress = controllerWrapper(
  "updateAddress",
  async (req, res) => {
    const { addressId } = req.params;
    const { address, city, zipCode, notes } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const addressToUpdate = await Address.findById(addressId);
    if (!addressToUpdate) {
      return res
        .status(400)
        .json({ success: false, message: "Address not found or Address Id" });
    }

    if (addressToUpdate.userId.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own addresses",
      });
    }

    addressToUpdate.address = address || addressToUpdate.address;
    addressToUpdate.city = city || addressToUpdate.city;
    addressToUpdate.zipCode = zipCode || addressToUpdate.zipCode;
    addressToUpdate.notes = notes || addressToUpdate.notes;

    await addressToUpdate.save();

    res
      .status(200)
      .json({ success: true, message: "Address updated successfully" });
  }
);

export const getAddresses = controllerWrapper(
  "getAddresses",
  async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    const addresses = await Address.find({ userId: user._id, deleted: false });
    res.status(200).json({ success: true, addresses });
  }
);

export const getAllUsers = controllerWrapper(
  "getAllUsers",
  async (req, res) => {
    const { page, limit, role } = req.query;
    const query = role ? User.find({ role }) : User.find({});
    const users = await paginateQuery(page, limit, query);
    if (!users.success) return res.status(400).json(users);
    res.status(200).json(users);
  }
);

export const getAllUsersType = controllerWrapper(
  "getAllUsersType",
  async (req, res) => {
    const { page, limit, type } = req.body;
    const query = User.find({ role: type });
    const users = await paginateQuery(page, limit, query);
    if (!users.success) return res.status(400).json(users);
    res.status(200).json(users);
  }
);

export const updateUser = controllerWrapper("updateUser", async (req, res) => {
  const { userId } = req.params;
  const { updateData } = req.body;

  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "User ID is required" });
  }

  if (!updateData || Object.keys(updateData).length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No data provided to update" });
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  return res.status(200).json({ success: true, user: updatedUser });
});

export const safeDeleteUser = controllerWrapper(
  "safeDeleteUser",
  async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { deleted: true },
      { new: true }
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "User marked as deleted" });
  }
);

export const finalDeleteUser = controllerWrapper(
  "finalDeleteUser",
  async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "User permanently deleted" });
  }
);
