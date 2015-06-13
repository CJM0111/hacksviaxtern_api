/**
 * Dependencies
 */
var express = require('express');
var router = express.Router();

/**
 * Claim Model
 */
var Claim = require('../models/Claim.js');

/**
 * HTTP GET: /claim/
 * Return claim data for all users
 */
router.get('/', function(req, res) {
    Claim.find({}, function (err, claim_data) {
        if(err) throw err;
        res.send(claim_data);
    });
});

/**
 * HTTP GET: /claim/:user_name
 * Return claim data by 'user_name'
 */
router.get('/:user_name', function(req, res) {
    Claim.find({user_name: req.params.user_name}, function (err, claim_data) {
        if(err) throw err;
        res.send(claim_data);
    });
});

/**
 * HTTP GET: /claim/claim_id/:user_name/:claim_id
 * Return claim data by 'user_name' & 'claim_id'
 */
router.get('/claim_id/:user_name/:claim_id', function(req, res) {
    Claim.find({user_name: req.params.user_name, claim_id: req.params.claim_id}, function (err, claim_data) {
        if(err) throw err;
        res.send(claim_data);
    });
});

/**
 * HTTP GET: /claim/day/:month/:day/:year
 * Return claim data by 'day' & 'month' & 'year'
 */
router.get('/day/:month/:day/:year', function(req, res) {
    Claim.find({day: req.params.day, month: req.params.month, year: req.params.year}, function (err, claim_data) {
        if(err) throw err;
        res.send(claim_data);
    });
});

/**
 * HTTP GET: /claim/month/:month/:year
 * Return claim data by 'month' & 'year'
 */
router.get('/month/:month/:year', function(req, res) {
    Claim.find({month: req.params.month, year: req.params.year}, function (err, claim_data) {
        if(err) throw err;
        res.send(claim_data);
    });
});

/**
 * HTTP POST: /claim/new
 * Add new claim data
 */
router.post('/new', function(req, res) {

    var date = new Date();
    var day  = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    day = (day < 10 ? "0" : "") + day;
    month = (month < 10 ? "0" : "") + month;

    Claim.find({user_name: req.body.user_name}, 'claim_id').sort('-claim_id').exec(function(err, claim_data, local_claim_id){
        if (err) throw err;
        if(claim_data == ""){
            local_claim_id = 1;
        }
        else{
            local_claim_id = claim_data[0].claim_id+1;
        }
        Claim.create({
            user_name: req.body.user_name,
            claim_id: local_claim_id,
            claim_status: 'Pending',
            claim_title: req.body.claim_title,
            nature_of_business: req.body.nature_of_business,
            license_number: req.body.license_number,
            start_mileage: req.body.start_mileage,
            end_mileage: req.body.end_mileage,
            month: month,
            day: day,
            year: year,
            from_coordinate: req.body.from_coordinate,
            to_coordinate: req.body.to_coordinate,
            from_location: req.body.from_location,
            to_location: req.body.to_location,
            miles_traveled: req.body.miles_traveled,
            time_stamp: date.getTime()
        }, function (err, claim_data) {
            if (err) throw err;
            res.send(claim_data);
        });
    });
});

/**
 * HTTP POST: /claim/update
 * Update an existing claim
 */
router.post('/update', function(req, res) {
    Claim.update({user_name: req.body.user_name, claim_id: req.body.claim_id}, {claim_status: req.body.claim_status}, function(err, claim_data) {
        if(err) throw err;
        res.send(claim_data);
    });
});

module.exports = router;