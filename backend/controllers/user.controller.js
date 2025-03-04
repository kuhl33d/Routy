import User from "../models/user.model.js";
import Driver from "../models/driver.model.js";
import Parent from "../models/parent.model.js";
import School from "../models/school.model.js";
import Notification from "../models/notification.model.js";
import { createNotification } from "../utils/notifications.js";
import { controllerWrapper } from "../utils/wrappers.js";
import { paginateQuery } from "../helpers/pagination.js";

export const createUser = controllerWrapper("createUser", async (req, res) => {
  const { email, password, name, role, phoneNumber, address } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error("Email already registered");
    error.status = 400;
    throw error;
  }

  const user = new User({
    email,
    password,
    name,
    role: role || "user",
    phones: phoneNumber ? [phoneNumber] : [],
    addresses: address ? [address] : [],
    isVerified: true,
    active: true,
  });

  await user.save();

  if (role) {
    switch (role) {
      case "driver":
        await Driver.create({
          userId: user._id,
          name,
          phoneNumber: phoneNumber || [],
        });
        break;
      case "parent":
        await Parent.create({
          userId: user._id,
          name,
          phone: phoneNumber || [],
          address: address || null,
        });
        break;
      case "school":
        await School.create({
          name,
          adminUsers: [user._id],
          phoneNumber: phoneNumber || [],
          address: address || null,
        });
        break;
    }
  }

  await createNotification(
    user._id,
    "Welcome to the system! Your account has been created by an administrator."
  );

  const userResponse = user.toObject();
  delete userResponse.password;

  res.status(201).json({
    message: "User created successfully",
    user: userResponse,
  });
});

export const getAllUsers = controllerWrapper(
  "getAllUsers",
  async (req, res) => {
    const { page = 1, limit = 10, role, search } = req.query;

    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .select("-password")
      .sort("-createdAt")
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit),
      },
    });
  }
);

export const getUserById = controllerWrapper(
  "getUserById",
  async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    res.json(user);
  }
);

export const updateUser = controllerWrapper("updateUser", async (req, res) => {
  const { name, email, role, active } = req.body;

  const user = await User.findById(req.params.id);
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("Email already in use");
      error.status = 400;
      throw error;
    }
  }

  if (name) user.name = name;
  if (email) user.email = email;
  if (role) user.role = role;
  if (typeof active === "boolean") user.active = active;

  await user.save();

  if (role && role !== user.role) {
    await createNotification(user._id, `Your role has been updated to ${role}`);
  }

  res.json(user);
});

export const deleteUser = controllerWrapper("deleteUser", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  user.active = false;
  user.deleted = true;
  await user.save();

  res.json({ message: "User deleted successfully" });
});

export const getUserNotifications = controllerWrapper(
  "getUserNotifications",
  async (req, res) => {
    const { page, limit } = req.body;
    const notifications = await paginateQuery(
      page,
      limit,
      Notification.find({ userId: req.params.userId }).sort("-createdAt")
    );
    return res.status(!notifications.success ? 400 : 200).json(notifications);
  }
);

export const markNotificationRead = controllerWrapper(
  "markNotificationRead",
  async (req, res) => {
    const { notificationId } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId: req.user.id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      const error = new Error("Notification not found");
      error.status = 404;
      throw error;
    }

    res.json(notification);
  }
);
