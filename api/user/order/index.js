const router = require("express").Router();
const env = require("../../../config/env");
const config = require("../../../config")[env];
const User = require("../../../models/User");
const HTTPResp = require("../../../utils/HTTPResp");
const Myorder = require("../../../models/Myorder");
const Address = require("../../../models/Address");

 
router.post("/", function (req, res) {
  let { product,status } = req.body;
      User.findOne({phone:req.currentUser.phone_number},(err, user) => {
      if (err) {
        return res.status(500).json(HTTPResp.error("serverError"));
      }
      if (!user) {
        return res.status(400).json(HTTPResp.error('notFound','user'));
      }
    Address.findOne({user:user._id}, (err, result) => {

         let newOrder = {
        user:user._id,
        product: product,
        Delivery: result.houseNumber && result.streetName,
        status: status,
        };
       newOrder = new Myorder(newOrder);
       newOrder.save((err, store) => {
      if (err) {
         return res.status(500).json(HTTPResp.error("serverError"));
      }
      if(store){
        return res.status(201).json(HTTPResp.created("order"));
       }
    });
  })
});
})
 
router.get("/", function (req, res) {
   
    Myorder.find( (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (!result) {
        return res.status(404).json(HTTPResp.error('notFound'));
      }
          res.status(200).json(HTTPResp.ok({result}));
     });
  });
  
 module.exports = router;
