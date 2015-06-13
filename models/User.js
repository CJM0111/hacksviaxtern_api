/**
 * User Model for MongoDB
 */
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    user_name: String,
    first_name: String,
    last_name: String,
    job_title: String,
    time_stamp: String,
    salt: String,
    hash: String
});

module.exports = mongoose.model('User', userSchema, 'User');