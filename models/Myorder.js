const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const myOrderSchema = new Schema(
  {
    userId: { type: String, required: true },
    product: { type: String, required: true },
    Delivery: { type: String, required: true },
    status: { type: String, required: true },
    createdOn: { type: Date, default: Date.now },
  }
);
module.exports = mongoose.model('Myorder', myOrderSchema);