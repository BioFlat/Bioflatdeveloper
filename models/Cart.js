const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CartSchema = new Schema(
  {
    user: {
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true,
    },
    user: {type: String},
    product: {type: String},
    quantity: {type: String},
    price: {type: String},
    createdOn: {type: Date,default:Date.now},
  }
);
module.exports = mongoose.model('Cart', CartSchema);