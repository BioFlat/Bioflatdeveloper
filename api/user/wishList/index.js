const router = require("express").Router();
const env = require("../../../config/env");
const config = require("../../../config")[env];
const HTTPResp = require("../../../utils/HTTPResp");
const User = require("../../../models/User");
const Wishlist = require("../../../models/Wishlist");
const ObjectId = require('mongoose').Types.ObjectId;
const objectId = require('mongodb').ObjectId;

router.post("/", function (req, res) {
   let { price,productName,description, size } = req.body;

  if (!price || !productName|| !description || !size ) {
    return res.status(400).json(HTTPResp.error('badRequest'));
   }
   User.findOne({phone:req.currentUser.phone_number},(err, user) => {
    if (err) {
      return res.status(500).json(HTTPResp.error("serverError"));
    }
       if (!user) {
      return res.status(400).json(HTTPResp.error('notFound','user not found'));
    }
       newWishlist = new Wishlist({
        user:user._id,
        productName: productName,
        description:description,
        size:size,
        price: price
      });
     newWishlist.save((err, result) => {
      if (err) {
         return res.status(500).json(HTTPResp.error("serverError"));
      }
      if(result){
        return res.status(201).json(HTTPResp.created("wishlist"));
       }
    });
});
})
 
router.get("/", function (req, res) {
    Wishlist.find( (err, result) => {
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
    Wishlist.deleteOne({"_id":objectId(id)}, function(err,result){
        if(result){
            res.status(200).json(HTTPResp.ok());
         }
        if(err){
            return res.status(400).json(HTTPResp.error('error'));
        }
    })
})
  module.exports = router;
