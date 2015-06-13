/**
 * Dependencies
 */
var express = require('express');
var hash = require('../auth/crypto').hash;
var router = express.Router();

/**
 * Admin Model
 */
var Admin = require('../models/Admin.js');

/**
 * HTTP GET: /admin/
 * Return all admins
 */
router.get('/', function(req, res) {
    Admin.find({}, 'admin_user_name', function (err, admin_data) {
        if(err) throw err;
        res.send(admin_data);
    });
});

/**
 * HTTP GET: /admin/:admin_user_name
 * Return an admin by 'admin_user_name'
 */
router.get('/:admin_user_name', function(req, res) {
    Admin.find({admin_user_name: req.params.admin_user_name}, 'admin_user_name', function(err, admin_data) {
        if(err) throw err;
        res.send(admin_data);
    });
});

/**
 * Method for Authentication
 * Uses 'crypto.js' for encryption & decryption
 */
function authenticate(admin_user_name, password, func) {
    console.log('Authenticating %s:%s', admin_user_name, password);
    Admin.find({admin_user_name: admin_user_name}, 'admin_user_name hash salt', function(err, admin_data) {
        if(err) return err;
        if(admin_data == ""){ return func(new Error("Admin %s is nonexistent...", admin_user_name));}
        else {
            hash(password, admin_data[0].salt, function (err, hash) {
                if (err) return func(err);
                if (hash.toString('base64') == admin_data[0].hash.toString('base64')) return func(null, admin_data);
                func(new Error('Invalid password...'));
            })
        }
    });
}

/**
 * HTTP POST: /admin/login
 * Login w/ 'admin_user_name' & 'password' & Authenticate
 */
router.post('/login', function(req, res){
    authenticate(req.body.admin_user_name, req.body.password, function(err, admin){
        if (admin) {
            req.session.regenerate(function(){
                req.session.user = admin;
                req.session.success = 'Access Granted as: ' + admin.admin_user_name;
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
 * HTTP GET: /admin/logout
 * Logout by destroying the current session
 */
router.get('/logout', function(err, req, res){
    if (err) throw err;
    req.session.destroy(function(){
        res.send('Logged out...');
    });
});

module.exports = router;