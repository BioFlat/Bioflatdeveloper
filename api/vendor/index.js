const router = require('express').Router(); 
const auth = require('./authentication');
  const store = require('./store')
    
router.use('/auth',auth)
  router.use('/store',store)
 
module.exports = router;