const router = require("express").Router();
const env = require("../../../config/env");
const config = require("../../../config")[env];
const HTTPResp = require("../../../utils/HTTPResp");
 const Price = require("../../../models/Price");
  var ObjectId = require('mongoose').Types.ObjectId;
var objectId = require('mongodb').ObjectId;

router.post("/addPrice", function (req, res) {
  var token = req.headers['token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
  let { price } = req.body;

  if (!price) {
    return res.status(400).json(HTTPResp.error('badRequest'));
  }
   Price.findOne({ price: price }, (err, result) => {
    if (err) {
      return res.status(500).json(HTTPResp.error("serverError"));
    }
    if (result) {
      return res.status(400).json(HTTPResp.error('exists','price'));
    }
    let newPrice = {
        price: req.body.price
       };
      newPrice = new Price(newPrice);
     newPrice.save((err, result) => {
      if (err) {
         return res.status(500).json(HTTPResp.error("serverError"));
      }
      if(result){
        return res.status(201).json(HTTPResp.created("price"));
       }
    });
  });
});
})

router.get("/getPrice", function (req, res) {
  var token = req.headers['token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
   Price.find( (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!result) {
      return res.status(404).json(HTTPResp.error('notFound','price'));
    }
        res.status(200).json(HTTPResp.ok({result}));
   });
});
})

router.put("/updatePrice", function (req,res){var token = req.headers['token'];
if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

jwt.verify(token, config.secret, function(err, decoded) {
  if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
     let {id} = req.query;
        if (!ObjectId.isValid(req.query.id)) {
        res.status(400).send(`Invalid id: ${req.query.id}`);
    }
     const reg = {
        price: req.body.price
     }
      Price.updateOne({"_id":objectId(id)},{ $set: reg}, function(err,result){
        if(result){
            res.status(200).json(HTTPResp.ok());
         }
        if(err){
            return res.status(400).json(HTTPResp.error('error'));
        }
     })
});
})
router.delete("/deletePrice", function(req,res){
  var token = req.headers['token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    let {id} = req.query;
    if (!ObjectId.isValid(req.query.id)) {
    res.status(400).send(`Invalid id: ${req.query.id}`);
    }
    Price.deleteOne({"_id":objectId(id)}, function(err,result){
        if(result){
            res.status(200).json(HTTPResp.ok());
         }
        if(err){
            return res.status(400).json(HTTPResp.error('error'));
        }
    })
})
})
 module.exports = router;
