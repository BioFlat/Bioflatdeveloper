const router = require("express").Router();
const Cart = require("../../../models/Cart");
const HTTPResp = require("../../../utils/HTTPResp");
const ObjectId = require("mongoose").Types.ObjectId;
const objectId = require("mongodb").ObjectId;

router.post("/", function (req, res) {
  let { productId, quantity, price } = req.body;
  if (!ObjectId.isValid(productId)) {
    res.status(400).send(`Invalid productId: ${productId}`);
  }
  let { user_id } = req.currentUser;
  
  if (!price || !productId || !quantity) {
    return res.status(400).json(HTTPResp.error("badRequest"));
  }

  let newCart = new Cart({
    userId: user_id,
    product: productId,
    quantity: quantity,
    price: price
  });

  newCart.save((err, result) => {
    if (err) {
      return res.status(500).json(HTTPResp.error("serverError"));
    }
    if (result) {
      return res.status(201).json(HTTPResp.created("cart item"));
    }
  });
});

router.get("/", function (req, res) {
  let { user_id } = req.currentUser;
  Cart.find({userId:user_id},(err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!result) {
      return res.status(404).json(HTTPResp.error("notFound", "cart items"));
    }
    res.status(200).json(HTTPResp.ok(result));
  }).populate('product')
});

router.delete("/:id", function (req, res) {
  let { id } = req.params;
  if (!ObjectId.isValid(id)) {
    res.status(400).send(`Invalid id: ${id}`);
  }
  Cart.deleteOne({ _id: objectId(id) }, function (err, result) {
    if (err) {
      return res.status(400).json(HTTPResp.error("error"));
    }
    if (result) {
      res.status(200).json(HTTPResp.ok());
    }
  });
});
module.exports = router;
