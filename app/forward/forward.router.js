const express = require('express');
const router = express.Router();

const forwardController = require('./forward.controller.js');

router.post('/:id/:token', forwardController.handle);

module.exports = router;
