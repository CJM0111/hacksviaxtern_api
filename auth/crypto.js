/**
 * Dependencies
 */
var crypto = require('crypto');

/**
 * Hash: Method used for encryption & decryption
 */
var length = 128;
var iterations = 12000;

exports.hash = function (password, salt, func) {
    if (3 == arguments.length) {
        crypto.pbkdf2(password, salt, iterations, length, func);
    } else {
        func = salt;
        crypto.randomBytes(len, function(err, salt){
            if (err) return func(err);
            salt = salt.toString('base64');
            crypto.pbkdf2(password, salt, iterations, length, function(err, hash){
                if (err) return func(err);
                func(null, salt, hash);
            });
        });
    }
};