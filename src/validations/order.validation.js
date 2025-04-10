const Joi = require("joi");

const createOrderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        product: Joi.string().required().messages({
          "any.required": "Product ID is required",
        }),
        quantity: Joi.number().min(1).required().messages({
          "number.min": "Quantity must be at least 1",
          "any.required": "Quantity is required",
        }),
        color: Joi.string().required().messages({
          "any.required": "Color is required",
        }),
        price: Joi.number().required().messages({
          "any.required": "Price is required",
        }),
      })
    )
    .required()
    .messages({
      "any.required": "Order items are required",
    }),
  shippingAddress: Joi.object({
    fullName: Joi.string().required().messages({
      "any.required": "Full name is required",
    }),
    address: Joi.string().required().messages({
      "any.required": "Address is required",
    }),
    city: Joi.string().required().messages({
      "any.required": "City is required",
    }),
    postalCode: Joi.string().required().messages({
      "any.required": "Postal code is required",
    }),
    country: Joi.string().required().messages({
      "any.required": "Country is required",
    }),
    phoneNumber: Joi.string().required().messages({
      "any.required": "Phone number is required",
    }),
  }).required(),
  paymentMethod: Joi.string().required().messages({
    "any.required": "Payment method is required",
  }),
  itemsPrice: Joi.number().required().messages({
    "any.required": "Items price is required",
  }),
  shippingPrice: Joi.number().required().messages({
    "any.required": "Shipping price is required",
  }),
  taxPrice: Joi.number().required().messages({
    "any.required": "Tax price is required",
  }),
  totalPrice: Joi.number().required().messages({
    "any.required": "Total price is required",
  }),
});

const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid("pending", "processing", "shipped", "delivered", "cancelled")
    .required()
    .messages({
      "any.only": "Status must be one of: pending, processing, shipped, delivered, cancelled",
      "any.required": "Status is required",
    }),
});

module.exports = { createOrderSchema, updateOrderStatusSchema };
