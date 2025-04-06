const Joi = require("joi");

const registerValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters.",
    "any.required": "Password is required.",
  }),
  firstName: Joi.string().required().messages({
    "any.required": "First name is required.",
  }),
  lastName: Joi.string().required().messages({
    "any.required": "Last name is required.",
  }),
});

const loginValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required.",
  }),
});

module.exports = { registerValidation, loginValidation };
