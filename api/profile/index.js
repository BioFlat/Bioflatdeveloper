const router = require("express").Router();
const env = require("../../config/env");
const config = require("../../config")[env];
const Profile = require("../../models/Profile");
const HTTPResp = require("../../utils/HTTPResp");
  var ObjectId = require('mongoose').Types.ObjectId;
var objectId = require('mongodb').ObjectId;

router.post("/createProfile", function (req, res) {

  let { name, email, phone, state, pincode } = req.body;

  if (!houseNumber || !streetName || !city || !state || !pincode) {
    return res.status(400).json(HTTPResp.error('badRequest'));
  }
//    Address.find({where:{ houseNumber:houseNumber,streetName:streetName,city:city,state:state,pincode:pincode}}, (err, address) => {
//     if (err) {
//       return res.status(500).json(HTTPResp.error("serverError"));
//     }
//     if (address) {
//       return res.status(400).json(HTTPResp.error('exists','Address'));
//     }
    let newAddress = {
        houseNumber: req.body.houseNumber,
        streetName: req.body.streetName,
        city: req.body.city,
        state:req.body.state,
        pincode: req.body.pincode
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
