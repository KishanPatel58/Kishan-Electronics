const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  oldPrice: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  image: [
    {
      type: String,
      required: true,
    },
  ],
  imageFileIds: [
    {
      type: String,
    },
  ],
  description: {
    type: String,
  },
  category: {
    type: String,
    required: true,
  },
});

const ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;
