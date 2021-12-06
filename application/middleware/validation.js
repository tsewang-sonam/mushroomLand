const { use } = require("../routes");

const checkUsername = (username) => {

let usernameChecker = /^\D\w{2,}$/;
return usernameChecker.test(username);

}

const checkPassword = (password) => {

    let passwordChecker = /(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*()])[a-zA-Z0-9!@#$%^&*()]{8,}/;
    return passwordChecker.test(password);
}

const checkEmail = (email) => {

    let emailChecker = /(?=.*[a-z])(?=.*[@)])[a-zA-Z0-9@]{5,}/;
    return emailChecker.test(email);
}

const regisValidator= (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;
    if(!checkUsername(username)){
        req.flash('error', "Invalid Username");
        req.session.save(err => {
            res.redirect("/Registration");
        });
    } else if(!checkPassword(password)){
            req.flash('error', "Invalid Password");
            req.session.save(err => {
                res.redirect("/Registration");
            });
    }else if(!checkEmail(email)){
        req.flash('error', "Invalid Email");
        req.session.save(err => {
            res.redirect("/Registration");
        });
}    else{
        next();
    }

}
const loginValidator = (req, res, next) => {

}

module.exports = {regisValidator, loginValidator};