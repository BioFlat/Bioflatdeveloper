const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const vendorLoginSchema = new Schema(
  { 
     phone:{type:String}, 
    createdOn: {type: Date,default:Date.now},
  }
);
module.exports = mongoose.model('vendorLogin', vendorLoginSchema);