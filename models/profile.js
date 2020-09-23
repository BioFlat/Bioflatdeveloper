const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProfileSchema = new Schema(
  { 
    userId: {type: String,required:true},
    imageRef:{type:String,required:true},
    name: {type:String,required:true},
    email: {type: String,required:true},
    phone:{type:String,required:true}, 
    addressCount:{type:Number,default:0},
    createdOn: {type: Date,default:Date.now}
  }
);
module.exports = mongoose.model('Profile', ProfileSchema);