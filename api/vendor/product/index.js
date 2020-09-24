const router = require("express").Router();
const formidable = require("formidable");
const HTTPResp = require("../../../utils/HTTPResp");
const Product = require("../../../models/Product");
const StoreInventory = require("../../../models/StoreInventory");
const ObjectId = require("mongoose").Types.ObjectId;
const objectId = require("mongodb").ObjectId;
const fs = require('fs');
const path = require('path');

router.post("/", function (req, res) {
  const { user_id } = req.currentUser;
  try {
    const form = new formidable.IncomingForm();

    let newPath = path.resolve(__dirname + "../../../../uploads/productImage");

    form.parse(req, function (err, fields, files) {
      if (err) {
        return res.status(500).json(HTTPResp.error("serverError"));
      }
      const oldPath = files.productImage.path;
      const rawData = fs.readFileSync(oldPath);
      const fileName =
        "product" +
        new Date().valueOf() +
        "." +
        files.productImage.name.split(".")[1];
      newPath += "/" + fileName;
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
        storeId = fields.storeId;
        if (
          !itemName ||
          !description ||
          !category ||
          !subCategory ||
          !quantityAvailable ||
          !price ||
          !storeId
        ) {
          return res.status(400).json(HTTPResp.error("badRequest"));
        }
        let newProduct = new Product({
          vendorId: user_id,
          store: storeId,
          itemName,
          description,
          category,
          subCategory,
          quantityAvailable,
          price,
          imageRef: "/productImage/" + fileName,
        });
        newProduct.save((err) => {
          if (err) {
            console.log(err);
            return res.status(500).json(HTTPResp.error("serverError"));
          }
          StoreInventory.findOneAndUpdate(
            { vendorId: user_id },
            { $inc: { productCount: 1 }, $push: { products: newProduct._id } },
            { new: true, upsert: true },
            (err, result) => {
              if (err) {
                console.log(err);
                return res.status(500).json(HTTPResp.error("serverError"));
              }
            }
          );
          return res.status(201).json(HTTPResp.created("product"));
        });
      });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(HTTPResp.error("serverError"));
  }
});

router.get("/store/:storeId", function (req, res) {
  const { storeId } = req.params;
  try {
    Product.find({ store: storeId }, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (!result) {
        return res.status(404).json(HTTPResp.error("notFound"));
      }
      return res.status(200).json(HTTPResp.ok(result));
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(HTTPResp.error("serverError"));
  }
});

router.get("/:id", function (req, res) {
  const { id } = req.params;
  try {
    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json(HTTPResp.error("badRequest", `Invalid id: ${id}`));
    }
    Product.findOne({ _id: id }, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (!result) {
        return res.status(404).json(HTTPResp.error("notFound"));
      }
      return res.status(200).json(HTTPResp.ok(result));
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(HTTPResp.error("serverError"));
  }
});

router.put("/:id", function (req, res) {
  let { id } = req.params;
  try {
    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json(HTTPResp.error("badRequest", `Invalid id: ${id}`));
    }
    const {
      itemName,
      description,
      category,
      subCategory,
      quantityAvailable,
      price,
    } = req.body;

    if (
      !itemName ||
      !description ||
      !category ||
      !subCategory ||
      !quantityAvailable ||
      !price
    ) {
      return res.status(400).json(HTTPResp.error("badRequest"));
    }
    Product.updateOne(
      { _id: objectId(id) },
      {
        $set: {
          itemName,
          description,
          category,
          subCategory,
          quantityAvailable,
          price
        },
      },
      function (err, result) {
        if (err) {
          return res.status(400).json(HTTPResp.error("serverError"));
        }
        return res.status(200).json(HTTPResp.ok());
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json(HTTPResp.error("serverError"));
  }
});

router.delete("/:id", function (req, res) {
  let { id } = req.params;
  try {
    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json(HTTPResp.error("badRequest", `Invalid id: ${id}`));
    }
    Product.deleteOne({ _id: objectId(id) }, function (err, result) {
      if (err) {
        return res.status(500).json(HTTPResp.error("serverError"));
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
