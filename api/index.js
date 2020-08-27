const router = require('express').Router(); 
const auth = require('./authentication');
const course = require('./authentication');

router.use('/auth',auth)
router.use('/course',course)


module.exports = router;