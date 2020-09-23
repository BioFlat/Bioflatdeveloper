const router = require("express").Router();
const formidable = require("formidable");
const Account = require("../../../models/Account");
const StoreInventory = require("../../../models/StoreInventory");
const HTTPResp = require("../../../utils/HTTPResp");
const fs = require('fs');
const path = require('path');
const ObjectId = require("mongoose").Types.ObjectId;
const objectId = require("mongodb").ObjectId;



router.post("/", function (req, res) {

  const { user_id } = req.currentUser;
  const form = new formidable.IncomingForm();

  let newPath = path.resolve(__dirname + '../../../../uploads/storeLogo');

  form.parse(req, function (err, fields, files) {
    if (err) {
      return res.status(500).json(HTTPResp.error("serverError"));
    }
    const oldPath = files.storeLogo.path;
    const rawData = fs.readFileSync(oldPath)
    const fileName = user_id + '.' + files.storeLogo.name.split('.')[1];
    newPath += '/' + fileName;
    fs.writeFile(newPath, rawData, function (err) {
      if (err) {
        return res.status(500).json(HTTPResp.error("serverError"));
      }
      const ownerName = fields.ownerName,
        storeName = fields.storeName,
        address = fields.address,
        city = fields.city,
        state = fields.state,
        pincode = fields.pincode,
        latitude = fields.latitude,
        longitude = fields.longitude;
      if (!ownerName || !storeName || !address || !city || !state || !pincode || !latitude || !longitude) {
        return res.status(400).json(HTTPResp.error("badRequest"));
      }

      StoreInventory.findOne({ vendorId: user_id }, (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json(HTTPResp.error("serverError"));
        }
        if (result) {
          return res.status(400).json(HTTPResp.error("exists", "vendor account"));
        }
        let storeInventory = new StoreInventory({
          vendorId: user_id,
          storeName,
          latitude,
          longitude,
          imageRef: '/storeLogo/' + fileName
        })
        storeInventory.save((err) => {
          if (err) {
            console.log(err);
            return res.status(500).json(HTTPResp.error("serverError"));
          }
          let newAccount = new Account({
            vendorId: user_id,
            store: storeInventory._id,
            ownerName,
            address,
            city,
            state,
            pincode
          });
          newAccount.save((err) => {
            if (err) {
              console.log(err);
              return res.status(500).json(HTTPResp.error("serverError"));
            }
            return res.status(201).json(HTTPResp.created("vendor account"));
          });
        })

      })
    })
  })
})

router.get("/", function (req, res) {
  const { user_id } = req.currentUser;
  Account.findOne({ vendorId: user_id }, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!result) {
      return res.status(404).json(HTTPResp.error('notFound', 'vendor account'));
    }
    return res.status(200).json(HTTPResp.ok(result));
  });
});


router.put("/", function (req, res) {

  const { user_id } = req.currentUser;

  const {
    ownerName, storeName, address, city, state, pincode, latitude, longitude
  } = req.body;
  if (!ownerName || !storeName || !address || !city || !state || !pincode || !latitude || !longitude) {
    return res.status(400).json(HTTPResp.error("badRequest"));
  }
  Account.updateOne({ vendorId: user_id }, { $set: { ownerName, storeName, address, city, state, pincode, latitude, longitude } }, function (err, result) {
    if (err) {
      return res.status(400).json(HTTPResp.error("serverError"));
    }
    return res.status(200).json(HTTPResp.ok());
  });
})

router.delete("/", function (req, res) {

  const { user_id } = req.currentUser;

  Account.deleteOne({ vendorId: user_id }, function (err, result) {
    if (err) {
      return res.status(500).json(HTTPResp.error("serverError"));
    }
    if (result) {
      return res.status(200).json(HTTPResp.ok());
    }
  });
});

module.exports = router;