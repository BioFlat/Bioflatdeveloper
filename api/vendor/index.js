const router = require('express').Router(); 
const store = require('./store')
const account = require("./account")
const product = require('./product')
    
router.use('/store',store)
router.use('/account',account)
router.use('/product',product)
 
module.exports = router;