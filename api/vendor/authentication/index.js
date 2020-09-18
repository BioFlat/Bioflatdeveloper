const router = require("express").Router();
 const env = require("../../../config/env");
const config = require("../../../config")[env];
const Vendor = require("../../../models/Vendor");
const HTTPResp = require("../../../utils/HTTPResp");
var ObjectId = require('mongoose').Types.ObjectId;
var objectId = require('mongodb').ObjectId;


router.post("/createVendor", function (req, res) {
    let {ownersFullname, storeName, address, city, state, pincode } = req.body;

  if (!ownersFullname || !storeName || !address || !city || !state || !pincode) {
    return res.status(400).json(HTTPResp.error('badRequest'));
  }
   Vendor.findOne({ storeName: storeName }, (err, store) => {
    if (err) {
      return res.status(500).json(HTTPResp.error("serverError"));
    }
    if (store) {
      return res.status(400).json(HTTPResp.error('exists','store'));
    }
     let newVendor = {
      ownersFullname: req.body.ownersFullname,
      storeName: req.body.storeName,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      pincode: req.body.pincode
    };
  
    newVendor = new Vendor(newVendor);
    newVendor.save((err, user) => {
      if (err) {
        console.log(err);
        return res.status(500).json(HTTPResp.error("serverError"));
      }
      return res.status(201).json(HTTPResp.created("vendor"));
    });
  });
});

router.get("/getVendor", function (req, res) {
    Vendor.find((err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!result) {
      return res.status(404).json(HTTPResp.error('notFound'));
    }
        res.status(200).json(HTTPResp.ok({result}));
   });
});

router.put("/update", function (req,res){
  var token = req.headers['token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    req.email = decoded.email;
    let email = req.email
  let {password} = req.body;
  let hashedPassword = bcrypt.hashSync(password, 8);
  const reg = {
    email: req.body.email,
    password: hashedPassword,
    name: req.body.name,
    phone: req.body.phone
  }
  User.updateOne({"email":email},{ $set: reg}, function(err,result){
     if(result){
         res.status(200).json(HTTPResp.ok());
      }
     if(err){
         return res.status(400).json(HTTPResp.error('error'));
     }
  })
})
});

module.exports = router;
