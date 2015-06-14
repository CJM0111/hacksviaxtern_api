/**
 * Dependencies
 */
var express = require('express');
var hash = require('../auth/crypto').hash;
//var jwt = require('jsonwebtoken');
var router = express.Router();

/**
 * Admin Model
 */
var Admin = require('../models/Admin.js');

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
            /**
             * Optional: API token authentication
             */
            //var admin_json = {"admin_user_name": req.body.user_name, "password": req.body.password}
            req.session.regenerate(function(){
                req.session.user = admin;
                req.session.success = 'Access Granted as: ' + admin.admin_user_name;
                //var token = jwt.sign(admin_json, req.app.get('token_v1'), {
                //    expiresInMinutes: 3000
                //});
                Admin.find({admin_user_name: req.body.admin_user_name}, 'admin_user_name role', function(err, admin_data) {
                    if(err) throw err;
                    console.log(admin_data);
                    res.send(admin_data[0].role);
                });
                //req.headers.token = token;
                //res.json({
                //    success: true,
                //    message: "Login successful...",
                //    token: token
                //});
            });
        } else {
            req.session.error = 'Access Denied.';
            res.send("Login Unsuccessful");
            //res.json({
            //    success: false,
            //    message: "Login unsuccessful..."
            //});
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
        res.send("Logged Out");
    });
});

///**
// * Middleware authentication for all other 'admin.js' routes
// */
//router.use(function(req, res, next) {
//    var token = req.headers.xaccesstoken;
//    if (token) {
//        jwt.verify(token, req.app.get('token_v1'), function(err, decoded) {
//            if (err) {
//                return res.json({ success: false, message: 'Unable to authenticate token...' });
//            } else {
//                req.decoded = decoded;
//                next();
//            }
//        });
//    }
//    else {
//        return res.status(403).json({
//            success: false,
//            message: 'No token found...'
//        });
//    }
//});

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

module.exports = router;