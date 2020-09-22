const router = require('express').Router(); 
const store = require('./store')
const account_registration = require("./account_registration")
const inventory = require('./inventory')
const product = require('./product')
    
router.use('/store',store)
router.use('/account_registration',account_registration)
router.use('/inventory',inventory)
router.use('/product',product)
module.exports = router;