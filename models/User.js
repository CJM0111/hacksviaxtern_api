/**
 * User Model for MongoDB
 */
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    user_name: String,
    password: String,
    first_name: String,
    last_name: String,
    job_title: String,
    time_stamp: String
});

module.exports = mongoose.model('User', userSchema, 'User');