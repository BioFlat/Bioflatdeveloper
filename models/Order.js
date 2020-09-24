const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  userId: { type: String, required: true },
  store: { type: mongoose.Schema.Types.ObjectId, ref: "StoreInventory" },
  profile: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" },
  orderItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "OrderItem" }],
  address: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
  action: { type: String },
  actionOn: { type: Date, default: Date.now },
  orderItemCount: { type: Number, default: 0 },
  itemTotal: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  paymentDetails: { type: Object },
  createdOn: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Order", OrderSchema);
