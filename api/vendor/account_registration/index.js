const router = require("express").Router();
 const env = require("../../../config/env");
 const formidable = require("formidable");
const config = require("../../../config")[env];
const Account = require("../../../models/Account");
const HTTPResp = require("../../../utils/HTTPResp");
const fs = require('fs');
const path = require('path');


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
      const ownersFullname = fields.ownersFullname,
      storeName = fields.storeName,
      address = fields.address,
      city = fields.city,
      state = fields.state,
      pincode = fields.pincode;
      if (!ownersFullname || !storeName || !address || !city || !state || !pincode) {
        return res.status(400).json(HTTPResp.error("badRequest"));
      }
      let newAccount = new Account({
        userId: user_id,
        ownersFullname,
        storeName,
        address,
        city,
        state,
        pincode,
        storeLogo: '/storeLogo/' + fileName
      });
      newAccount.save((err) => {
        if (err) {
          console.log(err);
          return res.status(500).json(HTTPResp.error("serverError"));
        }
        return res.status(201).json(HTTPResp.created("profile"));
      });
    })
  })
})

router.get("/", function (req, res) {
  const { user_id } = req.currentUser;
  Account.findOne({ userId: user_id }, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!result) {
      return res.status(404).json(HTTPResp.error('notFound'));
    }
    return res.status(200).json(HTTPResp.ok(result));
  });
});


module.exports = router;
