const router = require('express').Router();
const address = require("./address")
const cart = require("./cart")
const wishlist = require("./wishList");
const order = require("./order")
const notification = require("./notification")
const profile = require("./profile")

router.use('/address', address)
router.use('/cart', cart)
router.use('/wishlist', wishlist)
router.use('/order', order)
router.use('/notification', notification)
router.use('/profile', profile)

module.exports = router;