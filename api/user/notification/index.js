const router = require("express").Router();
const env = require("../../../config/env");
const config = require("../../../config")[env];
const HTTPResp = require("../../../utils/HTTPResp");
const User = require("../../../models/User");
const Profile = require("../../../models/Profile");
const Notification = require("../../../models/Notification");
const ObjectId = require("mongoose").Types.ObjectId;
const objectId = require("mongodb").ObjectId;
const formidable = require("formidable");
const fs = require('fs');
const path = require('path');

router.post("/", function (req, res) {
  const {user_id} = req.currentUser;
  const form = new formidable.IncomingForm();
  
  let newPath = path.resolve( __dirname + '../../../uploads/notificationImage');
  
  form.parse(req, function(err,fields,files) {
    if (err) {
      return res.status(500).json(HTTPResp.error("serverError"));
    }
    const oldPath = files.notification.path;
    const rawData = fs.readFileSync(oldPath) 
    const fileName = user_id+'.'+files.notification.name.split('.')[1];
    newPath+= '/' +fileName;
    fs.writeFile(newPath, rawData, function(err){ 
      if (err) {
        return res.status(500).json(HTTPResp.error("serverError"));
      }
    const title = fields.title,
      description = fields.description
    if (!title || !description) {
      return res.status(400).json(HTTPResp.error("badRequest"));
    }
  Profile.findOne({user:user_id},(err,result)=>{
    if (err) {
      return res.status(500).json(HTTPResp.error("serverError"));
    }
    if(result){
      return res.status(400).json(HTTPResp.error('exists','notification'))
    }
    let newNotification = new Notification({
      userId:user_id,
      title,
      description,
      imageRef:'/notificationImage/'+fileName
    });
    newNotification.save((err) => {
      if (err) {
        console.log(err);
        return res.status(500).json(HTTPResp.error("serverError"));
      }
      return res.status(201).json(HTTPResp.created("notificatio"));
    });
  });
    }) 
    
  })
  
})


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
  let { id } = req.params;
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
