const router = require("express").Router();
const env = require("../../../config/env");
const config = require("../../../config")[env];
const HTTPResp = require("../../../utils/HTTPResp");
 const Product = require("../../../models/Product");
  var ObjectId = require('mongoose').Types.ObjectId;
var objectId = require('mongodb').ObjectId;

router.post("/addProduct", function (req, res) {
  var token = req.headers['token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
  let { productName } = req.body;

  if (!productName) {
    return res.status(400).json(HTTPResp.error('badRequest'));
  }
   Product.findOne({ productName: productName }, (err, result) => {
    if (err) {
      return res.status(500).json(HTTPResp.error("serverError"));
    }
    if (result) {
      return res.status(400).json(HTTPResp.error('exists','product'));
    }
    let newProduct = {
        productName: req.body.productName
       };
      newProduct = new Product(newProduct);
     newProduct.save((err, result) => {
      if (err) {
         return res.status(500).json(HTTPResp.error("serverError"));
      }
      if(result){
        return res.status(201).json(HTTPResp.created("product"));
       }
    });
  });
});
})

router.get("/getProduct", function (req, res) {
  var token = req.headers['token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
   Product.find( (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!result) {
      return res.status(404).json(HTTPResp.error('notFound','product'));
    }
        res.status(200).json(HTTPResp.ok({result}));
   });
});
})

router.put("/updateProduct", function (req,res){
  var token = req.headers['token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
     let {id} = req.query;
        if (!ObjectId.isValid(req.query.id)) {
        res.status(400).send(`Invalid id: ${req.query.id}`);
    }
     const reg = {
        productName: req.body.productName
     }
      Product.updateOne({"_id":objectId(id)},{ $set: reg}, function(err,result){
        if(result){
            res.status(200).json(HTTPResp.ok());
         }
        if(err){
            return res.status(400).json(HTTPResp.error('error'));
        }
     })
});
1})
router.delete("/deleteProduct", function(req,res){
  var token = req.headers['token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    let {id} = req.query;
    if (!ObjectId.isValid(req.query.id)) {
    res.status(400).send(`Invalid id: ${req.query.id}`);
    }
    Product.deleteOne({"_id":objectId(id)}, function(err,result){
        if(result){
            res.status(200).json(HTTPResp.ok());
         }
        if(err){
            return res.status(400).json(HTTPResp.error('error'));
        }
   
     })   })
})
 module.exports = router;
