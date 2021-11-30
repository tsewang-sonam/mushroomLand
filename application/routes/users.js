var express = require('express');
var router = express.Router();
var db = require('../conf/database');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

const  UserError = require("../helpers/error/UserError");
const {
  errorPrint,
  successPrint
} = require ("../helpers/debug/debugprinters");


router.post('/register', (req, res, next) => {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let cpassword = req.body.password;


  db.execute("SELECT * FROM users WHERE username=?", [username]).then(
    ([results, fields]) => {
      if (results && results.length == 0) {
        return db.execute("SELECT * FROM users WHERE email=?", [email]);
      } else {
        throw new UserError(
          "Failed to register new User",
           "/Registration",
          200
        );

      }
    })
    .then(([results,fields]) => {
      if (results && results.length ==0 ){
        let baseSQL ="INSERT INTO users (username,email,password,created) VALUES (?,?,?,now());"
        return db.execute(baseSQL,[username,email,password])
      }else{
        throw new UserError(
          "Failed to register new Email", 
          "/Registration",
          200
        );
      }

    })
    .then(([results, fields]) => {
      if(results && results.affectedRows){
        successPrint(" User.js -->  User Created");
        res.redirect('/login');
      }else{
        throw new UserError (
          "Server Error, user is not created ", 
          "/Registration",
          500
        );
      }
    })
    .catch((err) => {
      errorPrint("unable to create users", err);
      if(err instanceof UserError){
        errorPrint(err.getMessage());
        res.status(err.getStatus());
        res.redirect(err.getRedirectURL());

      }else {
        next(err);
      }
    });
});

router.post('/login', (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;


  let baseSQL = "SELECT username, password FROM users WHERE username=? AND password=?;"
  db.execute(baseSQL, [username,password])
  .then (([results,fields])=> {
  if(results && results.length == 1){
    successPrint(`User ${username} is logged in`);
    res.locals.logged = true;
    res.render('imageupload');
  }else{
  throw new UserError("Invalid username or password", "/login", 200);
  }
})
.catch((err)=>{
  if(err instanceof UserError){
    errorPrint("user failed to login");
    res.status(err.getMessage());
    res.redirect(err.getRedirectURL());
    res.redirect('/login');
  }else{
    next(err);
  }
})
})

module.exports = router;
