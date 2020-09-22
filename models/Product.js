const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    productName: { type: String, required: true },
    price: { type: String, required: true },
    createdOn: { type: Date, default: Date.now },
  }
);
module.exports = mongoose.model('Product', ProductSchema);