const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    productName: {type: String},
     createdOn: {type: Date,default:Date.now},
  }
);
module.exports = mongoose.model('Product', ProductSchema);