const router = require("express").Router();
const formidable = require("formidable");
const Profile = require("../../../models/Profile");
const HTTPResp = require("../../../utils/HTTPResp");
const fs = require('fs');
const path = require('path');

router.post("/", function (req, res) {
  const { user_id } = req.currentUser;
  try {
    const form = new formidable.IncomingForm();

    let newPath = path.resolve(__dirname + '../../../../uploads/profileImage');

    form.parse(req, function (err, fields, files) {
      if (err) {
        return res.status(500).json(HTTPResp.error("serverError"));
      }
      if (!files.profileImage || !(files.profileImage && files.profileImage.path)) {
        return res.status(400).json(HTTPResp.error("badRequest", 'profile image'));
      }
      const oldPath = files.profileImage.path;
      const rawData = fs.readFileSync(oldPath)
      const fileName = user_id + '.' + files.profileImage.name.split('.')[1];
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
        Profile.findOne({ userId: user_id }, (err, result) => {
          if (err) {
            return res.status(500).json(HTTPResp.error("serverError"));
          }
          if (result) {
            return res.status(400).json(HTTPResp.error('exists', 'user profile'))
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
        });
      })

    })
  } catch (err) {
    console.log(err);
    return res.status(500).json(HTTPResp.error("serverError"));
  }
})

router.put("/", function (req, res) {
  const { user_id } = req.currentUser;
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json(HTTPResp.error("badRequest"));
  }
  try {
    Profile.updateOne({ userId: user_id }, { $set: { name, email, phone } }, function (
      err,
      result
    ) {
      if (err) {
        return res.status(400).json(HTTPResp.error("serverError"));
      }
      return res.status(200).json(HTTPResp.ok());
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(HTTPResp.error("serverError"));
  }
})


router.get("/", function (req, res) {
  const { user_id } = req.currentUser;
  try {
    Profile.findOne({ userId: user_id }, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (!result) {
        return res.status(404).json(HTTPResp.error('notFound', 'profile'));
      }
      return res.status(200).json(HTTPResp.ok(result));
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(HTTPResp.error("serverError"));
  }
});


module.exports = router;
