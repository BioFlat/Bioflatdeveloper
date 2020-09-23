const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const loginSchema = new Schema(
  {
    phone: { type: String, required: true },
    createdOn: { type: Date, default: Date.now },
  }
);
module.exports = mongoose.model('login', loginSchema);