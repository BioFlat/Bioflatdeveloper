const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const env = require("../../../config/env");
const config = require("../../../config")[env];
const vendorLogin = require("../../../models/login");
const HTTPResp = require("../../../utils/HTTPResp");
var ObjectId = require('mongoose').Types.ObjectId;
var objectId = require('mongodb').ObjectId;


router.post("/login", function (req, res) {
    let { phone } = req.body;
 
   if (!phone) {
     return res.status(400).json(HTTPResp.error('badRequest'));
   }
      let newLogin = {
        phone: req.body.phone
     };
   
     newLogin = new vendorLogin(newLogin);
     newLogin.save((err, user) => {
       if (err) {
         console.log(err);
         return res.status(500).json(HTTPResp.error("serverError"));
       }
       return res.status(201).json(HTTPResp.created("Accept"));
     });
 });

 module.exports = router;

 