module.exports.process = process;

var https = require('https');

function process(req, res) {
	var inWebhook = req.body;
	var outWebhook = null;

	//find out what type of webhook it is
	if (req.get('X-Event-Key') === 'issue:comment_created') {
		outWebhook = processIssueCommentCreated(inWebhook);
	} else if (req.get('X-Event-Key') === 'issue:created') {
		outWebhook = processIssueCreated(inWebhook);
	} else if (req.get('X-Event-Key') === 'issue:updated') {
		outWebhook = processIssueUpdated(inWebhook);
	} else {
		res.status(501).send('Webhook type not supported');
		return;
	}

	if (outWebhook) {
		outWebhook.username = 'BitBucket';
		outWebhook.avatar_url = 'https://www.brandeps.com/logo-download/B/Bitbucket-01.png';
		
		//send webhook to Discord API
		var requestOptions = {
			method: 'POST',
			hostname: 'discordapp.com',
			port: 443,
			path: '/api/webhooks/' + req.params.id + '/' + req.params.token,
			headers: {
				'Content-Type': 'application/json'
			}
		};
		var request = https.request(requestOptions, function (response) {
			var responseData = '';

			response.on('data', function (data) {
				responseData += data;
			});

			response.on('end', function () {
				res.status(response.statusCode).send(responseData);
			});
		});
		request.write(JSON.stringify(outWebhook), 'utf8');
		request.end();
	} else {
		res.sendStatus(500);
	}
}

function processIssueCommentCreated(inWebhook) {
	var outWebhook = {
		embeds: []
	};
	var embed = { author: {} };
	
	embed.author.icon_url = inWebhook.actor.links.avatar.href;
	embed.author.name = inWebhook.actor.display_name;
	embed.author.url = inWebhook.actor.links.html.href;

	embed.title = '[' + inWebhook.repository.full_name + '] New comment on issue #' + inWebhook.issue.id + ': ' + inWebhook.issue.title;
	embed.url = inWebhook.comment.links.html.href;
	
	embed.description = inWebhook.comment.content.raw;
	
	embed.color = 0xE68D60;

	outWebhook.embeds.push(embed);
	
	return outWebhook;
}

function processIssueCreated(inWebhook) {
	var outWebhook = {
		embeds: []
	};
	var embed = { author: {} };
	
	embed.author.icon_url = inWebhook.actor.links.avatar.href;
	embed.author.name = inWebhook.actor.display_name;
	embed.author.url = inWebhook.actor.links.html.href;

	embed.title = '[' + inWebhook.repository.full_name + '] Issue opened: #' + inWebhook.issue.id + ' ' + inWebhook.issue.title;
	embed.url = inWebhook.issue.links.html.href;
	
	embed.description = inWebhook.issue.content.raw;
	
	embed.color = 0xEB6420;

	outWebhook.embeds.push(embed);
	
	return outWebhook;
}

function processIssueUpdated(inWebhook) {
	var outWebhook = {
		embeds: []
	};
	var embed = { author: {} };

	var changes = [];

	if (inWebhook.changes.status) {
		changes.push('• Changed status to [' + inWebhook.changes.status.new + '](' + inWebhook.repository.links.html.href + '/issues?status=' + encodeURIComponent(inWebhook.changes.status.new).replace(/%20/g, '+') + ')');
	}
	if (inWebhook.changes.title) {
		changes.push('• Changed title to [' + inWebhook.changes.title.new + '](' + inWebhook.repository.links.html.href + '/issues?title=' + encodeURIComponent(inWebhook.changes.title.new).replace(/%20/g, '+') + ')');
	}
	if (inWebhook.changes.assignee) {
		if (inWebhook.changes.assignee.new) {
			changes.push('• Assigned issue to [' + inWebhook.changes.assignee.new.display_name + '](' + inWebhook.repository.links.html.href + '/issues?responsible=' + encodeURIComponent(inWebhook.changes.assignee.new.username).replace(/%20/g, '+') + ')');
		} else {
			changes.push('• Removed assignee');
		}
	}
	if (inWebhook.changes.kind) {
		changes.push('• Marked as [' + inWebhook.changes.kind.new + '](' + inWebhook.repository.links.html.href + '/issues?kind=' + encodeURIComponent(inWebhook.changes.kind.new).replace(/%20/g, '+') + ')');
	}
	if (inWebhook.changes.priority) {
		changes.push('• Marked as [' + inWebhook.changes.priority.new + '](' + inWebhook.repository.links.html.href + '/issues?priority=' + encodeURIComponent(inWebhook.changes.priority.new).replace(/%20/g, '+') + ')');
	}
	if (inWebhook.changes.content) {
		changes.push('• Edited description');
	}
	
	embed.author.icon_url = inWebhook.actor.links.avatar.href;
	embed.author.name = inWebhook.actor.display_name;
	embed.author.url = inWebhook.actor.links.html.href;

	embed.title = '[' + inWebhook.repository.full_name + '] Issue updated: #' + inWebhook.issue.id + ' ' + inWebhook.issue.title;
	embed.url = inWebhook.comment.links.html.href;
	
	embed.description = changes.join('\n');
	
	embed.color = 0x4F545C;

	outWebhook.embeds.push(embed);

	return outWebhook;
}
