var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	fs = require('fs'),
	parse = require('csv-parse'),
	iconv = require('iconv-lite'),
	jsObfuscator = require('js-obfuscator'),
	session = require('express-session'),
	md5 = require('md5');

var User = require('./lib/user.js');


// Common application settings
app.set("public", __dirname + "/public");
app.set("views", app.get("public") + "/views");

// Set jade as default rendoer for html pages
app.set("view engine", "jade");

// Body requests parser
app.use(bodyParser.urlencoded({
	extended: true
}));

// Sessions settings
app.use(session({
	secret: md5("ml"),
	resave: false,
	saveUninitialized: true,
	name: "ml",
	cookie: {
		secure: true
	}
}));

//app.use(express.static('public'));





// Home page
app.route("/")
	.get(function(req, res) {
		res.render("index");
	});

app.route("/personal/")
	.get(function(req, res) {
		console.log(req.session.user);
		res.sendFile(__dirname + '/public/personal.html');
	});

/*** Users authorization ***/
app.route('/login/')
	.post(function(req, res) {
		var login = req.body["login-email"],
			password = req.body["login-password"];

		var userInfo = User.login(login, password, function(info) {
			if(info) {
				req.session.regenerate(function() {
					req.session.user = info;
					res.redirect("/personal/");
				});
			} else {
				res.redirect("/login/");
			}
		});



	})
	.get(function(req, res) {
		res.sendFile(__dirname + '/public/index.html');
	});
/*** //Users authorization ***/

app.route('/get/')
	.get(function(req, res) {
		var host = 'lp.antaros.net';
		
		fs.readFile(__dirname + '/data/' + host + '.csv', function(err, data) {
			var iconvString = iconv.decode(new Buffer(data), 'win1251');
			parse(iconvString, {
				delimiter: ';'
			}, function(err, data) {
				var json = {};
				for(var i = 0; i < data.length; i++) {
					if(i == 0) {
						continue;
					}
					if(i == 1) {
						json['default'] = [
							data[i][2],
							data[i][3]
						];
						continue;
					}
					var term = data[i][0];

					json[term] = [
						data[i][2],
						data[i][3],
						data[i][4]
					];
				}
				sendResult(json);
			});
		});
		function sendResult(json) {
			res.append("Access-Control-Allow-Origin", "*");
			res.json(json);
		}
	});

app.route('/ml.js')
	.get(function(req, res) {
		var host = 'lp.antaros.net';

		fs.exists(__dirname + '/js/' + host + '.js', function(exists) {
			if(!exists) {
				res.send("//No file");
				return false;
			}
			fs.readFile(__dirname + '/js/' + host + '.js', function(err, data) {
				/*jsObfuscator(data.toString()).then(function(o) {
					res.send(o);
				});*/
				res.send(data.toString());
				
			});
		});
	});



app.listen(7000);