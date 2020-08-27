const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const env = require("../../config/env");
const config = require("../../config")[env];
const User = require("../../models/User");
const HTTPResp = require("../../utils/HTTPResp");

router.post("/createUser", function (req, res) {

  let { email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword) {
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
      return res.status(404).json(HTTPResp.error('notFound','user'));
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
