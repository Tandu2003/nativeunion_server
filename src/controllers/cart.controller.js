const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const { sendSuccessResponse, sendErrorResponse } = require("../utils/response");

class CartController {
  async getMyCart(req, res) {
    try {
      const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
      sendSuccessResponse(res, cart || { items: [] });
    } catch (error) {
      sendErrorResponse(res, 500, "Failed to get cart", error);
    }
  }

  async addToCart(req, res) {
    const { productId, quantity = 1, color } = req.body;

    try {
      let cart = await Cart.findOne({ user: req.user._id });

      if (!cart) {
        cart = await Cart.create({
          user: req.user._id,
          items: [{ product: productId, quantity, color }],
        });
      } else {
        const existingItem = cart.items.find(
          (item) => item.product.toString() === productId && item.color === color
        );

        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          cart.items.push({ product: productId, quantity, color });
        }

        await cart.save();
      }

      sendSuccessResponse(res, cart, "Product added to cart");
    } catch (error) {
      sendErrorResponse(res, 500, "Failed to add to cart", error);
    }
  }

  async removeFromCart(req, res) {
    const { productId, color } = req.body;

    try {
      const cart = await Cart.findOne({ user: req.user._id });
      if (!cart) {
        sendErrorResponse(res, 404, "Cart not found");
        return;
      }

      cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId || item.color !== color
      );

      await cart.save();
      sendSuccessResponse(res, cart, "Product removed from cart");
    } catch (error) {
      sendErrorResponse(res, 500, "Failed to remove from cart", error);
    }
  }

  async updateCartItem(req, res) {
    const { productId, quantity, color } = req.body;

    try {
      const cart = await Cart.findOne({ user: req.user._id });
      if (!cart) return sendErrorResponse(res, 404, "Cart not found");

      const item = cart.items.find((i) => i.product.toString() === productId && i.color === color);

      if (!item) return sendErrorResponse(res, 404, "Item not found in cart");

      item.quantity = quantity;
      await cart.save();

      sendSuccessResponse(res, cart, "Cart item updated");
    } catch (error) {
      sendErrorResponse(res, 500, "Failed to update cart item", error);
    }
  }
}

module.exports = new CartController();
