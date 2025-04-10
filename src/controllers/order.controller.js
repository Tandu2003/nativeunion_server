const Order = require("../models/order.model");
const Product = require("../models/product.model");
const { sendSuccessResponse, sendErrorResponse } = require("../utils/response");
const { createOrderSchema, updateOrderStatusSchema } = require("../validations/order.validation");

class OrderController {
  async createOrder(req, res) {
    const { error } = createOrderSchema.validate(req.body);
    if (error) {
      return sendErrorResponse(res, 400, error.details[0].message);
    }

    try {
      const {
        items,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      } = req.body;

      // Verify products exist and get their details
      for (const item of items) {
        const product = await Product.findById(item.product);
        if (!product) {
          return sendErrorResponse(res, 404, `Product with ID ${item.product} not found`);
        }
      }

      const order = new Order({
        user: req.user._id,
        items,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      });

      const createdOrder = await order.save();
      sendSuccessResponse(res, createdOrder, "Order created successfully");
    } catch (error) {
      sendErrorResponse(res, 500, "Failed to create order", error);
    }
  }

  async getMyOrders(req, res) {
    try {
      const orders = await Order.find({ user: req.user._id })
        .populate("items.product", "name slug")
        .sort("-createdAt");
      sendSuccessResponse(res, orders);
    } catch (error) {
      sendErrorResponse(res, 500, "Failed to get orders", error);
    }
  }

  async getOrderById(req, res) {
    try {
      const order = await Order.findById(req.params.id).populate("items.product");
      
      if (!order) {
        return sendErrorResponse(res, 404, "Order not found");
      }
      
      // Check if the order belongs to the user or if the user is an admin
      if (order.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        return sendErrorResponse(res, 403, "Unauthorized to access this order");
      }
      
      sendSuccessResponse(res, order);
    } catch (error) {
      sendErrorResponse(res, 500, "Failed to get order details", error);
    }
  }

  async updateOrderStatus(req, res) {
    const { error } = updateOrderStatusSchema.validate(req.body);
    if (error) {
      return sendErrorResponse(res, 400, error.details[0].message);
    }

    try {
      const { status } = req.body;
      const order = await Order.findById(req.params.id);
      
      if (!order) {
        return sendErrorResponse(res, 404, "Order not found");
      }
      
      order.status = status;
      const updatedOrder = await order.save();
      
      sendSuccessResponse(res, updatedOrder, "Order status updated successfully");
    } catch (error) {
      sendErrorResponse(res, 500, "Failed to update order status", error);
    }
  }

  async getAllOrders(req, res) {
    try {
      const orders = await Order.find({})
        .populate("user", "email firstName lastName")
        .populate("items.product", "name slug")
        .sort("-createdAt");
      sendSuccessResponse(res, orders);
    } catch (error) {
      sendErrorResponse(res, 500, "Failed to get all orders", error);
    }
  }

  async cancelOrder(req, res) {
    try {
      const order = await Order.findById(req.params.id);
      
      if (!order) {
        return sendErrorResponse(res, 404, "Order not found");
      }
      
      // Check if the order belongs to the user or if the user is an admin
      if (order.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        return sendErrorResponse(res, 403, "Unauthorized to cancel this order");
      }
      
      // Only allow cancellation if order is pending or processing
      if (order.status !== "pending" && order.status !== "processing") {
        return sendErrorResponse(
          res, 
          400, 
          "Cannot cancel order. Order is already shipped or delivered"
        );
      }
      
      order.status = "cancelled";
      await order.save();
      
      sendSuccessResponse(res, order, "Order cancelled successfully");
    } catch (error) {
      sendErrorResponse(res, 500, "Failed to cancel order", error);
    }
  }
}

module.exports = new OrderController();
