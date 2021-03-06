const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AccountSchema = new Schema({
  vendorId: { type: String, required: true },
  ownerName: { type: String, required: true },
  store:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StoreInventory'
  },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  kyc: { type: Boolean, default: false },
  createdOn: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Account", AccountSchema);
