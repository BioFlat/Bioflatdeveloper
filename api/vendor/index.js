const router = require('express').Router(); 
const store = require('./store')
const account_registration = require("./account_registration")
const inventory = require('./inventory')
    
router.use('/store',store)
router.use('/account_registration',account_registration)
router.use('/inventory',inventory)
 
module.exports = router;