const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const routes = require('./app/routes.js');

app.use(bodyParser.json());

routes(app);

app.listen(12917, function () {
	console.log('Ready on port 12917');
});
