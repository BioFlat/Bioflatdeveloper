const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const myOrderSchema = new Schema(
  {
    product: {type: String},
    Delivery: {type: String},
    status: {type: String},
    email: {type: String},
     createdOn: {type: Date,default:Date.now},
  }
);
module.exports = mongoose.model('Myorder',myOrderSchema);