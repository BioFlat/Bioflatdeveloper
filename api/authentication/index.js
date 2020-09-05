const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const env = require("../../config/env");
const config = require("../../config")[env];
const User = require("../../models/User");
const HTTPResp = require("../../utils/HTTPResp");
var ObjectId = require('mongoose').Types.ObjectId;
var objectId = require('mongodb').ObjectId;


router.post("/createUser", function (req, res) {
   let {name, email, password, confirmPassword, phone } = req.body;

  if (!email || !password || !confirmPassword || !name || !phone) {
    return res.status(400).json(HTTPResp.error('badRequest'));
  }
  if (password != confirmPassword) {
    return res.status(400).json(HTTPResp.passwordMismatch);
  }
  User.findOne({ email: email }, (err, user) => {
    if (err) {
      return res.status(500).json(HTTPResp.error("serverError"));
    }
    if (user) {
      return res.status(400).json(HTTPResp.error('exists','user'));
    }
    let hashedPassword = bcrypt.hashSync(password, 8);
    let newUser = {
      email: req.body.email,
      password: hashedPassword,
      name: req.body.name,
      phone: req.body.phone
    };
  
    newUser = new User(newUser);
    newUser.save((err, user) => {
      if (err) {
        console.log(err);
        return res.status(500).json(HTTPResp.error("serverError"));
      }
      return res.status(201).json(HTTPResp.created("user"));
    });
  });
});

router.get("/getProfile", function (req, res) {

  var token = req.headers['token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    req.email = decoded.email;
    let email = req.email

  User.findOne({"email":email}, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!result) {
      return res.status(404).json(HTTPResp.error('notFound'));
    }
        res.status(200).json(HTTPResp.ok({result}));
   });
  })
});

router.put("/updateProfile", function (req,res){
  var token = req.headers['token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    req.email = decoded.email;
    let email = req.email
  let {password} = req.body;
  let hashedPassword = bcrypt.hashSync(password, 8);
  const reg = {
    email: req.body.email,
    password: hashedPassword,
    name: req.body.name,
    phone: req.body.phone
  }
  User.updateOne({"email":email},{ $set: reg}, function(err,result){
     if(result){
         res.status(200).json(HTTPResp.ok());
      }
     if(err){
         return res.status(400).json(HTTPResp.error('error'));
     }
  })
})
});

router.post("/login", function (req, res) {
  
  const { email, password } = req.body;

  if (!email || !password ) {
    return res.status(400).json(HTTPResp.error('badRequest'));
  }

  User.findOne({ email: email }, (err, user) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!user) {
      return res.status(404).json(HTTPResp.error('notFound','Input not valid'));
    }

    if (user.email == email && bcrypt.compareSync(password, user.password)) {
      let token = jwt.sign(
        { email: user.email },
        config.secret,
        {
          expiresIn: 86400,
        }
      );
      res.status(200).json(HTTPResp.ok({ accessToken: token,  email: user.email }));
    } else {
      res.status(401).json(HTTPResp.error('invalidCredential'));
    }
  });
});

module.exports = router;
