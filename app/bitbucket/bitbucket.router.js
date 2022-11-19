const express = require('express');
const router = express.Router();

const bitbucketController = require('./bitbucket.controller.js');

router.post('/:id/:token', bitbucketController.handle);

module.exports = router;
