const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const NotificationSchema = new Schema(
  {
    title: {type: String},
    description: {type: String},
    createdOn: {type:Date,default:Date.now},
  }
);
module.exports = mongoose.model('Notification',NotificationSchema);