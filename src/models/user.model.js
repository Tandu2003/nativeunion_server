const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, default: "user", enum: ["user", "admin"] },
  country: { type: String, default: "Vietnam" },
  company: { type: String },
  phoneNumber: { type: String },
  address: { type: [String], default: [] },
  city: { type: String },
  zipCode: { type: String },
});

const User = model("User", userSchema);

module.exports = { User };
