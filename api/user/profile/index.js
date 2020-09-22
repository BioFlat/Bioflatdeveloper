const router = require("express").Router();
const formidable = require("formidable");
const Profile = require("../../../models/Profile");
const HTTPResp = require("../../../utils/HTTPResp");
const fs = require('fs');
const path = require('path');
const ObjectId = require("mongoose").Types.ObjectId;
const objectId = require("mongodb").ObjectId;


router.post("/", function (req, res) {
  const { user_id } = req.currentUser;
  const form = new formidable.IncomingForm();

  let newPath = path.resolve(__dirname + '../../../../uploads/profileImage');

  form.parse(req, function (err, fields, files) {
    if (err) {
      return res.status(500).json(HTTPResp.error("serverError"));
    }
    const oldPath = files.profile.path;
    const rawData = fs.readFileSync(oldPath)
    const fileName = user_id + '.' + files.profile.name.split('.')[1];
    newPath += '/' + fileName;
    fs.writeFile(newPath, rawData, function (err) {
      if (err) {
        return res.status(500).json(HTTPResp.error("serverError"));
      }
      const name = fields.name,
        email = fields.email,
        phone = fields.phone;
      if (!name || !email || !phone) {
        return res.status(400).json(HTTPResp.error("badRequest"));
      }
      let newProfile = new Profile({
        userId: user_id,
        name,
        email,
        phone,
        imageRef: '/profileImage/' + fileName
      });
      newProfile.save((err) => {
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
  Profile.findOne({ userId: user_id }, (err, result) => {
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
  const form = new formidable.IncomingForm();

  let newPath = path.resolve(__dirname + '../../../../uploads/profileImage');

  form.parse(req, function (err, fields, files) {
    if (err) {
      return res.status(500).json(HTTPResp.error("serverError"));
    }
    const oldPath = files.profile.path;
    const rawData = fs.readFileSync(oldPath)
    const fileName = user_id + '.' + files.profile.name.split('.')[1];
    newPath += '/' + fileName;
    fs.writeFile(newPath, rawData, function (err) {
      if (err) {
        return res.status(500).json(HTTPResp.error("serverError"));
      }
      const name = fields.name,
        email = fields.email,
        phone = fields.phone;
      if (!name || !email || !phone) {
        return res.status(400).json(HTTPResp.error("badRequest"));
      }
      Profile.updateOne({ _id: objectId(id), userId: user_id }, { $set: { name, email, phone,  imageRef: '/profileImage/' + fileName } }, function (err, result) {
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
  Profile.deleteOne({ _id: objectId(id) }, function (err, result) {
    if (err) {
      return res.status(500).json(HTTPResp.error("serverError"));
    }
    if (result) {
      return res.status(200).json(HTTPResp.ok());
    }
  });
});
module.exports = router;
