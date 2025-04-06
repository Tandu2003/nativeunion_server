const Product = require("../models/product.model");
const { uploadImage, deleteImage } = require("../config/cloudinary.config");
const { sendErrorResponse, sendSuccessResponse } = require("../utils/response");

class ProductController {
  async getAllProducts(req, res) {
    try {
      const products = await Product.find();
      sendSuccessResponse(res, products);
    } catch (error) {
      sendErrorResponse(res, 500, "Failed to fetch products", error);
    }
  }

  async getProductBySlug(req, res) {
    try {
      const product = await Product.findOne({ slug: req.params.slug });
      if (!product) return sendErrorResponse(res, 404, "Product not found");
      sendSuccessResponse(res, product);
    } catch (error) {
      sendErrorResponse(res, 500, "Failed to get product", error);
    }
  }

  async createProduct(req, res) {
    try {
      const {
        name,
        vendor,
        price,
        discount,
        colorVariants,
        status,
        description,
        banner,
        category,
        tags,
      } = req.body;

      const updatedColorVariants = await Promise.all(
        colorVariants.map(async (variant) => {
          const imageDisplay = await uploadImage(variant.imageDisplay);
          const imageHover = await uploadImage(variant.imageHover);
          const images = await Promise.all(variant.images.map((img) => uploadImage(img)));

          return {
            ...variant,
            imageDisplay,
            imageHover,
            images,
          };
        })
      );

      const updatedBanner = await Promise.all(
        banner.map(async (b) => ({
          ...b,
          image: await uploadImage(b.image),
        }))
      );

      const product = new Product({
        name,
        vendor,
        price,
        discount,
        colorVariants: updatedColorVariants,
        status,
        description,
        banner: updatedBanner,
        category,
        tags,
      });

      await product.save();
      sendSuccessResponse(res, product, "Product created successfully");
    } catch (error) {
      sendErrorResponse(res, 500, "Failed to create product", error);
    }
  }

  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);
      if (!product) return sendErrorResponse(res, 404, "Product not found");

      const {
        name,
        vendor,
        price,
        discount,
        colorVariants,
        status,
        description,
        banner,
        category,
        tags,
      } = req.body;

      for (const variant of product.colorVariants) {
        await deleteImage(variant.imageDisplay);
        await deleteImage(variant.imageHover);
        for (const img of variant.images) await deleteImage(img);
      }
      for (const b of product.banner) {
        await deleteImage(b.image);
      }

      const updatedColorVariants = await Promise.all(
        colorVariants.map(async (variant) => {
          const imageDisplay = await uploadImage(variant.imageDisplay);
          const imageHover = await uploadImage(variant.imageHover);
          const images = await Promise.all(variant.images.map((img) => uploadImage(img)));
          return {
            ...variant,
            imageDisplay,
            imageHover,
            images,
          };
        })
      );

      const updatedBanner = await Promise.all(
        banner.map(async (b) => ({
          ...b,
          image: await uploadImage(b.image),
        }))
      );

      product.name = name;
      product.vendor = vendor;
      product.price = price;
      product.discount = discount;
      product.colorVariants = updatedColorVariants;
      product.status = status;
      product.description = description;
      product.banner = updatedBanner;
      product.category = category;
      product.tags = tags;

      await product.save();
      sendSuccessResponse(res, product, "Product updated successfully");
    } catch (error) {
      sendErrorResponse(res, 500, "Failed to update product", error);
    }
  }

  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);
      if (!product) return sendErrorResponse(res, 404, "Product not found");

      for (const variant of product.colorVariants) {
        await deleteImage(variant.imageDisplay);
        await deleteImage(variant.imageHover);
        for (const img of variant.images) await deleteImage(img);
      }
      for (const b of product.banner) {
        await deleteImage(b.image);
      }

      await product.deleteOne();
      sendSuccessResponse(res, null, "Product deleted successfully");
    } catch (error) {
      sendErrorResponse(res, 500, "Failed to delete product", error);
    }
  }

  async searchProductByName(req, res) {
    const { name } = req.params;
    try {
      const regex = new RegExp(name, "i");
      const products = await Product.find({ name: { $regex: regex } });
      sendSuccessResponse(res, products);
    } catch (error) {
      sendErrorResponse(res, 500, "Failed to search products", error);
    }
  }
}

module.exports = new ProductController();
