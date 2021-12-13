var express = require('express');
var router = express.Router();
const {successPrint, errorPrint} = require ("../helpers/debug/debugprinters");
const { create } = require('../models/comment');

router.post ('/create', (req, res, next) =>{
 
    if(!req.session.username){
        res.json({
            code: -1,
            status: "danger",
            message: "must be logged"
        });
    }else{
        
     let {comment, postId} = req.body;
     let username = " Sonam";//req.session.username;
     let userId = "12";//req.session.userId;
     create(userId, postId,comment)
     .then((wasSuccessful)=>{
         if(wasSuccessful != -1){
             successPrint(`comment was created by ${username}`);
             res.json({
                 code: 1,
                 status: "success",
                 message:  "comment was created",
                 comment: comment,
                 username: username
 
             })
         }else{
             errorPrint('comment was not here');
             res.json({
                 code: -1,
                status: "danger",
                message: "not created"
             })
 
         }
     }).catch((err) => next(err));
 
 }
})
module.exports = router;