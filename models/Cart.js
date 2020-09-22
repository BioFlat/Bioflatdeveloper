const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CartSchema = new Schema(
  {
    userId: { type: String, required: true },
    product: { type: String, required: true },
    quantity: { type: String, required: true },
    price: { type: String, required: true },
    createdOn: { type: Date, default: Date.now },
  }
);
module.exports = mongoose.model('Cart', CartSchema);