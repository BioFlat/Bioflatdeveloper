const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  { 
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
module.exports = mongoose.model('User', UserSchema);