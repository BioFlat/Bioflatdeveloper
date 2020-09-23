const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
     vendorId:{type: String,required:true},
     store:{type: mongoose.Schema.Types.ObjectId},
     itemName: {type: String,required:true},
     imageRef:{type: String,required:true},
     description: {type: String,required:true},
     category: {type: String},
     subCategory:{type: String},
     price:{type: Number,required:true},
     quantityAvailable:{type: Number,required:true},
     createdOn: {type: Date,default:Date.now}
  }
);
module.exports = mongoose.model('Product', ProductSchema);