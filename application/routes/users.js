var express = require('express');
var router = express.Router();
var db = require('../conf/database');
var bcrypt = require('bcrypt');

const { regisValidator } = require('../middleware/validation');
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});



const  UserError = require("../helpers/error/UserError");
const {errorPrint,successPrint} = require ("../helpers/debug/debugprinters");


router.post('/register', regisValidator, (req, res, next) => {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let cpassword = req.body.password;

  //res.json({
  //  message: "valid Username"
  //});

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
    .then(([results, fields])=>{
      if(results && results.length == 0){
        return bcrypt.hash(password, 15);
      }else{
        throw new UserError(
          "Failed to register new Email", 
          "/Registration",
          200
        );
      }
    })
    .then((hashedPassword) => {

        let baseSQL ="INSERT INTO users (username,email,password,created) VALUES (?,?,?,now());"
        return db.execute(baseSQL,[username,email,hashedPassword])
      

    })
    .then(([results, fields]) => {
      if(results && results.affectedRows){
        successPrint(" User.js -->  User Created");
        req.flash('success', 'user account created')
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
        req.flash('error',err.getMessage())
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


  let baseSQL = "SELECT id, username, password FROM users WHERE username=?;"
  let userId;
  db.execute(baseSQL, [username])
  .then (([results,fields])=> {
  if(results && results.length == 1){
    let hashedPassword = results[0].password;
    userId = results[0].id;
    return bcrypt.compare(password, hashedPassword );
  }else{
  throw new UserError("Invalid username or password", "/login", 200);
  }
})
.then((passwordsMatched)=>{
  if(passwordsMatched){
    successPrint(`User ${username} is logged in`);
    req.session.username = username;
    req.session.userId = userId;
    res.locals.logged = true;
    req.flash('success', 'You have successfully login');
    res.redirect("/viewpost");

  }else{
    throw new UserError("Invalid username or password", "/login", 200);
  }
})
.catch((err)=>{
  if(err instanceof UserError){
    errorPrint("user failed to login");
    res.status(err.getMessage());
    req.flash('error',err.getMessage())
    res.redirect('/login');
  }else{
    next(err);
  }
});
});

router.post('/logout',(req, res, next) => {
  req.session.destroy((err) => {
    if(err){
    errorPrint(' Session is not destroyed ');
    next(err);
    
  } else {
    successPrint('session was destroyed ');
    res.clearCookie('csid');
    res.json({status: "ok", message: "user is logged out"});
   }
  })

});

module.exports = router;

