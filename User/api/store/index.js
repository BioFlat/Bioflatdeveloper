const router = require("express").Router();
const env = require("../../../config/env");
const config = require("../../../config")[env];
const HTTPResp = require("../../../utils/HTTPResp");
const Store = require("../../../models/Store");
 var ObjectId = require('mongoose').Types.ObjectId;
var objectId = require('mongodb').ObjectId;

router.post("/addStore", function (req, res) {
  var token = req.headers['token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
  let { storeTitle, storeDescription, rating, distance } = req.body;

  if (!storeTitle || !storeDescription || !rating || !distance) {
    return res.status(400).json(HTTPResp.error('badRequest'));
  }
   Store.findOne({ storeTitle: storeTitle }, (err, store) => {
    if (err) {
      return res.status(500).json(HTTPResp.error("serverError"));
    }
    if (store) {
      return res.status(400).json(HTTPResp.error('exists','storeTitle'));
    }
    let newStore = {
        storeTitle: req.body.storeTitle,
        storeDescription: req.body.storeDescription,
        rating: req.body.rating,
        distance:req.body.distance
      };
      newStore = new Store(newStore);
     newStore.save((err, store) => {
      if (err) {
         return res.status(500).json(HTTPResp.error("serverError"));
      }
      if(store){
        return res.status(201).json(HTTPResp.created("store"));
       }
    });
  });
});
})

router.get("/getStore", function (req, res) {
  var token = req.headers['token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
  Store.find( (err, store) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!store) {
      return res.status(404).json(HTTPResp.error('notFound','store'));
    }
        res.status(200).json(HTTPResp.ok({store}));
   });
});
})

router.put("/updateStore", function (req,res){
  var token = req.headers['token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
     let {id} = req.query;
        if (!ObjectId.isValid(req.query.id)) {
        res.status(400).send(`Invalid id: ${req.query.id}`);
    }
     const reg = {
        storeTitle: req.body.storeTitle,
        storeDescription: req.body.storeDescription,
        rating: req.body.rating,
        distance:req.body.distance
     }
     Store.updateOne({"_id":objectId(id)},{ $set: reg}, function(err,result){
        if(result){
            res.status(200).json(HTTPResp.ok());
         }
        if(err){
            return res.status(400).json(HTTPResp.error('error'));
        }
     })
    })
});
router.delete("/deleteStore", function(req,res){
  var token = req.headers['token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    let {id} = req.query;
    if (!ObjectId.isValid(req.query.id)) {
    res.status(400).send(`Invalid id: ${req.query.id}`);
    }
    Store.deleteOne({"_id":objectId(id)}, function(err,result){
        if(result){
            res.status(200).json(HTTPResp.ok());
         }
        if(err){
            return res.status(400).json(HTTPResp.error('error'));
        }
    })
  })
})
 module.exports = router;
