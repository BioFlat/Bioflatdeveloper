const mongoose = require('mongoose');
const  env = require('../config/env')

const connectionString = require('../config')[env].connectionString;
const connector = mongoose.connect(connectionString)

module.exports = {
    init: (cb)=>{
        connector.then(
            () => {
              cb("Database connection established!")
             
            }            
          ).catch( err => {
            cb(false)
            console.log("Error connecting Database  due to: ", err);
          });
         
    }
}