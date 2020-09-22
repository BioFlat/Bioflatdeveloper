const router = require("express").Router();
const HTTPResp = require("../../../utils/HTTPResp");
const Address = require("../../../models/Address");
const Profile = require("../../../models/Profile");
const ObjectId = require("mongoose").Types.ObjectId;
const objectId = require("mongodb").ObjectId;

router.post("/", function (req, res) {

  let { addressName, address, city, state, pincode } = req.body;
  let { user_id } = req.currentUser;

  if (!addressName || !address || !city || !state || !pincode) {
    return res.status(400).json(HTTPResp.error("badRequest"));
  }

  try {

    let newAddress = new Address({
      userId: user_id,
      addressName,
      address,
      city,
      state,
      pincode
    });
    newAddress.save((err, address) => {
      if (err) {
        console.log(err)
        return res.status(500).json(HTTPResp.error("serverError"));
      }
      Profile.findOneAndUpdate({ userId: user_id }, { $inc: { addressCount: 1 } }, { new: true, upsert: true }, (err, result) => {
        if (err) {
          console.log(err)
          return res.status(500).json(HTTPResp.error("serverError"));
        }
        return res.status(201).json(HTTPResp.created('address'));
      })

    });

  } catch (err) {
    console.log(err);
    return res.status(500).json(HTTPResp.error("serverError"));
  }
});


router.get("/", function (req, res) {
  let { user_id } = req.currentUser;
  Address.find({ userId: user_id }, (err, result) => {
    if (err) {
      return res.status(500).json(HTTPResp.error("serverError"));
    }
    return res.status(200).json(HTTPResp.ok(result));
  })

});

router.get("/:id", function (req, res) {
  let { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json(HTTPResp.error('badRequest', `Invalid id: ${id}`));
  }
  Address.findOne({ _id: objectId(id) }, (err, result) => {
    if (err) {
      return res.status(500).json(HTTPResp.error("serverError"));
    }
    if (!result) {
      return res.status(404).json(HTTPResp.error("notFound", "address"));
    }
    return res.status(200).json(HTTPResp.ok(result));
  });
});

router.put("/:id", function (req, res) {
  let { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json(HTTPResp.error('badRequest', `Invalid id: ${id}`));
  }
  let { addressName, address, city, state, pincode } = req.body;
  if (!addressName || !address || !city || !state || !pincode) {
    return res.status(400).json(HTTPResp.error("badRequest"));
  }
  Address.updateOne({ _id: objectId(id) }, { $set: { addressName, address, city, state, pincode } }, function (err, result) {
    if (err) {
      return res.status(400).json(HTTPResp.error("serverError"));
    }
    return res.status(200).json(HTTPResp.ok());
  });
});

router.delete("/:id", function (req, res) {
  let { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json(HTTPResp.error('badRequest', `Invalid id: ${id}`));
  }
  Address.deleteOne({ _id: objectId(id) }, function (err, result) {
    if (err) {
      return res.status(500).json(HTTPResp.error("serverError"));
    }
    if (result) {
      return res.status(200).json(HTTPResp.ok());
    }
  });
});

module.exports = router;
