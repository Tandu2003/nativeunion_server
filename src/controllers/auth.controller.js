const { comparePassword, hashPassword } = require("../config/bcrypt.config.js");
const { generateToken } = require("../config/jwt.config.js");
const { User } = require("../models/user.model.js");
const { sendErrorResponse, sendSuccessResponse } = require("../utils/response.js");
const { registerValidation, loginValidation } = require("../validations/auth.validation.js");

class AuthController {
  async register(req, res) {
    const { error, value } = registerValidation.validate(req.body, { abortEarly: false });
    if (error) {
      const messages = error.details.map((e) => e.message);
      return sendErrorResponse(res, 400, "Validation failed", messages);
    }

    const { email, password, firstName, lastName } = value;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return sendErrorResponse(res, 400, "Email already exists");
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
    const { error, value } = loginValidation.validate(req.body, { abortEarly: false });
    if (error) {
      const messages = error.details.map((e) => e.message);
      return sendErrorResponse(res, 400, "Validation failed", messages);
    }

    const { email, password } = value;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return sendErrorResponse(res, 404, "User not found");
      }

      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        return sendErrorResponse(res, 401, "Incorrect password");
      }

      const token = generateToken({ id: user._id }, { expiresIn: "7d" });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      sendSuccessResponse(
        res,
        {
          token,
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          },
        },
        "Login successful"
      );
    } catch (error) {
      sendErrorResponse(res, 500, "Login failed", error);
    }
  }

  async logout(req, res) {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    sendSuccessResponse(res, null, "Logged out successfully");
  }
}

module.exports = new AuthController();
