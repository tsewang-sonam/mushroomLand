var express = require('express');
var router = express.Router();
var db = require('../conf/database');
const {successPrint, errorPrint} = require ("../helpers/debug/debugprinters");
var sharp = require('sharp');
var multer = require('multer');
var crypto = require('crypto');
var PostError = require('../helpers/error/PostError');
const { route } = require('.');
const { RequestHeaderFieldsTooLarge } = require('http-errors');

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
        let baseSQL = ' INSERT INTO post (title, description, path, thumbnail, created, fk_userId) VALUE(?,?,?,?, now(), ?);;'; 
        return db.execute(baseSQL,[title,description, fileUploaded, destinationOfThumbnail,fk_userId]);

    })
      .then(([results, fields])=> {
      if(results && results.affectedRows){
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

router.get("/search", (req,res,next)=> {
    let searchTerm = req.query.search;
    if(!searchTerm){
        res.send({
            resultsStatus: " Information",
            message: " no input given",
            results:[]

        });
    }else{
        let baseSQL=" SELECT  id, title, description, thumbnail, concat_ws(' ',title, description) AS haystack \
        FROM post	\
        HAVING haystack like ? ;";
        let sqlReadySearchTerm = "%"+searchTerm+"%";
        db.execute(baseSQL, [sqlReadySearchTerm])
        .then(([results, fields]) => {
            if(results && results.length){
                res.send({
                    resultsStatus: "info",
                    message: `${results.lenght} results Here`,
                    results: results
                });

        }else{
             db.query('SELECT id, title,description,thumbnail, created FROM post ORDER BY created DESC LIMIT 8')
             .then(([results, fields])=> {
                 res.send({
                    resultsStatus: " Information",
                    message: " Hello",
                     results: results
                 });
             })
        }

        })
        .catch((err) => next(err));
            
        }
    });


module.exports = router;