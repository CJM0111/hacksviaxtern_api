/**
 * Admin Model for MongoDB
 */
var mongoose = require('mongoose');

var adminSchema = new mongoose.Schema({
    admin_user_name: String,
    salt: String,
    hash: String
});

module.exports = mongoose.model('Admin', adminSchema, 'Admin');