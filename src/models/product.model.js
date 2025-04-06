const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    vendor: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },

    colorVariants: [
      {
        color: { type: String, required: true },
        name: { type: String, required: true },
        imageDisplay: { type: String, required: true },
        imageHover: { type: String, required: true },
        images: [{ type: String }],
      },
    ],

    status: { type: String, default: "", enum: ["", "new", "last chance"] },

    description: {
      intro: { type: String },
      highlights: [{ type: String }],
      note: { type: String },
    },

    banner: [
      {
        image: { type: String, required: true },
        headline: { type: String },
        tagline: { type: String },
        bodyText: { type: String },
      },
    ],

    category: { type: String, required: true },
    tags: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
);

productSchema.pre("save", function (next) {
  if (this.isModified("name") || this.isNew) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
