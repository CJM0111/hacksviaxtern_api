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
    Claim.find({}, 'user_id claim_id', function (err, claim_data) {
        if(err) throw err;
        res.send(claim_data);
    });
});

/**
 * HTTP GET: /claim/:user_id
 * Return claim data by 'user_id'
 */
router.get('/:user_id', function(req, res) {
    Claim.find({user_id: req.params.user_id}, function (err, claim_data) {
        if(err) throw err;
        res.send(claim_data);
    });
});

/**
 * HTTP GET: /claim/:claim_id
 * Return claim data by 'claim_id'
 */
router.get('/:claim_id', function(req, res) {
    Claim.find({claim_id: req.params.claim_id}, function (err, claim_data) {
        if(err) throw err;
        res.send(claim_data);
    });
});

router.get('/test', function(req, res) {
    Claim.findByIdAndUpdate(claim_id, { $inc: { claim_id: 1 } }, function (err, claim_data) {
        if (err) throw err;
        console.log("claim_id" + claim_id);
        console.log(claim_data);
        res.send(claim_id);
    });
});

/**
 * HTTP POST: /claim/new
 * Add new claim data
 */
router.post('/new', function(req, res) {
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    /*Claim.findByIdAndUpdate(claim_id, { $inc: { claim_id: 1 } }, function (err, claim_data) {
        if (err) throw err;
        console.log("claim_id"+claim_id);
        //console.log(claim_data);
        res.send(claim_id);
    });*/
    Claim.find({user_name: req.body.user_name}, function(err, claim_data){
        console.log("Claims for this user...\n");
        console.log(claim_data[0].claim_id);
    });
    console.log(day);
    console.log(month);
    //console.log(req);
    Claim.create({
        user_name:'Jordan',
        claim_id: 1,
        claim_status: 'Pending',
        claim_title: 'Literally Nothing',
        nature_of_business: 'Nothing',
        license_number: '00TUEY',
        start_mileage: 98000,
        end_mileage: 100230,
        month: month,
        day: day,
        from_coordinate: '5.8',
        to_coordinate: '0.10',
        from_location: 'a',
        to_location: 'g',
        miles_traveled: 100
    }, function (err, claim_data) {
        res.send(claim_data);
    });
});

/**
 * HTTP POST: /claim/update
 * Update an existing claim
 */
router.post('/update', function(req, res) {
    Claim.update({user_id: req.body.user_id, claim_id: req.body.claim_id}, {claim_status: req.body.claim_status}, function(err, claim_data) {
        if(err) throw err;
        res.send(claim_data[0]);
    });
});

module.exports = router;