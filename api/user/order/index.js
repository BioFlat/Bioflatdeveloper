const router = require("express").Router();
const env = require("../../../config/env");
const config = require("../../../config")[env];
const HTTPResp = require("../../../utils/HTTPResp");
const Myorder = require("../../../models/Myorder");
const Address = require("../../../models/Address");

 
router.post("/", function (req, res) {
     let email = req.email

    Address.findOne({email:email}, (err, result) => {
         let newOrder = {
        product: req.body.houseNumber,
        Delivery: result,
        status: req.body.status,
        email:email
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
 
router.get("/", function (req, res) {
       let email = req.email
  
    Myorder.find({"email":email}, (err, result) => {
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
