const router = require("express").Router();
const env = require("../../../config/env");
const config = require("../../../config")[env];
const HTTPResp = require("../../../utils/HTTPResp");
const Inventory = require("../../../models/Inventory");
const Account = require("../../../models/Account");
const ObjectId = require('mongoose').Types.ObjectId;
const objectId = require('mongodb').ObjectId;

router.post("/", function (req, res) {
   let { itemName, description, price, } = req.body;

  if (!itemName || !description || !price) {
    return res.status(400).json(HTTPResp.error('badRequest'));
  }
       newInventory = new Inventory({
        itemName: req.body.itemName,
        description: req.body.description,
        price: req.body.price
      });
     newInventory.save((err, result) => {
      if (err) {
         return res.status(500).json(HTTPResp.error("serverError"));
      }
      if(result){
        return res.status(201).json(HTTPResp.created("store"));
       }
    });
  });

 
router.get("/", function (req, res) {
   Store.find( (err, store) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!store) {
      return res.status(404).json(HTTPResp.error('notFound','store'));
    }
        res.status(200).json(HTTPResp.ok({store}));
   });
});
 
router.put("/:id", function (req,res){
      let {id} = req.query;
        if (!ObjectId.isValid(req.query.id)) {
        res.status(400).send(`Invalid id: ${req.query.id}`);
    }
     const reg = {
        storeTitle: req.body.storeTitle,
        storeDescription: req.body.storeDescription,
        rating: req.body.rating,
        distance:req.body.distance
     }
     Store.updateOne({"_id":objectId(id)},{ $set: reg}, function(err,result){
        if(result){
            res.status(200).json(HTTPResp.ok());
         }
        if(err){
            return res.status(400).json(HTTPResp.error('error'));
        }
     })
    })
 
 router.delete("/:id", function(req,res){
     let {id} = req.query;
    if (!ObjectId.isValid(req.query.id)) {
    res.status(400).send(`Invalid id: ${req.query.id}`);
    }
    Store.deleteOne({"_id":objectId(id)}, function(err,result){
        if(result){
            res.status(200).json(HTTPResp.ok());
         }
        if(err){
            return res.status(400).json(HTTPResp.error('error'));
        }
    })
  })
  module.exports = router;
