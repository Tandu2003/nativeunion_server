const { verifyToken } = require("../config/jwt.config.js");
const { BlacklistToken } = require("../models/blacklistToken.model.js");
const { User } = require("../models/user.model.js");
const { sendErrorResponse } = require("../utils/response.js");

const authenticate = async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    sendErrorResponse(res, 401, "No token provided");
    return;
  }

  try {
    const blacklistedToken = await BlacklistToken.findOne({ token });
    if (blacklistedToken) {
      sendErrorResponse(res, 401, "Token is invalid. Please log in again.");
      return;
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);
    if (!user) {
      sendErrorResponse(res, 401, "User not found");
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    sendErrorResponse(res, 403, "Invalid token");
    return;
  }
};

const isAdmin = (req, res, next) => {
  const user = req.user;
  if (user?.role !== "admin") {
    sendErrorResponse(res, 403, "Forbidden: Admins only");
    return;
  }
  next();
};

module.exports = { authenticate, isAdmin };
