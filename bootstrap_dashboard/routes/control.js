var express = require('express');
var router = express.Router();

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var request = require('request');
var constants = require('../constants');
var mongo = require('../mongo');

router.use(logger('dev'));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(cookieParser());
router.use(express.static(path.join(__dirname, 'public')));

//  '/' == '/control' here

// MongoDB wrapper
var mongo = require('../mongo');
// Used when query collection by _id field
var ObjectId = require('mongodb').ObjectID;
// Constants used in this application
var constants = require('../constants');

router.get('/data', function(req, res, next) {
  console.log(req.cookies);
  res.json({"current_price": req.cookies.current_price});
});

router.post('/data', function(req, res, next) {
  mongo.query(constants.HOMEHUBS, {}, function (err, docs) {
    for(var i = 0; i < docs.length; i++) {
      var options = {
        url: docs[i].callback_url,
        method: "POST",
        json: { type: "price", value: req.body.current_price }
      };

      request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log(body);
        }
      });
    }
  });
  res.cookie('current_price', req.body.current_price).json({"current_price": req.cookies.current_price});
});

module.exports = router;
