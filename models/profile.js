const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProfileSchema = new Schema(
  { 
    user: {type: String,required:true},
    profilePicture:{type:String},
    email: {type: String},
    password: {type: String},
    name: {type:String},
    phone:{type:String}, 
    createdOn: {type: Date,default:Date.now},
    Address:[{
      type: mongoose.Schema.Types.ObjectId,
      ref:"Address",
      requireed: true
    }]
  }
);
module.exports = mongoose.model('Profile', ProfileSchema);