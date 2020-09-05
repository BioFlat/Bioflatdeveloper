const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CartSchema = new Schema(
  {
    productName: {type: String},
    price: {type: String},
    createdOn: {type: Date,default:Date.now},
  }
);
module.exports = mongoose.model('Cart', CartSchema);