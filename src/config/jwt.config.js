const jwt = require("jsonwebtoken");
const { jwtSecret } = require("./env.config");

const generateToken = (payload, options) => {
  return jwt.sign(payload, jwtSecret, {
    ...options,
  });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, jwtSecret);
  } catch (error) {
    return null;
  }
};

module.exports = { generateToken, verifyToken };
