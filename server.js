var express = require('express'),
	app = express(),
	fs = require('fs'),
	parse = require('csv-parse'),
	iconv = require('iconv-lite'),
	jsObfuscator = require('js-obfuscator');

app.route('/')
	.get(function(req, res) {
		res.send('Hello world!');
	});

app.route('/get/')
	.get(function(req, res) {
		fs.readFile(__dirname + '/data/' + req.hostname + '.csv', function(err, data) {
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
					var term = data[i][0].match(/{(.*)}/gi).toString(),
						term = term.substr(1, term.length - 2);

					json[term] = [
						data[i][2],
						data[i][3]
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
		fs.exists(__dirname + '/js/' + req.hostname + '.js', function(exists) {
			if(!exists) {
				res.send("No file");
				return false;
			}
			fs.readFile(__dirname + '/js/' + req.hostname + '.js', function(err, data) {
				jsObfuscator(data.toString()).then(function(o) {
					res.send(o);
				});
				
			});
		});
	});



app.listen(7000);