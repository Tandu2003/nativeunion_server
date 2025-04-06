const Joi = require("joi");

const updateUserSchema = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  country: Joi.string().optional(),
  company: Joi.string().optional(),
  phoneNumber: Joi.string().optional(),
  address: Joi.array().items(Joi.string().allow("", null)).max(2).optional().messages({
    "array.max": "Only 2 addresses are allowed",
  }),
});

const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required().messages({
    "string.empty": "Old password is required",
  }),
  newPassword: Joi.string().min(6).required().messages({
    "string.min": "New password must be at least 6 characters",
    "string.empty": "New password is required",
  }),
});

module.exports = {
  updateUserSchema,
  changePasswordSchema,
};
