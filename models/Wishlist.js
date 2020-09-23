const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const WishlistSchema = new Schema(
  {
    userId: { type: String, required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    createdOn: { type: Date, default: Date.now }
  }
);
module.exports = mongoose.model('Wishlist', WishlistSchema);