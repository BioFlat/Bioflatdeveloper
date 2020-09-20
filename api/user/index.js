const router = require('express').Router(); 
const user = require('./profile');
 const address = require("./address")
 const price = require('./price')
const cart = require("./cart")
const wishlist = require("./wishList");
const order = require("./order")
const notification = require("./notification")
const profile = require("./profile")
   
router.use('/user',user)
router.use('/address',address)
router.use('/price',price)
router.use('/cart',cart)
router.use('/wishlist',wishlist)
router.use('/order',order)
router.use('/notification',notification)
router.use('/profile',profile)

module.exports = router;