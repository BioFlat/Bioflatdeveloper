const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const StoreInventorySchema = new Schema(
  {
    vendorId:{ type: String, required: true },
    storeName: { type: String, required: true },
    rating: { type: String },
    category:{ type: String },
    latitude: { type: String },
    longitude: { type: String, required: true },
    imageRef: { type: String, required: true },
    productCount: { type: Number, default: 0 },
    products:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }],
    createdOn: { type: Date, default: Date.now }
  }
);
module.exports = mongoose.model('StoreInventory', StoreInventorySchema);