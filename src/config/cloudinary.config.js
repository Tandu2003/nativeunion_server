const { cloudinary } = require("./env.config");

const cloudinaryv2 = require("cloudinary").v2;

cloudinaryv2.config({
  cloud_name: cloudinary.cloudName,
  api_key: cloudinary.apiKey,
  api_secret: cloudinary.apiSecret,
});

const uploadImage = async (filePath) => {
  try {
    const result = await cloudinaryv2.uploader.upload(filePath, {
      upload_preset: "native_union",
    });

    return result.public_id;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
};

const deleteImage = async (publicId) => {
  try {
    const result = await cloudinaryv2.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error deleting image:", error);
    throw new Error("Failed to delete image from Cloudinary");
  }
};

module.exports = { uploadImage, deleteImage };
