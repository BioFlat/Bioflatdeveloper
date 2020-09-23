const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    createdOn: { type: Date, default: Date.now },
    Address: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      requireed: true
    }]
  }
);
module.exports = mongoose.model('User', UserSchema);