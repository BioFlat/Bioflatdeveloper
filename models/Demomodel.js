const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DemoSchema = new Schema(
  {
    email: {type: String},
    password: {type: String},
    createdOn: {type: Date,default:Date.now},
  }
);
module.exports = mongoose.model('DemoSchema', UserSchema);