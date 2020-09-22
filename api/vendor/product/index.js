const router = require("express").Router();
const env = require("../../../config/env");
const config = require("../../../config")[env];
const HTTPResp = require("../../../utils/HTTPResp");
const Product = require("../../../models/Product");
const Price = require("../../../models/Price");
const Account = require("../../../models/Account");
const fs = require('fs');
const path = require('path');
const formidable = require("formidable");
const ObjectId = require("mongoose").Types.ObjectId;
const objectId = require("mongodb").ObjectId;

router.post("/", function (req, res) {
  const { user_id } = req.currentUser;
  const form = new formidable.IncomingForm();

  let newPath = path.resolve(__dirname + '../../../../uploads/productImage');

  form.parse(req, function (err, fields, files) {
    if (err) {
      return res.status(500).json(HTTPResp.error("serverError"));
    }
    const oldPath = files.productImage.path;
    const rawData = fs.readFileSync(oldPath)
    const fileName = user_id + '.' + files.productImage.name.split('.')[1];
    newPath += '/' + fileName;
    fs.writeFile(newPath, rawData, function (err) {
      if (err) {
        return res.status(500).json(HTTPResp.error("serverError"));
      }
      const itemName = fields.itemName,
        description = fields.description,
        category = fields.category,
        subCategory = fields.subCategory,
        quantityAvailable = fields.quantityAvailable,
        price = fields.price
      if (!itemName || !description || !category || !subCategory || !quantityAvailable || !price) {
        return res.status(400).json(HTTPResp.error("badRequest"));
      }
      let newProduct = new Product({
        vendorId: user_id,
        itemName,
        description,
        category,
        subCategory,
        quantityAvailable,
        price,
        productImage: '/productImage/' + fileName
      });
      newProduct.save((err) => {
        if (err) {
          console.log(err);
          return res.status(500).json(HTTPResp.error("serverError"));
        }
        Account.findOneAndUpdate({ vendorId: user_id }, { $inc: { productCount: 1 } }, { new: true, upsert: true }, (err, result) => {
          if (err) {
            console.log(err)
            return res.status(500).json(HTTPResp.error("serverError"));
          }
        })
        return res.status(201).json(HTTPResp.created("product"));
      });
    })
  })
})

router.get("/", function (req, res) {
  const { user_id } = req.currentUser;
  Product.findOne({ vendorId: user_id }, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!result) {
      return res.status(404).json(HTTPResp.error('notFound'));
    }
    return res.status(200).json(HTTPResp.ok(result));
  });
});

router.put("/:id", function (req, res) {
  const { user_id } = req.currentUser;
  let { id } = req.query;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json(HTTPResp.error('badRequest', `Invalid id: ${id}`));
  }
  const form = new formidable.IncomingForm();

  let newPath = path.resolve(__dirname + '../../../../uploads/productImage');

  form.parse(req, function (err, fields, files) {
    if (err) {
      return res.status(500).json(HTTPResp.error("serverError"));
    }
    const oldPath = files.productImage.path;
    const rawData = fs.readFileSync(oldPath)
    const fileName = user_id + '.' + files.productImage.name.split('.')[1];
    newPath += '/' + fileName;
    fs.writeFile(newPath, rawData, function (err) {
      if (err) {
        return res.status(500).json(HTTPResp.error("serverError"));
      }
       const itemName = fields.itemName,
        description = fields.description,
        category = fields.category,
        subCategory = fields.subCategory,
        quantityAvailable = fields.quantityAvailable,
        price = fields.price

      if (!itemName || !description || !category || !subCategory || !quantityAvailable || !price) {
        return res.status(400).json(HTTPResp.error("badRequest"));
      }
      Product.updateOne({ _id: objectId(id), vendorId: user_id }, { $set: { itemName, description, category, subCategory, quantityAvailable, price, productImage: '/productImage/' + fileName } }, function (err, result) {
        if (err) {
          return res.status(400).json(HTTPResp.error("serverError"));
        }
        return res.status(200).json(HTTPResp.ok());
      });
    });
  })
})

router.delete("/:id", function (req, res) {
  let { id } = req.query;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json(HTTPResp.error('badRequest', `Invalid id: ${id}`));
  }
  Product.deleteOne({ _id: objectId(id) }, function (err, result) {
    if (err) {
      return res.status(500).json(HTTPResp.error("serverError"));
    }
    if (result) {
      return res.status(200).json(HTTPResp.ok());
    }
  });
});

module.exports = router;
