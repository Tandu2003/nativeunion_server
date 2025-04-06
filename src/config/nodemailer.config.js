const nodemailer = require("nodemailer");
const { email } = require("./env");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: email.service,
    pass: email.password,
  },
});

module.exports = transporter;
