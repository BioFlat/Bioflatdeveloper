const router = require("express").Router();
const Cart = require("../../../models/Cart");
const Product = require("../../../models/Product");
const login = require("../../../models/login")
const env = require("../../../config/env");
const config = require("../../../config")[env];
const HTTPResp = require("../../../utils/HTTPResp");
const utils = require("../../../utils/Token");
const User = require("../../../models/User");
const ObjectId = require('mongoose').Types.ObjectId;
const objectId = require('mongodb').ObjectId;

router.post("/", function (req, res) {
       let { product,quantity,price } = req.body;
   if (!price || !product || !quantity) {
    return res.status(400).json(HTTPResp.error('badRequest'));
  }
  User.findOne({phone:req.currentUser.phone_number},(err, user) => {
    if (err) {
      return res.status(500).json(HTTPResp.error("serverError"));
    }
       if (!user) {
      return res.status(400).json(HTTPResp.error('notFound','user not found'));
    }
     // Product.findOne({productName:req.body.product},(err,result)=>{
       let newCart = new Cart({
         user:user._id,
         product: req.body.product,
         quantity: req.body.quantity,
         price: req.body.price
     });
      newCart.save((err, result) => {
      if (err) {
         return res.status(500).json(HTTPResp.error("serverError"));
      }
      if(result){
        return res.status(201).json(HTTPResp.created("cart"));
       }
    });
});
});
//})

 
router.get("/", function (req, res) {
    Cart.find( (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!result) {
      return res.status(404).json(HTTPResp.error('notFound','price'));
    }
        res.status(200).json(HTTPResp.ok({result}));
   });
});
 router.delete("/:id", function(req,res){
     let {id} = req.query;
    if (!ObjectId.isValid(req.query.id)) {
    res.status(400).send(`Invalid id: ${req.query.id}`);
    }
    Cart.deleteOne({"_id":objectId(id)}, function(err,result){
        if(result){
            res.status(200).json(HTTPResp.ok());
         }
        if(err){
            return res.status(400).json(HTTPResp.error('error'));
        }
    })
})
  module.exports = router;
