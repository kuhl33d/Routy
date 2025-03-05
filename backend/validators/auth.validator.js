import Joi from "joi";

const passwordLength = 6;

export const signupValidationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),
  password: Joi.string()
    .min(passwordLength)
    .required()
    .messages({
      "string.min": `Password must be at least ${passwordLength} characters long`,
      "any.required": "Password is required",
    }),
  name: Joi.string().min(3).required().messages({
    "string.min": "Name must be at least 3 characters long",
    "any.required": "Name is required",
  }),
  // make the phone as array of strings not only one string and at least one phone number
});

export const loginValidationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),
  password: Joi.string()
    .min(passwordLength)
    .required()
    .messages({
      "string.min": `Password must be at least ${passwordLength} characters long`,
      "any.required": "Password is required",
    }),
});

export const emailVerificationSchema = Joi.object({
  code: Joi.string().length(6).required().messages({
    "string.length": "Verification code must be 6 characters long",
    "any.required": "Verification code is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),
});
export const newAddressSchema = Joi.object({
  address: Joi.string().required().messages({
    "any.required": "Address is required",
  }),
  city: Joi.string().required().messages({
    "any.required": "City is required",
  }),
  // zipCode: Joi.string(),
  // notes: Joi.string(),
});
