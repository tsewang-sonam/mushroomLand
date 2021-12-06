var express = require('express');
var router = express.Router();
var isLoggedIn = require('../middleware/routeprotection').userIsLoggedIn;
var getRecentPosts = require('../middleware/postmiddleware').getRecentPosts;
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

router.get('/post/:id(\\d+)',(req,res,next)=> {
  let baseSQl = 'SELECT  u.username, p.title, p.description, p.path, p.created \
  FROM users u \
  JOIN post p \
  ON u.id-fk_userid \
  WHERE p.id=?;';
  let postId = req.params.id;
  db.execute(baseSQl, [postId])
  .then(([results, fields])=>
  {
    if(results && results.length){
      let post =results[0];
        res.render('imagepost',{currentPost: post});
    }else{
      req.flash('error', 'Aint looking for this');
      res.redirect('/viewpost')
    }
  })
});
router.get('/post/help',(req,res,next)=> {
  res.send({literal: "literal help"});
});
module.exports = router;
