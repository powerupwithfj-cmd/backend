const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: String,
    weight: String,
    stock: { type: Number, default: 0 },
    images: {
      type: [String],        // array of image paths
      required: true,        // at least 1 image required
      validate: [arr => arr.length <= 5, "Maximum 5 images allowed"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
