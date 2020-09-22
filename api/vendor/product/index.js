const router = require("express").Router();
const env = require("../../../config/env");
const config = require("../../../config")[env];
const HTTPResp = require("../../../utils/HTTPResp");
const Product = require("../../../models/Product");
const Price = require("../../../models/Price");
const ObjectId = require('mongoose').Types.ObjectId;
const objectId = require('mongodb').ObjectId;

router.post("/", function (req, res) {
  let { productName, price } = req.body;

  if (!productName || !price) {
    return res.status(400).json(HTTPResp.error('badRequest'));
  }

  newProduct = new Product({
    productName,
    price
  });
  newProduct.save((err, result) => {
    if (err) {
      return res.status(500).json(HTTPResp.error("serverError"));
    }
    if (result) {
      return res.status(201).json(HTTPResp.created("product"));
    }
  });
});

router.get("/", function (req, res) {
  Product.find((err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!result) {
      return res.status(404).json(HTTPResp.error('notFound', 'product'));
    }
    res.status(200).json(HTTPResp.ok({ result }));
  });
});

router.put("/:id", function (req, res) {
  let { id } = req.query;
  if (!ObjectId.isValid(id)) {
    res.status(400).send(`Invalid id: ${id}`);
  }
  const reg = {
    productName: req.body.productName,
    price: req.body.price
  }
  Product.updateOne({ "_id": objectId(id) }, { $set: reg }, function (err, result) {
    if (err) {
      return res.status(400).json(HTTPResp.error('error'));
    }
    if (result) {
      res.status(200).json(HTTPResp.ok());
    }

  })
});
router.delete("/:id", function (req, res) {
  let { id } = req.query;
  if (!ObjectId.isValid(id)) {
    res.status(400).send(`Invalid id: ${id}`);
  }
  Product.deleteOne({ "_id": objectId(id) }, function (err, result) {
    if (err) {
      return res.status(400).json(HTTPResp.error('error'));
    }
    if (result) {
      res.status(200).json(HTTPResp.ok());
    }


  })
})
module.exports = router;
