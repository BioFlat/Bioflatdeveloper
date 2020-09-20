const router = require("express").Router();
const env = require("../.././../config/env");
const config = require("../../../config")[env];
const HTTPResp = require("../../../utils/HTTPResp");
const Address = require("../../../models/Address");
const User = require("../../../models/User");
const utils = require("../../../utils/checkUser")
const ObjectId = require("mongoose").Types.ObjectId;
const objectId = require("mongodb").ObjectId;

router.post("/", function (req, res) {

  let { houseNumber, streetName, city, state, pincode,phone } = req.body;

  if (!houseNumber || !streetName || !city || !state || !pincode) {
    return res.status(400).json(HTTPResp.error("badRequest"));
  }
  User.findOne({phone:req.currentUser.phone_number},(err, user) => {
   if (err) {
     return res.status(500).json(HTTPResp.error("serverError"));
   }
   if (!user) {
     return res.status(400).json(HTTPResp.error('notFound','user'));
   }
   let newAddress = new Address({
      user:user._id,
      houseNumber: houseNumber,
      streetName: streetName,
      city: city,
      state: state,
      pincode: pincode
    });
     newAddress.save((err, address) => {
       if (err) {
         console.log(err)
         return res.status(500).json(HTTPResp.error("serverError"));
       }
       User.findByIdAndUpdate(
         user._id,
         {
           $push: { addressList: address._id }
         },
         { new: true, useFindAndModify: false },
         (err, result) => {
           if (err) {
             console.log(err);
             return res.status(500).json(HTTPResp.error("serverError"));
           }
           return res.status(201).json(HTTPResp.created("address"));
       
         }
       );
      
     });
 });
 
});

router.get("phone/:phone", function (req, res) {
  let {phone} = req.query;  
  User.findOne({ phone: phone }, (err, user) => {
   if (err) {
     return res.status(500).json(HTTPResp.error("serverError"));
   }
   if (!user) {
     return res.status(400).json(HTTPResp.error('notFound','user'));
   }
    Address.find((err,result)=>{
      if (err) {
         return res.status(500).json(HTTPResp.error("serverError"));
      }
      res.status(200).json(HTTPResp.ok(result));
   })
 });
  
});

router.get("/", function (req, res) {
   User.findOne({ phone: req.currentUser.phone_number }, (err, user) => {
   if (err) {
     return res.status(500).json(HTTPResp.error("serverError"));
   }
   if (!user) {
     return res.status(400).json(HTTPResp.error('notFound','user'));
   }
   Address.find((err,result)=>{
      if (err) {
         return res.status(500).json(HTTPResp.error("serverError"));
      }
      res.status(200).json(HTTPResp.ok(result));
   })
 });
  
});

router.get("/:id", function (req, res) {
   let { id } = req.query;
   if (!ObjectId.isValid(id)) {
      return res.status(400).json(HTTPResp.error('badRequest',`Invalid id: ${id}`));
   }
    Address.findOne({ _id: objectId(id) },(err, result) => {
     if (err) {
       return res.status(500).json(HTTPResp.error("serverError"));
     }
     if (!result) {
       return res.status(404).json(HTTPResp.error("notFound", "address"));
     }
     return res.status(200).json(HTTPResp.ok(result));
   });
 });

router.put("/:id", function (req, res) {
   let { id } = req.query;
   if (!ObjectId.isValid(id)) {
    return res.status(400).json(HTTPResp.error('badRequest',`Invalid id: ${id}`));
   }
  let { houseNumber, streetName, city, state, pincode } = req.body;
  if (!houseNumber || !streetName || !city || !state || !pincode) {
    return res.status(400).json(HTTPResp.error("badRequest"));
  }
  const reg = {
    houseNumber: houseNumber,
    streetName: streetName,
    city: city,
    state: state,
    pincode: pincode,
  };
  Address.updateOne({ _id: objectId(id) }, { $set: reg }, function (
    err,
    result
  ) {
   if (err) {
      return res.status(400).json(HTTPResp.error("serverError"));
   }

   return res.status(200).json(HTTPResp.ok());
   
  });
});

router.delete("/:id", function (req, res) {
  let { id } = req.query;
  if (!ObjectId.isValid(id)) {
   return res.status(400).json(HTTPResp.error('badRequest',`Invalid id: ${id}`));
  }
  Address.deleteOne({ _id: objectId(id) }, function (err, result) {
    if (result) {
      return res.status(200).json(HTTPResp.ok());
    }
    if (err) {
      return res.status(500).json(HTTPResp.error("serverError"));
    }
  });
});

module.exports = router;
