var express = require('express');
var router = express.Router();
const {successPrint, errorPrint} = require ("../helpers/debug/debugprinters");
var sharp = require('sharp');
var multer = require('multer');
var crypto = require('crypto');
var PostError = require('../helpers/error/PostError');
const { RequestHeaderFieldsTooLarge } = require('http-errors');
var PostModel = require('../models/Posts');
var storage = multer.diskStorage({
    destination: function(req, file, cb){

        cb(null, "public/images/upload")
    },
    filename: function(req,file,cb){
        let fileExt = file.mimetype.split('/')[1];
        let randomName = crypto.randomBytes(22).toString("hex");
        cb(null, `${randomName}.${fileExt}`);
    }
});
var uploader = multer({storage: storage});

router.post('/createPost',uploader.single("upload"), (req, res, next)=> {
    let fileUploaded = req.file.path;
    let fileAsThumbnail= `thumbmail-${req.file.filename}`;
    let destinationOfThumbnail = req.file.destination + "/" + fileAsThumbnail;
    let title = req.body.title;
    let description = req.body.description;
    let fk_userId = req.session.userId;

    sharp(fileUploaded)
    .resize(200)
    .toFile(destinationOfThumbnail)
    .then(() => {
        return PostModel.create(title,description, fileUploaded, destinationOfThumbnail,fk_userId);

    })
      .then((postWasCreated) => {
      if(postWasCreated){
            req.flash('success', " Your Post was Created");
            res.redirect('/viewpost');

      }else{
          throw new PostError('post not created', '/postImage', 200)

      }
    })  
    .catch((err) =>{
        if(err instanceof PostError){
            errorPrint(err.getMessage);
            req.flash('error', err.getMessage());
            res.status(err.getStatus());
            res.redirect(err.getRedirectURL());

        }else{
            next(err);
        }
    })


});

router.get("/search", async (req,res,next)=> {
   try{ let searchTerm = req.query.search;
    if(!searchTerm){
        res.send({
            message: " no input given",
            results:[]

        });
    }else{
        let results = await PostModel.search (searchTerm);
            if(results.length){
                res.send({
                  
                    message: `${results.lenght} results Here`,
                    results: results
                });

        }else{
            let results = await PostModel.getRecentPosts(8);
                 res.send({
                  
                    message: " Hello",
                     results: results
                 });
             }
        }

        }
        catch(err) { 
            next(err);
        }
    
    });

module.exports = router;