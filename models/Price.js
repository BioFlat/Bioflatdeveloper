const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PriceSchema = new Schema(
  {
    price: {type: String},
     createdOn: {type: Date,default:Date.now},
  }
);
module.exports = mongoose.model('Price', PriceSchema);