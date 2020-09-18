const router = require("express").Router();
 const env = require("../config/env");
const config = require("../config")[env];
const User = require("../models/User");
const HTTPResp = require("../utils/HTTPResp");

const checkUser =( (req,res,next) =>{
    User.findOne({ email: email }, (err, user) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!user) {
      return res.status(404).json(HTTPResp.error('notFound','Input not valid'));
    }
  })
})
module.exports = {checkUser};