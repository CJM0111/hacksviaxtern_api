/**
 * Tracking Model for MongoDB
 */
var mongoose = require('mongoose');

var trackingSchema = new mongoose.Schema({
    user_id:Number,
    claim_id: Number,
    start_location:String,
    stop_location:String,
    miles_traveled:String
});

module.exports = mongoose.model('Tracking', trackingSchema, 'Tracking');