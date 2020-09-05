const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AddressSchema = new Schema(
  {
    houseNumber: {type: String},
    streetName: {type: String},
    city: {type: String},
    state: {type: String},
    pincode: {type: String},
    email:{type: String},
    createdOn: {type: Date,default:Date.now},
  }
);
module.exports = mongoose.model('Address',AddressSchema);