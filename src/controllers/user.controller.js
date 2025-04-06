const { comparePassword, hashPassword } = require("../config/bcrypt.config.js");
const { BlacklistToken } = require("../models/blacklistToken.model.js");
const { User } = require("../models/user.model.js");
const { sendErrorResponse, sendSuccessResponse } = require("../utils/response.js");

class UserController {
  async getAllUsers(req, res) {
    try {
      const users = await User.find().select("-password");
      sendSuccessResponse(res, users);
    } catch (error) {
      sendErrorResponse(res, 500, "Failed to get users", error);
    }
  }

  async getMe(req, res) {
    const user = req.user;
    if (!user) {
      sendErrorResponse(res, 401, "User not found");
      return;
    }

    sendSuccessResponse(res, user);
  }

  async updateMe(req, res) {
    const userId = req.user._id;
    console.log("User ID:", userId);
    console.log("Request Body:", req.body);
    const { firstName, lastName, country, company, phoneNumber, address } = req.body;

    try {
      const user = await User.findById(userId);
      if (!user) {
        sendErrorResponse(res, 404, "User not found");
        return;
      }

      // Update basic fields
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.country = country || user.country;
      user.company = company || user.company;
      user.phoneNumber = phoneNumber || user.phoneNumber;

      if (!user.address) {
        user.address = [];
      }

      if (address) {
        if (address.length > 2) {
          sendErrorResponse(res, 400, "Only 2 addresses are allowed");
          return;
        }

        if (address[0]) {
          user.address[0] = address[0] || user.address[0];
        }

        if (address[1]) {
          user.address[1] = address[1] || user.address[1];
        }

        if (!address[0] && user.address[1]) {
          user.address[0] = user.address[1];
          user.address[1] = "";
        }
      }

      await user.save();
      sendSuccessResponse(res, user, "User updated successfully");
    } catch (error) {
      sendErrorResponse(res, 500, "Failed to update user", error);
    }
  }

  async updateUser(req, res) {
    const userId = req.params.id;
    const { firstName, lastName, country, company, phoneNumber, address } = req.body;

    try {
      const user = await User.findById(userId);
      if (!user) {
        sendErrorResponse(res, 404, "User not found");
        return;
      }

      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.country = country || user.country;
      user.company = company || user.company;
      user.phoneNumber = phoneNumber || user.phoneNumber;

      if (address) {
        user.address = address;
      }

      await user.save();
      sendSuccessResponse(res, user, "User updated successfully");
    } catch (error) {
      sendErrorResponse(res, 500, "Failed to update user", error);
    }
  }

  async deleteUser(req, res) {
    const userId = req.params.id;

    try {
      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        sendErrorResponse(res, 404, "User not found");
        return;
      }

      sendSuccessResponse(res, null, "User deleted successfully");
    } catch (error) {
      sendErrorResponse(res, 500, "Failed to delete user", error);
    }
  }

  async changePassword(req, res) {
    const userId = req.user._id;
    const { oldPassword, newPassword } = req.body;

    try {
      const user = await User.findById(userId);
      if (!user) {
        sendErrorResponse(res, 404, "User not found");
        return;
      }

      const isMatch = await comparePassword(oldPassword, user.password);

      if (!isMatch) {
        sendErrorResponse(res, 400, "Incorrect old password");
        return;
      }

      user.password = await hashPassword(newPassword);

      await user.save();

      const oldToken = req.cookies?.token;
      if (oldToken) {
        await BlacklistToken.create({ token: oldToken, userId: user._id });
      }

      sendSuccessResponse(res, null, "Password changed successfully");
    } catch (error) {
      sendErrorResponse(res, 500, "Failed to change password", error);
    }
  }
}

module.exports = new UserController();
