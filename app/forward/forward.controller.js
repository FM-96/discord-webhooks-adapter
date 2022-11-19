module.exports.handle = handle;

const https = require('https');

function handle(req, res) {
	if (req.headers['content-type'] === 'application/json') {
		const requestOptions = {
			method: 'POST',
			hostname: 'discordapp.com',
			port: 443,
			path: '/api/webhooks/' + req.params.id + '/' + req.params.token,
			headers: {
				'Content-Type': 'application/json',
			},
		};
		const request = https.request(requestOptions, function (response) {
			let responseData = '';

			response.on('data', function (data) {
				responseData += data;
			});

			response.on('end', function () {
				res.status(response.statusCode).send(responseData);
			});
		});
		request.write(JSON.stringify(req.body), 'utf8');
		request.end();
	} else {
		res.status(400).send('Content-type not supported');
	}
}
