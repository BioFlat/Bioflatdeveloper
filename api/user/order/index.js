const router = require("express").Router();
const User = require("../../../models/User");
const HTTPResp = require("../../../utils/HTTPResp");
const Order = require("../../../models/Order");
const OrderItem = require("../../../models/OrderItem");
const Profile = require("../../../models/Profile");


router.post("/", function (req, res) {

  const { user_id } = req.currentUser;

  const {
    itemTotal, deliveryFee, orderItems,
    addressId, totalAmount, paymentDetails, storeId
  } = req.body;

  if (!itemTotal || !deliveryFee || !addressId || !totalAmount || !paymentDetails || !orderItems || !storeId) {
    return res.status(400).json(HTTPResp.error("badRequest"));
  }
  try {
    Profile.findOne({ userId: user_id }, (err, result) => {
      if (err) {
        return res.status(500).json(HTTPResp.error('serverError'));
      }
      if (!result) {
        return res.status(404).json(HTTPResp.error('notFound', 'user profile'));
      }
      orderItems.forEach(item => {
        let {
          productId,
          quantity,
          price
        } = item;
        if (!productId || !quantity || !price) {
          return res.status(400).json(HTTPResp.error("badRequest"));
        }

      });
      let profileId = result._id;
      OrderItem.insertMany(orderItems, (err, result) => {
        if (err) {
          return res.status(500).json(HTTPResp.error('serverError'));
        }

        let cartItemIds = result.map(item => item._id);

        let newOrder = new Order({
          userId: user_id,
          store: storeId,
          profile: profileId,
          orderItems: cartItemIds,
          address: addressId,
          action: 'Order Placed',
          actionOn: new Date(),
          orderItemCount: cartItemIds.length,
          itemTotal,
          deliveryFee,
          totalAmount,
          paymentDetails
        })

        newOrder.save((err) => {
          if (err) {
            return res.status(500).json(HTTPResp.error("serverError"));
          }
          return res.status(201).json(HTTPResp.created("order"));
        });
      })
    })
  } catch (err) {
    console.log(err);
    return res.status(500).json(HTTPResp.error("serverError"));
  }
})

router.get("/", function (req, res) {
  const { user_id } = req.currentUser;
  try{
  Order.find({ userId: user_id }, (err, result) => {
    if (err) {
      return res.status(500).json(HTTPResp.error('serverError'));
    }
    if (!result) {
      return res.status(404).json(HTTPResp.error('notFound'));
    }
    res.status(200).json(HTTPResp.ok(result));
  }).populate('orderItems').populate('profile').populate('address').populate('store');
} catch (err) {
  console.log(err);
  return res.status(500).json(HTTPResp.error("serverError"));
}
});

module.exports = router;
