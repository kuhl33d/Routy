import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No access token provided",
      });
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: "User not found" });
      }

      req.user = user;

      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Unauthorized - Access token expired" });
      }
      throw error;
    }
  } catch (error) {
    console.log("Error in protectRoute middleware", error.message);
    return res
      .status(401)
      .json({ message: "Unauthorized - Invalid access token" });
  }
};

export const roleRoute = (role) => {
  return (req, res, next) => {
    if (req.user && req.user.role === role) next();
    else {
      return res
        .status(403)
        .json({ message: "Access denied - You Are Not Authorized" });
    }
  };
};
export const mixRoute = (roles) => {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) next();
    else {
      return res
        .status(403)
        .json({ message: "Access denied - You Are Not Authorized" });
    }
  };
};

export const driverRoute = roleRoute("driver");
export const schoolRoute = roleRoute("school");
export const parentRoute = roleRoute("parent");
export const adminRoute = roleRoute("admin");
