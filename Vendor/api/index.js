const router = require('express').Router(); 
const auth = require('./authentication');
const login = require('./login');
const otpVerification = require('./otpVerification');
    
router.use('/auth',auth)
router.use('/login',login)
router.use('/otpVerification',otpVerification)
 
module.exports = router;