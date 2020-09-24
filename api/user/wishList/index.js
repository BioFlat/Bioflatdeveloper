const router = require("express").Router();
const HTTPResp = require("../../../utils/HTTPResp");
const Wishlist = require("../../../models/Wishlist");
const ObjectId = require("mongoose").Types.ObjectId;
const objectId = require("mongodb").ObjectId;

router.post("/", function (req, res) {

  let { user_id } = req.currentUser;
  let { productId } = req.body;

  try {
    Wishlist.findOne({ product: productId }, (err, result) => {
      if (err) {
        return res.status(500).json(HTTPResp.error("serverError"));
      }
      if (result) {
        return res.status(201).json(HTTPResp.error("exists", 'item'));
      }
      let newWishlist = new Wishlist({
        userId: user_id,
        product: productId,
      });
      newWishlist.save((err, result) => {
        if (err) {
          return res.status(500).json(HTTPResp.error("serverError"));
        }
        if (result) {
          return res.status(201).json(HTTPResp.created("wishlist"));
        }
      });
    })

  } catch (err) {
    console.log(err);
    return res.status(500).json(HTTPResp.error("serverError"));
  }
});

router.get("/", function (req, res) {
  let { user_id } = req.currentUser;
  try {
    Wishlist.find({ userId: user_id }, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (result.length == 0) {
        return res.status(404).json(HTTPResp.error("notFound", "whislist"));
      }
      res.status(200).json(HTTPResp.ok(result));
    }).populate('product');
  } catch (err) {
    console.log(err);
    return res.status(500).json(HTTPResp.error("serverError"));
  }
});

router.delete("/:id", function (req, res) {
  let { id } = req.params;
  try {
    if (!ObjectId.isValid(id)) {
      res.status(400).send(`Invalid id: ${id}`);
    }
    Wishlist.deleteOne({ _id: objectId(id) }, function (err, result) {
      if (err) {
        return res.status(400).json(HTTPResp.error("error"));
      }
      if (result) {
        return res.status(200).json(HTTPResp.ok());
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(HTTPResp.error("serverError"));
  }
});

module.exports = router;
