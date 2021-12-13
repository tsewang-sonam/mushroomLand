var {getRecentPosts, getPostById} = require('../models/Posts');
const {geCommentsByPostId, getCommentsForPost} = require('../models/comment');
const postMiddleware = {}

postMiddleware.getRecentPosts = async function(req,res,next){
   try{
       let results = await getRecentPosts(8);
       res.locals.results =results;
       if(results.length == 0){
           req.flash('error' , 'No post created');
       }
       next();
   }catch(err){
       next(err)
   }
};

postMiddleware.getPostById =async function(req, res, next){
    try{
        let postId = req.params.id;
        let results =await getPostById(postId);
        if(results && results.length){
            res.locals.currentPost = results[0];
            next();
        }else{
        req.flash("error", "This is not here");
        res.redirect('/viewpost');
        }
    }catch(err){
        next(err);
    }
}

postMiddleware.geCommentsByPostId = async function(req, res, next){
    let postId = req.params.id;
    try {
        let results = await getCommentsForPost(postId);
        res.locals.currentPost.comments = results;
        next();
    } catch (error) {
        next(error);
    }
}
module.exports = postMiddleware;