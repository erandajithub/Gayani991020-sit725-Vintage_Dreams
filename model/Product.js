const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  category: {
    type: Number,
    required: true,
  },
  size: [
    {
      type: String,
      required: true,
    },
  ],
  price: [
    {
      size: {
        type: String,
        required: true,
      },
      value: {
        type: Number,
        required: true,
      },
    },
  ],
  cost: [
    {
      size: {
        type: String,
        required: true,
      },
      value: {
        type: Number,
        required: true,
      },
    },
  ],
  stockQuantity: [
    {
      size: {
        type: String,
        required: true,
      },
      value: {
        type: Number,
        required: true,
        default: 0,
      },
    },
  ],
  photo: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("Product", productSchema);
