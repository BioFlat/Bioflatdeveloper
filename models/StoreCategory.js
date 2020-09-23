const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const StoreCategorySchema = new Schema({
  category: { type: String, required: true },
  createdOn: { type: Date, default: Date.now },
});
module.exports = mongoose.model("StoreCategory", StoreCategorySchema);
