const router = require('express').Router(); 
const auth = require('./authentication');
const Store = require('./store');
const Address = require("./address")
const Product = require("./product")
const Price = require('./price')
const Cart = require("./cart")
const Wishlist = require("./wishList");
const myOrder = require("./myOrder")
const Notification = require("./notification")
   
router.use('/auth',auth)
router.use('/Store',Store) 
router.use('/Address',Address)
router.use('/Product',Product)
router.use('/Price',Price)
router.use('/Cart',Cart)
router.use('/Wishlist',Wishlist)
router.use('/myOrder',myOrder)
router.use('/Notification',Notification)

module.exports = router;