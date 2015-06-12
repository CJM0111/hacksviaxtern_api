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
    console.log(req);
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
    User.find({}, 'user_id user_name first_name last_name', function (err, user_data) {
        if(err) throw err;
        res.send(user_data);
    });
});

/**
 * HTTP GET: /user/:user_name
 * Return a user by 'user_name'
 */
router.get('/:username', function(req, res) {
    User.find({user_name: req.params.username}, function(err, user_data) {
        if(err) throw err;
        res.send(user_data);
    });
});

/**
 * HTTP POST: /user/new
 * Add a new user
 */
router.post('/new', function(req, res) {
    User.create(req.body, function (err, user_data) {
        if(err) throw err;
        res.send(user_data);
    });
});

/**
 * HTTP POST: /user/update
 * Update an existing user
 */
router.post('/update', function(req, res) {
    User.update({user_id: req.body.user_id}, {user_name: req.body.user_name, first_name: req.body.user_name, last_name: req.body.last_name}, function(err, user_data) {
        if(err) throw err;
        res.send(user_data);
    });
});

module.exports = router;