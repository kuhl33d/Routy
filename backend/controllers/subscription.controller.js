import { paginateQuery } from "../helpers/pagination.js";
import Subscription from "../models/subscription.model.js";
import { controllerWrapper } from "../utils/wrappers.js";

export const createNewSubscription = controllerWrapper(
  "createNewSubscription",
  async (req, res) => {
    const { plan, busses, price, startDate, endData, schoolId } = req.body;
    const subscription = await Subscription.create({
      plan,
      price,
      endData,
      startDate,
      schoolId,
      busses,
    });
    res.status(201).json({ success: true, data: subscription });
  }
);
// get all subscriptions
export const getAllSubscriptions = controllerWrapper(
  "getAllSubscriptions",
  async (req, res) => {
    const query =
      req.user.role === "admin" ? {} : { schoolId: req.query.schoolId };
    const { page, limit } = req.query;
    const subscriptions = await paginateQuery(
      page,
      limit,
      Subscription.find(query)
    );
    return res.status(!subscriptions.success ? 400 : 200).json(subscriptions);
  }
);
// get subscription by id
export const getSubscriptionById = controllerWrapper(
  "getSubscriptionById",
  async (req, res) => {
    const subscription = await Subscription.findById(req.params.subscriptionId);

    if (!subscription) {
      return res
        .status(404)
        .json({ success: false, message: "Subscription not found" });
    }
    if (
      req.user.role === "school" &&
      subscription._doc.schoolId !== req.query.schoolId
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this subscription",
      });
    }
    res.status(200).json({ success: true, data: subscription });
  }
);

// update subscription
export const updateSubscription = controllerWrapper(
  "updateSubscription",
  async (req, res) => {
    const subscription = await Subscription.findByIdAndUpdate(
      req.params.subscriptionId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!subscription) {
      return res
        .status(404)
        .json({ success: false, message: "Subscription not found" });
    }
    res.status(200).json({ success: true, data: subscription });
  }
);

// delete subscription
export const deleteSubscription = controllerWrapper(
  "deleteSubscription",
  async (req, res) => {
    const subscription = await Subscription.findByIdAndDelete(
      req.params.subscriptionId
    );

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Subscription deleted successfully",
    });
  }
);
