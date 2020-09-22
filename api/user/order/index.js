const router = require("express").Router();
const env = require("../../../config/env");
const config = require("../../../config")[env];
const User = require("../../../models/User");
const HTTPResp = require("../../../utils/HTTPResp");
const Myorder = require("../../../models/Myorder");
const Address = require("../../../models/Address");


router.post("/", function (req, res) {
  let { product, status } = req.body;
  let { user_id } = req.currentUser;

  if (!product || !status) {
    return res.status(400).json(HTTPResp.error('badRequest'));
  }

  Address.findOne({ userId: user_id }, (err, result) => {

    try {
      newOrder = new Myorder({
        userId: user_id,
        product,
        Delivery: result,
        status
      });

      newOrder.save((err, store) => {
        if (err) {
          return res.status(500).json(HTTPResp.error("serverError"));
        }
        if (store) {
          return res.status(201).json(HTTPResp.created("order"));
        }
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json(HTTPResp.error("serverError"));
    }
  })

});


router.get("/", function (req, res) {
  let { user_id } = req.currentUser;
  Myorder.find({ userId: user_id }, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!result) {
      return res.status(404).json(HTTPResp.error('notFound'));
    }
    res.status(200).json(HTTPResp.ok({ result }));
  });
});

module.exports = router;
