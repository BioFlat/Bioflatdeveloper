const mongoose = require('mongoose');
const User = require('./User');

const Schema = mongoose.Schema;

const AddressSchema = new Schema({
    user: {type: String,required:true},
    houseNumber: {type: String},
    streetName: {type: String},
    city: {type: String},
    state: {type: String},
    pincode: {type: String},
    email:{type: String},
    createdOn: {type: Date,default:Date.now},
  
});
module.exports = mongoose.model('Address',AddressSchema);