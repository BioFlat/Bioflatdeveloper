const router = require('express').Router(); 
const auth = require('./authentication');
 const address = require("./address")
 const price = require('./price')
const cart = require("./cart")
const wishlist = require("./wishList");
const order = require("./order")
const notification = require("./notification")
   
router.use('/auth',auth)
router.use('/address',address)
router.use('/price',price)
router.use('/cart',cart)
router.use('/wishlist',wishlist)
router.use('/order',order)
router.use('/notification',notification)

module.exports = router;