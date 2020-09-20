const router = require("express").Router();
const env = require("../../../config/env");
const config = require("../../../config")[env];
const HTTPResp = require("../../../utils/HTTPResp");
const User = require("../../../models/User");
const Notification = require("../../../models/Notification");
const ObjectId = require("mongoose").Types.ObjectId;
const objectId = require("mongodb").ObjectId;

router.post("/", function (req, res) {
  let { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json(HTTPResp.error("badRequest"));
  }
  User.findOne({phone:req.currentUser.phone_number},(err, user) => {
    if (err) {
      return res.status(500).json(HTTPResp.error("serverError"));
    }
       if (!user) {
      return res.status(400).json(HTTPResp.error('notFound','user not found'));
    }

  //  const {currentUser} = req;
  // if(currentUser || !currentUser.user_id){
  //    res.json({
  //      error:{
  //        message:'invalid request'
  //      }
  //    })
  // }
       newNotification = new Notification({
        user:user._id,
        title: title,
        description: description
      });
      newNotification.save((err, result) => {
        if (err) {
          return res.status(500).json(HTTPResp.error("serverError"));
        }
        if (result) {
          return res.status(201).json(HTTPResp.created("notification"));
        }
      });
    });
  });


router.get("/", function (req, res) {
  Notification.find((err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!result) {
      return res.status(404).json(HTTPResp.error("notFound", "notification"));
    }
    res.status(200).json(HTTPResp.ok( result ));
  });
});

router.put("/:id", function (req, res) {
  let { id } = req.query;
  if (!ObjectId.isValid(req.query.id)) {
    res.status(400).send(`Invalid id: ${req.query.id}`);
  }
  const reg = {
    title: req.body.title,
    description: req.body.description,
  };
  Notification.updateOne({ _id: objectId(id) }, { $set: reg }, function (
    err,
    result
  ) {
    if (result) {
      res.status(200).json(HTTPResp.ok());
    }
    if (err) {
      return res.status(400).json(HTTPResp.error("error"));
    }
  });
});

router.delete("/:id", function (req, res) {
  let { id } = req.query;
  if (!ObjectId.isValid(req.query.id)) {
    res.status(400).send(`Invalid id: ${req.query.id}`);
  }
  Notification.deleteOne({ _id: objectId(id) , userId:req.currentUser.user_id}, function (err, result) {
    if (result) {
      res.status(200).json(HTTPResp.ok());
    }
    if (err) {
      return res.status(400).json(HTTPResp.error("error"));
    }
  });
});
module.exports = router;
