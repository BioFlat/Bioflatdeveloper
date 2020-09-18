const router = require("express").Router();
const env = require("../../../config/env");
const config = require("../../../config")[env];
const HTTPResp = require("../../../utils/HTTPResp");
const Notification = require("../../../models/Notification");
const ObjectId = require("mongoose").Types.ObjectId;
const objectId = require("mongodb").ObjectId;

router.post("/addNotification", function (req, res) {
  let { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json(HTTPResp.error("badRequest"));
  }
  Notification.findOne(
    { title: title, description: description },
    (err, result) => {
      if (err) {
        return res.status(500).json(HTTPResp.error("serverError"));
      }
      if (result) {
        return res.status(400).json(HTTPResp.error("exists", "notification"));
      }
      let newNotification = {
        title: req.body.title,
        description: req.body.description,
      };
      newNotification = new Notification(newNotification);
      newNotification.save((err, result) => {
        if (err) {
          return res.status(500).json(HTTPResp.error("serverError"));
        }
        if (result) {
          return res.status(201).json(HTTPResp.created("notification"));
        }
      });
    }
  );
});

router.get("/getNotification", function (req, res) {
  Notification.find((err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!result) {
      return res.status(404).json(HTTPResp.error("notFound", "notification"));
    }
    res.status(200).json(HTTPResp.ok({ result }));
  });
});

router.put("/updateNotification", function (req, res) {
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

router.delete("/deleteNotification", function (req, res) {
  let { id } = req.query;
  if (!ObjectId.isValid(req.query.id)) {
    res.status(400).send(`Invalid id: ${req.query.id}`);
  }
  Notification.deleteOne({ _id: objectId(id) }, function (err, result) {
    if (result) {
      res.status(200).json(HTTPResp.ok());
    }
    if (err) {
      return res.status(400).json(HTTPResp.error("error"));
    }
  });
});
module.exports = router;
