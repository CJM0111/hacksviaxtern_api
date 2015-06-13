/**
 * Tracking Model for MongoDB
 */
var mongoose = require('mongoose');

var trackingSchema = new mongoose.Schema({
    user_name: String,
    claim_id: Number,
    start_coordinate: String,
    stop_coordinate: String,
    miles_traveled: Number,
    time_stamp: String
});

module.exports = mongoose.model('Tracking', trackingSchema, 'Tracking');