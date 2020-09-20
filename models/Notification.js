const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const NotificationSchema = new Schema(
  {
    user: {type: String,required:true},
    title: {type: String},
    description: {type: String},
    createdOn: {type:Date,default:Date.now},
  }
);
module.exports = mongoose.model('Notification',NotificationSchema);