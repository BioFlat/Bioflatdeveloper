const router = require('express').Router(); 
const {decodeIDToken} = require('../utils/Token');
const auth = require('./auth');
const user = require('./user')
const vendor = require('./vendor')
 
router.use('/auth',auth)
router.use('/user',decodeIDToken,user) 
router.use('/vendor',decodeIDToken,vendor)

module.exports = router;