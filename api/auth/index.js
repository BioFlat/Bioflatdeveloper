const router = require("express").Router();
const jwt = require("jsonwebtoken");
const env = require("../../config/env");
const config = require("../../config")[env];
const login = require("../../models/login");
const HTTPResp = require("../../utils/HTTPResp");


router.post("/login", function (req, res) {
    let { phone } = req.body;
 
   if (!phone) {
     return res.status(400).json(HTTPResp.error('badRequest'));
   }
      newLogin = new login({
      phone: req.body.phone
     });
     newLogin.save((err, user) => {
       if (err) {
          return res.status(500).json(HTTPResp.error("serverError"));
       }
       return res.status(201).json("Accepted");
     });
 });

 router.post("/OTP", function (req, res) {
  
  const { OTP } = req.body;

  if (!OTP) {
    return res.status(400).json(HTTPResp.error('badRequest'));
  }

  login.findOne((err, user) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!user) {
      return res.status(404).json(HTTPResp.error('notFound','Input not valid'));
    }

    if (user.phone == "0123456789" && req.body.OTP == "123456") {
      let token =jwt.sign(
        {phone: user.phone},config.secret,{
          expiresIn: 604800
       });

      res.status(200).json(HTTPResp.ok({ accessToken: token,  phone: user.phone }));
    } else {
      res.status(401).json(HTTPResp.error('invalidCredential'));
    }
  });
});

 module.exports = router;

 