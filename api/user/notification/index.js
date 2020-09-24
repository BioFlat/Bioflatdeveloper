const router = require("express").Router();
const HTTPResp = require("../../../utils/HTTPResp");
const Notification = require("../../../models/Notification");
const ObjectId = require("mongoose").Types.ObjectId;
const objectId = require("mongodb").ObjectId;

router.post("/", function (req, res) {
  const { user_id } = req.currentUser;
  const { title, description, iconRef } = req.body;

  if (!title || !description || !iconRef) {
    return res.status(400).json(HTTPResp.error("badRequest"));
  }
  try {
    let newNotification = new Notification({
      userId: user_id,
      title,
      description,
      iconRef: iconRef,
    });
    newNotification.save((err) => {
      if (err) {
        return res.status(500).json(HTTPResp.error("serverError"));
      }
      return res.status(201).json(HTTPResp.created("notification"));
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(HTTPResp.error("serverError"));
  }
});

router.get("/", function (req, res) {
  const { user_id } = req.currentUser;
  try {
    Notification.find({ userId: user_id }, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (!result) {
        return res.status(404).json(HTTPResp.error("notFound", "notification"));
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
      res.status(400).send(`Invalid id: ${id}`);
    }
    const reg = {
      title: req.body.title,
      description: req.body.description,
    };
    Notification.updateOne({ _id: objectId(id) }, { $set: reg }, function (err) {
      if (err) {
        return res.status(500).json(HTTPResp.error("serverError"));
      }

      return res.status(200).json(HTTPResp.ok());
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(HTTPResp.error("serverError"));
  }
});

router.delete("/:id", function (req, res) {
  let { id } = req.params;
  try {
    if (!ObjectId.isValid(id)) {
      res.status(400).send(`Invalid id: ${id}`);
    }
    Notification.deleteOne({ _id: objectId(id) }, function (err) {
      if (err) {
        return res.status(500).json(HTTPResp.error("serverError"));
      }

      return res.status(200).json(HTTPResp.ok());
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(HTTPResp.error("serverError"));
  }
});
module.exports = router;
