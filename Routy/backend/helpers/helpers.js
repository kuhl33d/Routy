import mongoose from "mongoose";

export const validId = (paramNames) => {
  return (req, res, next) => {
    // If paramNames is a string, convert it to an array
    if (typeof paramNames === "string") paramNames = [paramNames];

    // Validate each parameter
    paramNames.forEach((paramName) => {
      if (!isValidId(req.params[paramName]))
        return res
          .status(400)
          .json({ success: false, message: `Invalid ${paramName} id` });
    });

    // If all IDs are valid, proceed to the next middleware/controller
    next();
  };
};

export const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

export const validateObjectIdExists = async function (modelName, value) {
  if (!mongoose.Types.ObjectId.isValid(value)) return false;
  const exists = await mongoose.model(modelName).exists({ _id: value });
  return exists !== null;
};
