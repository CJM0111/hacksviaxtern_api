/**
 * Dependencies
 */
var express = require('express');
var geocoder = require('geocoder');
var router = express.Router();

/**
 * Tracking Model
 */
var Tracking = require('../models/Tracking.js');

/**
 * HTTP GET: /tracking/
 * Return all tracking data
 */
router.get('/', function(req, res) {
    Tracking.find({}, 'user_id claim_id start_location stop_location miles_traveled', function (err, tracking_data) {
        if(err) throw err;
        res.send(tracking_data);
    });
});

router.get('/test', function(req, res) {
    geocoder.reverseGeocode(39.765818, -86.146828, function(err, geo_data){
       if(err) throw err;
        res.send(geo_data)
        console.log(geo_data.results[0].address_components[2].long_name);
        console.log(geo_data.results[0].address_components[5].long_name);
    });
});

/**
 * HTTP GET: /tracking/:user_id
 * Return tracking data by 'user_id'
 */
router.get('/:user_id', function(req, res) {
    Tracking.find({user_id: req.params.user_id}, function (err, tracking_data) {
        if(err) throw err;
        res.send(tracking_data);
    });
});

/**
 * HTTP GET: /tracking/:claim_id
 * Return tracking data by 'claim_id'
 */
router.get('/:claim_id', function(req, res) {
    Tracking.find({claim_id: req.params.claim_id}, function (err, tracking_data) {
        if(err) throw err;
        res.send(tracking_data);
    });
});

/**
 * HTTP POST: /tracking/new
 * Add new tracking data
 */
router.post('/new', function(req, res) {
    Tracking.create(req.body, function (err, tracking_data) {
        if(err) throw err;
        if(req.body.miles_traveled == null){
            Tracking.miles_traveled = "";
        }
        res.send(tracking_data);
    });
});

module.exports = router;