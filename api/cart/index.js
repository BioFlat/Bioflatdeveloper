const router = require("express").Router();
const env = require("../../config/env");
const config = require("../../config")[env];
const Cart = require("../../models/Cart");
const HTTPResp = require("../../utils/HTTPResp");
 var ObjectId = require('mongoose').Types.ObjectId;
var objectId = require('mongodb').ObjectId;

router.post("/addToCart", function (req, res) {

  let { price,productName } = req.body;

  if (!price || !productName) {
    return res.status(400).json(HTTPResp.error('badRequest'));
  }
     let newCart = {
        productName: req.body.productName,
        price: req.body.price
       };
      newCart = new Cart(newCart);
     newCart.save((err, result) => {
      if (err) {
         return res.status(500).json(HTTPResp.error("serverError"));
      }
      if(result){
        return res.status(201).json(HTTPResp.created("cart"));
       }
    });
});

router.get("/getCart", function (req, res) {
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
 
router.delete("/deleteCart", function(req,res){
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
