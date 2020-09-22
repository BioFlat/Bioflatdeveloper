const router = require("express").Router();
const env = require("../../../config/env");
const config = require("../../../config")[env];
const HTTPResp = require("../../../utils/HTTPResp");
const User = require("../../../models/User");
const Wishlist = require("../../../models/Wishlist");
const ObjectId = require('mongoose').Types.ObjectId;
const objectId = require('mongodb').ObjectId;

router.post("/", function (req, res) {
  let { user_id } = req.currentUser;
   let { price,productName,description, size } = req.body;

  if (!price || !productName|| !description || !size ) {
    return res.status(400).json(HTTPResp.error('badRequest'));
   }
 try{
       newWishlist = new Wishlist({
        userId:user_id,
        productName,
        description,
        size,
        price
      });
     newWishlist.save((err, result) => {
      if (err) {
         return res.status(500).json(HTTPResp.error("serverError"));
      }
      if(result){
        return res.status(201).json(HTTPResp.created("wishlist"));
       }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(HTTPResp.error("serverError"));
  }
});

 
router.get("/", function (req, res) {
  let { user_id } = req.currentUser;

    Wishlist.find({userId:user_id}, (err, result) => {
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
     let {id} = req.params;
    if (!ObjectId.isValid(id)) {
    res.status(400).send(`Invalid id: ${id}`);
    }
    Wishlist.deleteOne({"_id":objectId(id)}, function(err,result){
      if(err){
        return res.status(400).json(HTTPResp.error('error'));
    }
        if(result){
            res.status(200).json(HTTPResp.ok());
         }
        
    })
})
  module.exports = router;
