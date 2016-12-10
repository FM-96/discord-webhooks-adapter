module.exports = function (app) {
	var bitbucketRouter = require('./bitbucket/bitbucket.router.js');

	app.use('/bitbucket', bitbucketRouter);

	app.use(function (req, res) {
		res.status(400).send('No endpoint specified');
	});
}
