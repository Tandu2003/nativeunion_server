const { comparePassword, hashPassword } = require("../config/bcrypt.config.js");
const { generateToken } = require("../config/jwt.config.js");
const { User } = require("../models/user.model.js");
const { sendErrorResponse, sendSuccessResponse } = require("../utils/response.js");

class AuthController {
  async register(req, res) {
    const { email, password, firstName, lastName } = req.body;
    if (!email || !password || !firstName || !lastName) {
      sendErrorResponse(res, 400, "All fields are required");
      return;
    }

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        sendErrorResponse(res, 400, "Email already exists");
        return;
      }

      const hashedPassword = await hashPassword(password);
      const newUser = await User.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
      });

      sendSuccessResponse(res, { userId: newUser._id }, "User registered successfully");
    } catch (error) {
      sendErrorResponse(res, 500, "Registration failed", error);
    }
  }

  async login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
      sendErrorResponse(res, 400, "Missing credentials");
      return;
    }

    try {
      const user = await User.findOne({ email });
      if (!user) {
        sendErrorResponse(res, 404, "User not found");
        return;
      }

      const isMatch = comparePassword(password, user.password);
      if (!isMatch) {
        sendErrorResponse(res, 401, "Incorrect password");
        return;
      }

      const token = generateToken({ id: user._id }, { expiresIn: "7d" });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      sendSuccessResponse(res, { token }, "Login successful");
    } catch (error) {
      sendErrorResponse(res, 500, "Login failed", error);
    }
  }

  async logout(req, res) {
    res.clearCookie("token");
    sendSuccessResponse(res, null, "Logged out successfully");
    return Promise.resolve();
  }
}

module.exports = new AuthController();
