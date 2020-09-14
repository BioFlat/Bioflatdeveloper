const router = require('express').Router(); 
const auth = require('./authentication');
const store = require('./store');
const address = require("./address")
const product = require("./product")
const price = require('./price')
const cart = require("./cart")
const wishlist = require("./wishList");
const myOrder = require("./myOrder")
const notification = require("./notification")
   
router.use('/auth',auth)
router.use('/Store',store) 
router.use('/Address',address)
router.use('/Product',product)
router.use('/Price',price)
router.use('/Cart',cart)
router.use('/Wishlist',wishlist)
router.use('/myOrder',myOrder)
router.use('/Notification',notification)

module.exports = router;