const router = require("express").Router();
const Cart = require("../../../models/Cart");
const HTTPResp = require("../../../utils/HTTPResp");
const User = require("../../../models/User");
const ObjectId = require('mongoose').Types.ObjectId;
const objectId = require('mongodb').ObjectId;

router.post("/", function (req, res) {

  let { product, quantity, price } = req.body;
  let { user_id } = req.currentUser;

  if (!product || !quantity || !price) {
    return res.status(400).json(HTTPResp.error('badRequest'));
  }

  try {

    let newCart = new Cart({
      userId: user_id,
      product,
      quantity,
      price
    });
    newCart.save((err, result) => {
      if (err) {
        return res.status(500).json(HTTPResp.error("serverError"));
      }
      if (result) {
        return res.status(201).json(HTTPResp.created("cart"));
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(HTTPResp.error("serverError"));
  }
});


router.get("/", function (req, res) {
  let { user_id } = req.currentUser;
  Cart.find({ userId: user_id }, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!result) {
      return res.status(404).json(HTTPResp.error('notFound', 'price'));
    }
    res.status(200).json(HTTPResp.ok({ result }));
  });
});
router.delete("/:id", function (req, res) {
  let { id } = req.params;
  if (!ObjectId.isValid(id)) {
    res.status(400).send(`Invalid id: ${id}`);
  }
  Cart.deleteOne({ "_id": objectId(id) }, function (err, result) {
    if (err) {
      return res.status(400).json(HTTPResp.error('error'));
    }
    if (result) {
      res.status(200).json(HTTPResp.ok());
    }
  })
})
module.exports = router;
