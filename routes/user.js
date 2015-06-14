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
 * HTTP GET: /user/
 * Return all users
 */
router.get('/', function(req, res) {
    User.find({}, 'user_name first_name last_name job_title employee_id drivers_license street_address city state zip_code', function (err, user_data) {
        if(err) throw err;
        res.send(user_data);
    });
});

/**
 * HTTP GET: /user/:user_name
 * Return a user by 'user_name'
 */
router.get('/:user_name', function(req, res) {
    User.find({user_name: req.params.user_name}, 'user_name first_name last_name job_title employee_id drivers_license street_address city state zip_code', function(err, user_data) {
        if(err) throw err;
        res.send(user_data);
    });
});

/**
 * HTTP GET: /user/employee_id/:employee_id
 * Return a user by 'employee_id'
 */
router.get('/employee_id/:employee_id', function(req, res) {
    User.find({employee_id: req.params.employee_id}, 'user_name first_name last_name job_title employee_id drivers_license street_address city state zip_code', function(err, user_data) {
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
        User.find({user_name: req.body.user_name}, 'user_name first_name last_name job_title employee_id drivers_license street_address city state zip_code', function (err, user_data) {
            if (err) throw err;
            if (user_data == "") {
                User.create({
                    user_name: req.body.user_name,
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    job_title: req.body.job_title,
                    employee_id: req.body.employee_id,
                    drivers_license: req.body.drivers_license,
                    street_address: req.body.street_address,
                    city: req.body.city,
                    state: req.body.state,
                    zip_code: req.body.zip_code,
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
    User.update({user_name: req.body.user_name}, {first_name: req.body.first_name, last_name: req.body.last_name, job_title: req.body.job_title, employee_id: req.body.employee_id, drivers_license: req.body.drivers_license, street_address: req.body.street_address, city: req.body.city, state: req.body.state, zip_code: req.body.zip_code}, function(err, user_data) {
        if(err) throw err;
        res.send(user_data);
    });
});

/**
 * HTTP POST: /user/update/password
 * Update an existing user's password
 */
router.post('/update/password', function(req, res) {
    hash(req.body.password, function(err, salt, hash) {
        User.update({user_name: req.body.user_name}, {salt: salt, hash: hash.toString('base64')}, function (err, user_data) {
                if (err) throw err;
                res.send(user_data);
            });
    });
});

/**
 * Method for Authentication
 * Uses 'crypto.js' for encryption & decryption
 */
function authenticate(user_name, password, func) {
    // FOR TESTING PURPOSES ONLY
    console.log('Authenticating %s:%s', user_name, password);
    User.find({user_name: user_name}, 'user_name hash salt', function(err, user_data) {
        if(err) return err;
        if (user_data == "") {
            return func(new Error('User not found...'));
        }
        else{
            hash(password, user_data[0].salt, function(err, hash){
                if (err) return func(err);
                if (hash.toString('base64') === user_data[0].hash.toString('base64')) return func(null, user_data);
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