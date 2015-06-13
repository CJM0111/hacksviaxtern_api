/**
 * Dependencies
 */
var express = require('express');
var geocoder = require('geocoder');
var router = express.Router();

/**
 * Claim Model
 */
var Claim = require('../models/Claim.js');

/**
 * Tracking Model
 */
var Tracking = require('../models/Tracking.js');

/**
 * HTTP GET: /tracking/
 * Return all tracking data
 */
router.get('/', function(req, res) {
    Tracking.find({}, function (err, tracking_data) {
        if(err) throw err;
        res.send(tracking_data);
    });
});

/**
 * Use to convert a geo location (i.e. coordinates) into a city and state
 */
router.get('/geo', function(req, res) {
    geocoder.reverseGeocode(39.765818, -86.146828, function(err, geo_data){
       if(err) throw err;
        res.send(geo_data)
        console.log(geo_data.results[0].address_components[2].long_name);
        console.log(geo_data.results[0].address_components[5].long_name);
    });
});

/**
 * HTTP GET: /tracking/:user_name
 * Return tracking data by 'user_name'
 */
router.get('/:user_name', function(req, res) {
    Tracking.find({user_name: req.params.user_name}, function (err, tracking_data) {
        if(err) throw err;
        res.send(tracking_data);
    });
});

/**
 * HTTP GET: /tracking/claim_id/:user_name/:claim_id
 * Return tracking data by 'claim_id'
 */
router.get('/claim_id/:user_name/:claim_id', function(req, res) {
    Tracking.find({user_name: req.params.user_name, claim_id: req.params.claim_id}, function (err, tracking_data) {
        if(err) throw err;
        res.send(tracking_data);
    });
});

/**
 * HTTP POST: /tracking/new
 * Add new tracking data
 */
router.post('/new', function(req, res) {
    var date = new Date();
    Claim.find({user_name: req.body.user_name}).sort('-claim_id').exec(function(err, claim_data, local_claim_id){
        if (err) throw err;
        console.log(claim_data);
        if(claim_data == ""){
            local_claim_id = 1;
        }
        else{
            local_claim_id = claim_data[0].claim_id+1;
        }
        if (req.body.miles_traveled==undefined){
            req.body.miles_traveled = 0;
        }
        Tracking.create({
            user_name: req.body.user_name,
            claim_id: local_claim_id,
            start_coordinate:req.body.start_coordinate,
            stop_coordinate: req.body.stop_coordinate,
            miles_traveled: req.body.miles_traveled,
            time_stamp: date.getTime()
        }, function (err, tracking_data) {
            if(err) throw err;
            res.send(tracking_data);
        });
    });
});

module.exports = router;