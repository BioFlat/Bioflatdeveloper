const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const WishlistSchema = new Schema(
  {
    userId: { type: String, required: true },
    productName: { type: String, required: true },
    description: { type: String, required: true },
    size: { type: String, required: true },
    price: { type: String, required: true },
    createdOn: { type: Date, default: Date.now },
  }
);
module.exports = mongoose.model('Wishlist', WishlistSchema);