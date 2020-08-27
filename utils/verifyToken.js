const jwt = require('jsonwebtoken');
const env = require('../config/env')
const config = require('../config')[env];
function verifyToken(req, res, next) {
  let  token = req.headers['authorization'].split(" ")[1];
  if (!token)
    return res.status(403).send({ auth: false, message: 'No token provided.' });
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err)
    return res.status(403).send({ auth: false, message: 'Failed to authenticate token.' });
    req.email = decoded.email;
    next();
  });
}
module.exports = verifyToken;