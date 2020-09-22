const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AccountSchema = new Schema(
  {
    ownersFullname: { type: String, required: true },
    storeName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    createdOn: { type: Date, default: Date.now },
  }
);
module.exports = mongoose.model('Account', AccountSchema);