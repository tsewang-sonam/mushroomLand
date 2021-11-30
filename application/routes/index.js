var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'CSC 317 App', name:"[TSEWANG SONAM]" });
});
router.get('/login', (req,res, next) => {

  res.render('login');
});
 router.get('/Registration', (req,res, next) => {

    res.render('Registration');
 });
 router.get('/imageupload', (req,res, next) => {

  res.render('imageupload');
});
router.get('/viewpost', (req,res, next) => {

  res.render('viewpost');
})

module.exports = router;
