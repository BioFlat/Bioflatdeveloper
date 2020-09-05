const router = require("express").Router();
const env = require("../../config/env");
const config = require("../../config")[env];
const Myorder = require("../../models/Myorder");
const Address = require("../../models/Address");
const HTTPResp = require("../../utils/HTTPResp");
 const jwt = require("jsonwebtoken");

 
router.post("/order", function (req, res) {

  var token = req.headers['token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    req.email = decoded.email;
    let email = req.email

    Address.findOne({"email":email}, (err, result) => {
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
 })

router.get("/getmyOrder", function (req, res) {
    var token = req.headers['token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      req.email = decoded.email;
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
})
module.exports = router;
