const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const env = require("../../../config/env");
const config = require("../../../config")[env];
const vendorLogin = require("../../../models/vendorLogin");
const HTTPResp = require("../../../utils/HTTPResp");
  
router.post("/otpVerification", function (req, res) {
  
    const { OTP } = req.body;
  
    if (!OTP) {
      return res.status(400).json(HTTPResp.error('badRequest'));
    }
  
    vendorLogin.findOne((err, user) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (!user) {
        return res.status(404).json(HTTPResp.error('notFound','Input not valid'));
      }
  
      if (user.phone == "0123456789" && req.body.OTP == "123456") {
        let token = jwt.sign(
          { phone: user.phone },
          config.secret,
          {
            expiresIn: 86400,
          }
        );
        res.status(200).json(HTTPResp.ok({ accessToken: token,  phone: user.phone }));
      } else {
        res.status(401).json(HTTPResp.error('invalidCredential'));
      }
    });
  });
  module.exports = router;

  