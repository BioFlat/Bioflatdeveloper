const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProfileSchema = new Schema(
  {
    name: {type: String},
    email: {type: String},
    phone: {type: String},
    createdOn: {type: Date,default:Date.now},
  }
);
module.exports = mongoose.model('Profile',ProfileSchema);