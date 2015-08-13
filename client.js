var express = require('express'),
	app = express();

app.route('/')
	.get(function(req, res) {
		res.sendFile(__dirname + "/client.html");
	});

app.listen(8000);