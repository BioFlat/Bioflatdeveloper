const router = require('express').Router(); 
const verifyToken = require('../utils/verifyToken');
const auth = require('./auth');
const user = require('./user')
const vendor = require('./vendor')
 
router.use('/auth',auth)
router.use('/user',verifyToken,user) 
router.use('/vendor',verifyToken,vendor)
 
module.exports = router;