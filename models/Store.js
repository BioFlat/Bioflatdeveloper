const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const StoreSchema = new Schema(
  {
    storeTitle: {type: String},
    storeDescription: {type: String},
    rating: {type: String},
    distance: {type:String},
    createdOn: {type: Date,default:Date.now},
  }
);
module.exports = mongoose.model('Store', StoreSchema);