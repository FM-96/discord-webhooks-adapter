const bitbucketRouter = require('./bitbucket/bitbucket.router.js');

module.exports = function (app) {
	app.use('/bitbucket', bitbucketRouter);

	app.use(function (req, res) {
		res.status(400).send('No endpoint specified');
	});
};
