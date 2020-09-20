const router = require("express").Router();
 const env = require("../../../config/env");
const config = require("../../../config")[env];
const Account = require("../../../models/Account");
const HTTPResp = require("../../../utils/HTTPResp");
var ObjectId = require('mongoose').Types.ObjectId;
var objectId = require('mongodb').ObjectId;


router.post("/", function (req, res) {
    let {ownersFullname, storeName, address, city, state, pincode } = req.body;

  if (!ownersFullname || !storeName || !address || !city || !state || !pincode) {
    return res.status(400).json(HTTPResp.error('badRequest'));
  }
   Account.findOne({ storeName: storeName }, (err, store) => {
    if (err) {
      return res.status(500).json(HTTPResp.error("serverError"));
    }
    if (store) {
      return res.status(400).json(HTTPResp.error('exists','store'));
    }
   
    newAccount = new Account({
        ownersFullname: req.body.ownersFullname,
        storeName: req.body.storeName,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        pincode: req.body.pincode
    });
    newAccount.save((err, user) => {
      if (err) {
        console.log(err);
        return res.status(500).json(HTTPResp.error("serverError"));
      }
      return res.status(201).json(HTTPResp.created("account"));
    });
  });
});

router.get("/", function (req, res) {
    Account.find((err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!result) {
      return res.status(404).json(HTTPResp.error('notFound'));
    }
        res.status(200).json(HTTPResp.ok({result}));
   });
});

router.put("/:id", function (req,res){
    let { id } = req.query;
    if (!ObjectId.isValid(id)) {
        return res.status(400).json(HTTPResp.error('badRequest',`Invalid id: ${id}`));
       }
   const reg = {
    ownersFullname: req.body.ownersFullname,
    storeName: req.body.storeName,
    address: req.body.address,
    city: req.body.city,
    state: req.body.state,
    pincode: req.body.pincode
  }
  Account.updateOne({ _id: objectId(id) }, { $set: reg }, function(err,result){
     if(result){
         res.status(200).json(HTTPResp.ok());
      }
     if(err){
         return res.status(400).json(HTTPResp.error('error'));
     }
  })
});

module.exports = router;
