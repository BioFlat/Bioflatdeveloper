const router = require("express").Router();
const env = require("../../../config/env");
const config = require("../../../config")[env];
const HTTPResp = require("../../../utils/HTTPResp");
const Store = require("../../../models/Store");
var ObjectId = require('mongoose').Types.ObjectId;
var objectId = require('mongodb').ObjectId;

router.post("/", function (req, res) {
  let { storeTitle, storeDescription, rating, latitude, longitude } = req.body;
  let { user_id } = req.currentUser;

  if (!storeTitle || !storeDescription || !rating || !latitude || !longitude) {
    return res.status(400).json(HTTPResp.error('badRequest'));
  }
  try {
    newStore = new Store({
      userId:user_id,
      storeTitle,
      storeDescription,
      rating,
      latitude,
      longitude
    });
    newStore.save((err, store) => {
      if (err) {
        return res.status(500).json(HTTPResp.error("serverError"));
      }
      if (store) {
        return res.status(201).json(HTTPResp.created("store"));
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(HTTPResp.error("serverError"));
  }
});


router.get("/", function (req, res) {
  let { user_id } = req.currentUser;
  Store.find({userId:user_id},(err, store) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!store) {
      return res.status(404).json(HTTPResp.error('notFound', 'store'));
    }
    res.status(200).json(HTTPResp.ok({ store }));
  });
});

router.put("/:id", function (req, res) {
  let { id } = req.params;
  if (!ObjectId.isValid(id)) {
    res.status(400).send(`Invalid id: ${id}`);
  }
  const reg = {
    storeTitle: req.body.storeTitle,
    storeDescription: req.body.storeDescription,
    rating: req.body.rating,
    latitude: req.body.latitude,
    longitude: req.body.longitude
  }
  Store.updateOne({ "_id": objectId(id) }, { $set: reg }, function (err, result) {
    if (err) {
      return res.status(400).json(HTTPResp.error('error'));
    }
    if (result) {
      res.status(200).json(HTTPResp.ok());
    }

  })
})

router.delete("/:id", function (req, res) {
  let { id } = req.params;
  if (!ObjectId.isValid(id)) {
    res.status(400).send(`Invalid id: ${id}`);
  }
  Store.deleteOne({ "_id": objectId(id) }, function (err, result) {
    if (err) {
      return res.status(400).json(HTTPResp.error('error'));
    }
    if (result) {
      res.status(200).json(HTTPResp.ok());
    }

  })
})
module.exports = router;
