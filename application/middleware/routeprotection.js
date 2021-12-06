
const {successPrint, errorPrint}= require("../helpers/debug/debugprinters");
const routeProtector = {};

routeProtector.userIsLoggedIn = function(req, res, next){
    if(req.session.username){
        successPrint('Users in logged in');
        next();
    }else{
        errorPrint('user not not looged in')
        req.flash('error', 'Must be logged in to Post image');
        res.redirect('/login');
    }
}

module.exports = routeProtector;

