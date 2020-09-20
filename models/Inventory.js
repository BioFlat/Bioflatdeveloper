const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const InventorySchema = new Schema(
  {
    store: {type:String}, 
    itemName: {type: String},
    description: {type: String},
    price: {type: String},
    createdOn: {type: Date,default:Date.now},
  }
);
module.exports = mongoose.model('Inventory', InventorySchema);