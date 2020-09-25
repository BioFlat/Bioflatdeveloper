const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const NotificationSchema = new Schema(
  {
    userId: {type: String,required:true},
    iconRef:{type:String,required:true},
    title: {type: String,required:true},
    description: {type: String,required:true},
    createdOn: {type:Date,default:Date.now},
  }
);
module.exports = mongoose.model('Notification',NotificationSchema);