const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AccountSchema = new Schema(
  {
    vendorId: { type: String, required: true },
    storeLogo: { type: String, required: true },
    ownerName: { type: String, required: true },
    storeName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    latitude: { type: String, required: true },
    longitude: { type: String, required: true },
    productCount:{ type: Number, default:0 },
    kyc:{ type: Boolean, default: false},
    createdOn: { type: Date, default: Date.now },
  }
);
module.exports = mongoose.model('Account', AccountSchema);