// Required modules
var express = require("express"),
	bodyParser = require("body-parser"),
	parse = require("csv-parse"),
	fs = require("fs"),
	jsObfuscator = require("js-obfuscator"),
	iconv = require("iconv-lite"),
	md5 = require("md5"),
	session = require("express-session"),
	merge = require("merge");
// //Required modules



// Common settings
var config = require("./config"),
	settings = merge(config.app, require("./lib/arguments-parser")(process.argv).parse());
// //Common settings



// Server initialization and settings
var app = express();

app.set("public", __dirname + "/public");
app.set("views", app.get("public") + "/views");
app.set("view engine", "jade");
app.use(bodyParser.urlencoded({
	extended: true
}));
// //Server



// Session settings
app.use(session({
	secret: md5("ml"),
	resave: false,
	rollign: true,
	saveUninitialized: true,
	name: "ml",
	/*cookie: {
		secure: true
	}*/
}));
// //Session settings



// User settings
var User = require('./lib/user.js');
// //User settings



/*** Routers ***/

// Default handler for all queries
app.use(function(req, res, next) {
	req.renderParams = {
		"active": req.url,
		"user": req.session.user ? req.session.user.params : null
	};
	next();
});
// //Default handler for all queries

// Home page
app.route("/")
	.get(function(req, res) {
		res.render("index", req.renderParams);
	});
// //Home page

// About page
app.route("/about/")
	.get(function(req, res) {
		res.render("about", req.renderParams);
	});
// //About page

// Contacts page
app.route("/contacts/")
	.get(function(req, res) {
		res.render("contacts", req.renderParams);
	});
// //Contacts page

// Login
app.route("/login/")
	.post(function(req, res) {
		var login = req.body["login-email"],
			password = req.body["login-password"],
			user = new User();

		user.login(login, password, req, function(isLogin) {
			if(isLogin) {
				res.redirect("/personal/");
			} else {
				res.render("login", merge({
					error: "Please, check your email and password."
				}, req.renderParams));
			}
		});
	})
	.get(function(req, res) {
		res.render("login", req.renderParams);
	});
// Login

// Logout
app.route("/logout/")
	.get(function(req, res) {
		req.session.user = null;
		res.redirect("/");
	});
// //Logout

// Personal page
app.route("/personal/")
	.get(function(req, res) {
		if(req.session.user) {
			res.render("personal", req.renderParams);
		} else {
			res.render("index", merge({
				error: "Please, authorize."
			}, req.renderParams));
		}
	});
// //Personal page



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


// Start server
app.listen(settings.port);
console.log("Server has been started at " + new Date().toString() + " on port " + settings.port);