const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const wishlistSchema = new Schema({
  user: {
    type: String,
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      addedTime: {
        type: Date,
        required: true,
      }
    },
  ]
});

module.exports = mongoose.model("Wishlist", wishlistSchema);
