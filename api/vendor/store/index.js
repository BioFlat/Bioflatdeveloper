const router = require("express").Router();
const HTTPResp = require("../../../utils/HTTPResp");
const StoreCategory = require("../../../models/StoreCategory");
const StoreInventory = require("../../../models/StoreInventory");
var ObjectId = require("mongoose").Types.ObjectId;
var objectId = require("mongodb").ObjectId;

router.get("/", function (req, res) {
  StoreInventory.find((err, store) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!store) {
      return res.status(404).json(HTTPResp.error("notFound", "store"));
    }
    res.status(200).json(HTTPResp.ok(store));
  }).populate('products');
});

router.get("/:id", function (req, res) {
  let { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(400).send(`Invalid id: ${id}`);
  }
  StoreInventory.find({ _id: id }, (err, store) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!store) {
      return res.status(404).json(HTTPResp.error("notFound", "store"));
    }
    res.status(200).json(HTTPResp.ok(store));
  }).populate('products');
});

router.get("/:id", function (req, res) {
  let { user_id } = req.currentUser;
  StoreInventory.find({ vendorId: user_id }, (err, store) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!store) {
      return res.status(404).json(HTTPResp.error("notFound", "store"));
    }
    res.status(200).json(HTTPResp.ok(store));
  }).populate('products');
});

router.put("/:id", function (req, res) {
  let { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(400).send(`Invalid id: ${id}`);
  }
  const reg = {
    rating: req.body.rating
  };
  StoreInventory.updateOne({ _id: objectId(id) }, { $set: reg }, function (err, result) {
    if (err) {
      return res.status(400).json(HTTPResp.error("error"));
    }
    if (result) {
      res.status(200).json(HTTPResp.ok());
    }
  });
});



router.post("/category", function (req, res) {

  let { category } = req.body;

  if (!category) {
    return res.status(400).json(HTTPResp.error("badRequest"));
  }
  try {
    StoreCategory.findOne({ category: category }, (err, store) => {
      if (err) {
        return res.status(500).json(HTTPResp.error("serverError"));
      }
      if (store) {
        return res.status(400).json(HTTPResp.error("exists", "category"));
      }
      let newStoreCategory = new StoreCategory({
        storeType: storeType
      });
      newStoreCategory.save((err, store) => {
        if (err) {
          return res.status(500).json(HTTPResp.error("serverError"));
        }
        if (store) {
          return res.status(201).json(HTTPResp.created("store category"));
        }
      });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(HTTPResp.error("serverError"));
  }
});

router.get("/category", function (req, res) {
  StoreCategory.find({}, (err, categories) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (categories.length == 0) {
      return res.status(404).json(HTTPResp.error("notFound", "store categories"));
    }
    return res.status(200).json(HTTPResp.ok(categories));
  });
});

router.put("/category/:id", function (req, res) {
  let { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(400).send(`Invalid id: ${id}`);
  }
  const reg = {
    storeType: storeType
  };
  StoreCategory.updateOne({ _id: objectId(id) }, { $set: reg }, function (err, result) {
    if (err) {
      return res.status(400).json(HTTPResp.error("error"));
    }
    return res.status(200).json(HTTPResp.ok());

  });
});

router.delete("/category/:id", function (req, res) {
  let { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(400).send(`Invalid id: ${id}`);
  }
  StoreCategory.deleteOne({ _id: objectId(id) }, function (err, result) {
    if (err) {
      return res.status(400).json(HTTPResp.error("error"));
    }
    return res.status(200).json(HTTPResp.ok());

  });
});

module.exports = router;
