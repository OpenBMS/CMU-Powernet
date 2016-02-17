var express = require('express');
var router = express.Router();

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');

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
  res.cookie('current_price', req.body.current_price).json({"current_price": req.cookies.current_price});
});

module.exports = router;
