var express = require('express');
var router = express.Router();

var bitbucketController = require('./bitbucket.controller.js');

router.post('/:id/:token', bitbucketController.handle);

module.exports = router;
