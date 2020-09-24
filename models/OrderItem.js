const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const OrderItemSchema = new Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: { type: Number, required: true },
  price: { type: String, required: true },
  createdOn: { type: Date, default: Date.now },
});
module.exports = mongoose.model("OrderItem", OrderItemSchema);
