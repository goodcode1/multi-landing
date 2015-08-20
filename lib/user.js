var mysql = require('mysql'),
	config = require('../config'),
	md5 = require('md5');

function User() {
	
};

// Login user
User.prototype.login = function(login, password, callback) {
	if(!login || !password) {
		return false;
	}

	var connection = mysql.createConnection(config.db);
	connection.connect(function(err) {
		if(err) {
			console.log(err);
		}
	});
	connection.query('SELECT id, email FROM `users` WHERE email = "' + login +'" AND password = "' + md5(password) + '"', function(err, rows, fields) {
		callback((rows.length == 0) ? 
			null :  {
				"id": rows[0]["id"],
				"email": rows[0]["email"]
			}
		);
	});
	connection.end();

}

module.exports = new User();