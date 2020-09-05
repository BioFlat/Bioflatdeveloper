const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const WishlistSchema = new Schema(
  {
    productName: {type: String},
    price: {type: String},
    createdOn: {type: Date,default:Date.now},
  }
);
module.exports = mongoose.model('Wishlist', WishlistSchema);