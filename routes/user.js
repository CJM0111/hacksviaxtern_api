/**
 * Dependencies
 */
var express = require('express');
var hash = require('../auth/crypto').hash;
var router = express.Router();

/**
 * User Model
 */
var User = require('../models/User.js');

/**
 * HTTP POST: /user/login
 * Validate user
 */
router.post('/bad_login', function(req, res) {
    User.find({user_name: req.body.user_name}, 'user_name password', function (err, user_data) {
        if (err) throw err;
        if (user_data.length) {
            if(user_data[0].password === req.body.password){
                res.send("Valid credentials");
            }
            else{
                res.send("Invalid password");
            }
        }
        else{
            res.send("Invalid username or password");
        }
        console.log("Password: " + user_data[0].password);
    });
});

/**
 * HTTP GET: /user/
 * Return all users
 */
router.get('/', function(req, res) {
    User.find({}, 'user_name first_name last_name job_title', function (err, user_data) {
        if(err) throw err;
        res.send(user_data);
    });
});

/**
 * HTTP GET: /user/:user_name
 * Return a user by 'user_name'
 */
router.get('/:user_name', function(req, res) {
    User.find({user_name: req.params.user_name}, 'user_name first_name last_name job_title', function(err, user_data) {
        if(err) throw err;
        res.send(user_data);
    });
});

/**
 * HTTP POST: /user/new
 * Add a new user
 */
router.post('/new', function(req, res) {
    var date = new Date();
    hash(req.body.password, function(err, salt, hash) {
        User.find({user_name: req.body.user_name}, 'user_name first_name last_name job_title', function (err, user_data) {
            if (err) throw err;
            if (user_data == "") {
                User.create({
                    user_name: req.body.user_name,
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    job_title: req.body.job_title,
                    time_stamp: date.getTime(),
                    salt: salt,
                    hash: hash.toString('base64')
                }, function (err, user_data) {
                    if (err) throw err;
                    res.send(user_data);
                });
            } else {
                res.send("Username already exists...");
            }
        });
    });
});

/**
 * HTTP POST: /user/update
 * Update an existing user
 */
router.post('/update', function(req, res) {
    User.update({user_name: req.body.user_name}, {first_name: req.body.first_name, last_name: req.body.last_name, job_title: req.body.job_title}, function(err, user_data) {
        if(err) throw err;
        res.send(user_data);
    });
});

/**
 * HTTP POST: /user/update/password
 * Update an existing user's password
 */
router.post('/update/password', function(req, res) {
    console.log("PASSWORD");
    User.update({user_name: req.body.user_name},
        {hash: hash(req.body.password, function(err, hash){
        if (err) throw err;
        return hash.toString();
    })},
        {salt: hash(req.body.password, function(err, salt){
        if (err) throw err;
        return salt;
    })}, function(err, user_data) {
        if(err) throw err;
        res.send(user_data);
    });
});

/**
 * Method for Authentication
 * Uses 'crypto.js' for encryption & decryption
 */
function authenticate(user_name, password, func) {
    console.log('Authenticating %s:%s', user_name, password);
    User.find({user_name: user_name}, 'user_name hash salt', function(err, user_data) {
        if(err) return err;
        if (!user_data[0].user_name) {
            return func(new Error('User not found...'));
        }
        else{
            hash(password, user_data[0].salt, function(err, hash){
                if (err) return func(err);
                if (hash.toString('base64') == user_data[0].hash.toString('base64')) return func(null, user_data);
                func(new Error('Invalid password...'));
            })
        }
    });
}

/**
 * HTTP POST: /user/login
 * Login w/ 'user_name' & 'password' & Authenticate
 */
router.post('/login', function(req, res){
    authenticate(req.body.user_name, req.body.password, function(err, user){
        if (user) {
            req.session.regenerate(function(){
                req.session.user = user;
                req.session.success = 'Access Granted as: ' + user.user_name;
                res.send("Login Successful");
            });
        } else {
            console.log("else");
            req.session.error = 'Access Denied.';
            res.send("Login Unsuccessful");
        }
    });
});

/**
 * HTTP GET: /user/logout
 * Logout by destroying the current session
 */
router.get('/logout', function(err, req, res){
    if (err) throw err;
    req.session.destroy(function(){
        res.send('Logged out...');
    });
});

module.exports = router;