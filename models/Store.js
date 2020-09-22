const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const StoreSchema = new Schema(
  {
    userId: { type: String, required: true },
    storeTitle: { type: String, required: true },
    storeDescription: { type: String, required: true },
    rating: { type: String, required: true },
    latitude: { type: String, required: true },
    longitude: { type: String, required: true },
    createdOn: { type: Date, default: Date.now },
  }
);
module.exports = mongoose.model('Store', StoreSchema);