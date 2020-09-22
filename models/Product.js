const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    vendorId: { type: String, required: true },
    itemName: { type: String, required: true },
    productImage: { type: String, required: true },
    description: { type: String, required: true },
    category:  { type: String },
    subCategory:  { type: String},
    quantityAvailable: { type: Number, required: true },
    available: { type: Boolean, default: true },
    price: { type: String, required: true },
    createdOn: { type: Date, default: Date.now },
  }
);
module.exports = mongoose.model('Product', ProductSchema);