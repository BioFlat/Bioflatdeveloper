const router = require("express").Router();
const env = require("../../../config/env");
const config = require("../../../config")[env];
const HTTPResp = require("../../../utils/HTTPResp");
const Address = require("../../../models/Address");
const ObjectId = require('mongoose').Types.ObjectId;
const objectId = require('mongodb').ObjectId;
const jwt = require("jsonwebtoken");


router.post("/addAddress", function (req, res) {
     let email = req.email

  let { houseNumber, streetName, city, state, pincode } = req.body;

  if (!houseNumber || !streetName || !city || !state || !pincode) {
    return res.status(400).json(HTTPResp.error('badRequest'));
  }
     let newAddress = {
        houseNumber: req.body.houseNumber,
        streetName: req.body.streetName,
        city: req.body.city,
        state:req.body.state,
        pincode: req.body.pincode,
        email:email
      };
      newAddress = new Address(newAddress);
     newAddress.save((err, store) => {
      if (err) {
         return res.status(500).json(HTTPResp.error("serverError"));
      }
      if(store){
        return res.status(201).json(HTTPResp.created("Address"));
       }
    });
  
});

router.get("/getAddress", function (req, res) {
   Address.find( (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!result) {
      return res.status(404).json(HTTPResp.error('notFound','address'));
    }
        res.status(200).json(HTTPResp.ok({result}));
   });
});
 
router.put("/updateAddress", function (req,res){
      let {id} = req.query;
        if (!ObjectId.isValid(req.query.id)) {
        res.status(400).send(`Invalid id: ${req.query.id}`);
    }
     const reg = {
        houseNumber: req.body.houseNumber,
        streetName: req.body.streetName,
        city: req.body.city,
        state:req.body.state,
        pincode: req.body.pincode
     }
     Address.updateOne({"_id":objectId(id)},{ $set: reg}, function(err,result){
        if(result){
            res.status(200).json(HTTPResp.ok());
         }
        if(err){
            return res.status(400).json(HTTPResp.error('error'));
        }
     })
});

 router.delete("/deleteAddress", function(req,res){
     let {id} = req.query;
    if (!ObjectId.isValid(req.query.id)) {
    res.status(400).send(`Invalid id: ${req.query.id}`);
    }
    Address.deleteOne({"_id":objectId(id)}, function(err,result){
        if(result){
            res.status(200).json(HTTPResp.ok());
         }
        if(err){
            return res.status(400).json(HTTPResp.error('error'));
        }
    })
})
  module.exports = router;
