const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AccountSchema = new Schema(
  { 
    ownersFullname: {type: String},
    storeName: {type: String},
    address: {type:String},
    city:{type:String},
    state:{type:String},
    pincode:{type:String}, 
    createdOn: {type: Date,default:Date.now},
  }
);
module.exports = mongoose.model('Account', AccountSchema);