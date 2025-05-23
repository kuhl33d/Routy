import Parent from "../models/parent.model.js";
import User from "../models/user.model.js";
import { createNotification } from "../utils/notifications.js";
import { controllerWrapper } from "../utils/wrappers.js";

export const createParent = controllerWrapper(
  "createParent",
  async (req, res) => {
    const { name, email, password, phoneNumber, addresses, children } =
      req.body;

    const user = new User({
      name,
      email,
      password,
      phoneNumber,
      addresses,
      role: "parent",
    });
    await user.save();

    const parent = new Parent({
      userId: user._id,
      children: children || [],
    });
    await parent.save();

    res
      .status(201)
      .json({ success: true, message: "Parent created", data: parent });
  }
);

export const getAllParents = controllerWrapper(
  "getAllParents",
  async (req, res) => {
    const parents = await Parent.find()
      .populate("children")
      .populate({ path: "userId", select: "name" })
      .sort("-createdAt");

    const result = parents.map((parent) => ({
      _id: parent._id,
      name: parent.userId ? parent.userId.name : null,
      children: parent.children,
      userId: parent.userId ? parent.userId._id : null,
      createdAt: parent.createdAt,
      updatedAt: parent.updatedAt,
      __v: parent.__v,
    }));

    res.json(result);
  }
);

export const getParentById = controllerWrapper(
  "getParentById",
  async (req, res) => {
    const { state = "user" } = req.body;
    const parent = await Parent.findOne(
      state === "user" ? { userId: req.params.id } : { _id: req.params.id }
    )
      .populate({
        path: "children",
        populate: {
          path: "userId",
          model: User,
          select:
            "-password -verificationToken -verificationTokenExpiresAt  -active -lastLogin -createdAt -updatedAt -__v",
        },
      })
      .populate({
        path: "userId",
        model: User,
        select:
          "-password -verificationToken -verificationTokenExpiresAt  -active -lastLogin -createdAt -updatedAt -__v",
      });

    if (!parent) {
      const error = new Error("Parent not found");
      error.status = 404;
      throw error;
    }

    res.json(parent);
  }
);

export const updateParent = controllerWrapper(
  "updateParent",
  async (req, res) => {
    const { name, email, phoneNumber, addresses, children } = req.body;
    const parent = await Parent.findById(req.params.id).populate("userId");

    if (!parent) {
      const error = new Error("Parent not found");
      error.status = 404;
      throw error;
    }

    const user = parent.userId;

    if (name) user.name = name;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (addresses) user.addresses = addresses;

    await user.save();

    if (email) {
      await User.findByIdAndUpdate(parent.userId._id, { email });
    }
    res.json({ success: true, message: "Parent Updated", data: parent });
  }
);

export const deleteParent = controllerWrapper(
  "deleteParent",
  async (req, res) => {
    const parent = await Parent.findById(req.params.id).populate("userId");

    if (!parent) {
      const error = new Error("Parent not found");
      error.status = 404;
      throw error;
    }

    const user = parent.userId;

    await User.findByIdAndDelete(user._id);
    await Parent.findByIdAndDelete(req.params.id);

    res.json({ message: "Parent deleted successfully", parent, user });
  }
);

export const getChildrenLocation = controllerWrapper(
  "getChildrenLocation",
  async (req, res) => {
    const parent = await Parent.findById(req.params.id).populate({
      path: "children",
      populate: {
        path: "busId",
        select: "currentLocation busNumber",
      },
    });

    if (!parent) {
      const error = new Error("Parent not found");
      error.status = 404;
      throw error;
    }

    const childrenLocations = parent.children.map((child) => ({
      childId: child._id,
      childName: child.name,
      busNumber: child.busId?.busNumber,
      location: child.busId?.currentLocation,
      status: child.status,
    }));

    res.json(childrenLocations);
  }
);

export const addChild = controllerWrapper("addChild", async (req, res) => {
  const { studentId } = req.body;
  const parent = await Parent.findById(req.params.id);

  if (!parent) {
    const error = new Error("Parent not found");
    error.status = 404;
    throw error;
  }

  parent.children.push(studentId);
  await parent.save();

  res.json({ success: true, message: "Child Added", data: parent });
});

export const removeChild = controllerWrapper(
  "removeChild",
  async (req, res) => {
    const { studentId } = req.body;
    const parent = await Parent.findById(req.params.id);

    if (!parent) {
      const error = new Error("Parent not found");
      error.status = 404;
      throw error;
    }

    parent.children = parent.children.filter(
      (id) => id.toString() !== studentId
    );
    await parent.save();

    res.json({ success: true, message: "Child removed", data: parent });
  }
);

export const updateNotificationPreferences = controllerWrapper(
  "updateNotificationPreferences",
  async (req, res) => {
    const parent = await Parent.findByIdAndUpdate(
      req.params.id,
      { notificationPreferences: req.body },
      { new: true }
    );

    if (!parent) {
      const error = new Error("Parent not found");
      error.status = 404;
      throw error;
    }

    res.json(parent.notificationPreferences);
  }
);

export const updateEmergencyContacts = controllerWrapper(
  "updateEmergencyContacts",
  async (req, res) => {
    const parent = await Parent.findByIdAndUpdate(
      req.params.id,
      { emergencyContacts: req.body.contacts },
      { new: true }
    );

    if (!parent) {
      const error = new Error("Parent not found");
      error.status = 404;
      throw error;
    }

    res.json(parent.emergencyContacts);
  }
);

export const updatePickupPreferences = controllerWrapper(
  "updatePickupPreferences",
  async (req, res) => {
    const parent = await Parent.findByIdAndUpdate(
      req.params.id,
      { pickupPreferences: req.body },
      { new: true }
    );

    if (!parent) {
      const error = new Error("Parent not found");
      error.status = 404;
      throw error;
    }

    res.json(parent.pickupPreferences);
  }
);

export const updateAddress = controllerWrapper(
  "updateAddress",
  async (req, res) => {
    const { addresses } = req.body;

    const parent = await Parent.findById(req.params.id).populate("userId");

    if (!parent) {
      const error = new Error("Parent not found");
      error.status = 404;
      throw error;
    }

    const user = parent.userId;

    // Update user's addresses with the new address IDs
    user.addresses = addresses;
    await user.save();

    // Populate the updated addresses to include detailed information
    await user.populate("addresses");

    res.json({
      success: true,
      message: "Addresses updated successfully",
      addresses: user.addresses,
    });
  }
);
