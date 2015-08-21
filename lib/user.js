var mysql = require('mysql'),
	config = require('../config'),
	md5 = require('md5')
	session = require("express-session");

function User() {
	this.params = {};
};

// Set one user param
User.prototype.set = function(param) {
	this.params[param] = param;
}

// Set all user params
User.prototype.setAll = function(params) {
	this.params = params;
}

// Get user params
User.prototype.get = function(param) {
	return param && this.params[param] ? this.params[param] : this.params;
}

// Login user
User.prototype.login = function(login, password, req, callback) {
	if(!login || !password) {
		return false;
	}

	if(req.session.user) {
		callback(true);
		return false;
	}

	var self = this,
		connection = mysql.createConnection(config.db);

	connection.query('SELECT `id`, `email` FROM `users` WHERE `email` = "' + login +'" AND `password` = "' + md5(password) + '"', function(err, rows, fields) {
		if(err) {
			callback(false);
			return false;
		}
		if(rows.length != 0) {
			self.setAll({
				id: rows[0]["id"],
				email: rows[0]["email"]
			});
			req.session.user = self;
			callback(true);
		} else {
			callback(false);
		}
	});
	connection.end();
}

// Get users sites
User.prototype.getSitesByID = function(userID) {

}

module.exports = User;