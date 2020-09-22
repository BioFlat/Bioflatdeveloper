const mongoose = require('mongoose');
const User = require('./User');

const Schema = mongoose.Schema;

const AddressSchema = new Schema({
    userId: { type: String, required: true },
    addressName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    createdOn: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Address', AddressSchema);