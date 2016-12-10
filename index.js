var bodyParser = require('body-parser');
var express = require('express');
var app = express();

var routes = require('./app/routes.js');

app.use(bodyParser.json());

routes(app);

app.listen(12917, function () {
	console.log('Ready on port 12917');
});
