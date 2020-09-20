const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const WishlistSchema = new Schema(
  {
    user: {type: String,required:true},
    productName: {type: String},
    description: {type:String},
    size:{type:String},
    price: {type: String},
    createdOn: {type: Date,default:Date.now},
  }
);
module.exports = mongoose.model('Wishlist', WishlistSchema);