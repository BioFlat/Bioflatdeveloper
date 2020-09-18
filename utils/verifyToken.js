const jwt = require('jsonwebtoken');
const env = require('../config/env')
const config = require('../config')[env];
const SECRET_KEY = "jsonwebtokensupersecretkey"

const verifyToken = (req, res, next) => {
  let  token = req.headers['authorization'];
  if (!token)
    return res.status(403).send({ auth: false, message: 'No token provided.' });
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err)
    return res.status(403).send({ auth: false, message: 'Failed to authenticate token.' });
    payload = jwt.decode(token, config.secret);
    req.phone = payload.phone
      next();
     
   });
}

const generateToken = (userData) => {
  return jwt.sign(userData, config.secret, {
    expiresIn: 604800
});
}

module.exports = {verifyToken,generateToken};