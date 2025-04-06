const { cloudinary } = require("./env");

const cloudinaryv2 = require("cloudinary").v2;

cloudinaryv2.config({
  cloud_name: cloudinary.cloudName,
  api_key: cloudinary.apiKey,
  api_secret: cloudinary.apiSecret,
});

module.exports = cloudinaryv2;
