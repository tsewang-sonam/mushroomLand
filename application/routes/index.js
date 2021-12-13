var express = require('express');
var router = express.Router();
var isLoggedIn = require('../middleware/routeprotection').userIsLoggedIn;
const {getRecentPosts, getPostById,geCommentsByPostId } = require('../middleware/postmiddleware');
var db = require("../conf/database")

/* GET home page. */
router.get('/viewpost', getRecentPosts,function(req, res, next) {
  res.render('viewpost', { title: 'CSC 317 App', name:"[TSEWANG SONAM]" });
});
router.get('/login', (req,res, next) => {

  res.render('login');
});
 router.get('/Registration', (req,res, next) => {

    res.render('Registration');
 });
 router.use('/imageupload', isLoggedIn);
 router.get('/imageupload', (req,res, next) => {
  res.render('imageupload');
});
router.get('/viewpost', (req,res, next) => {

  res.render('viewpost');
})

router.get('/post/:id(\\d+)',getPostById, geCommentsByPostId,(req,res,next)=> {

    res.render('imagepost',{ title: `Post ${req.params.id}`});
    
});
router.get('/post/help',(req,res,next)=> {
  res.send({literal: "literal help"});
});
module.exports = router;
