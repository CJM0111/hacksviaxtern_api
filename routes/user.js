/**
 * Dependencies
 */
var express = require('express');
var router = express.Router();

/**
 * User Model
 */
var User = require('../models/User.js');

/**
 * HTTP GET: /user/login
 * Validate user
 */
router.post('/login', function(req, res) {
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
    User.find({user_name: req.body.user_name}, 'user_name first_name last_name job_title', function(err, user_data){
       if (err) throw err;
       if(user_data == ""){
           User.create({
               user_name:req.body.user_name,
               password: req.body.password,
               first_name: req.body.first_name,
               last_name: req.body.last_name,
               job_title: req.body.job_title,
               time_stamp: date.getTime()
           }, function (err, user_data) {
               if(err) throw err;
               res.send(user_data);
           });
       } else {
           res.send("Username already exists...please use a different one");
       }
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
    User.update({user_name: req.body.user_name}, {password: req.body.password}, function(err, user_data) {
        if(err) throw err;
        res.send(user_data);
    });
});

module.exports = router;