(function() {

"use strict";

var NodeBB = require.main;
var accountHelpers = NodeBB.require('./src/controllers/accounts/helpers.js');
var winston = NodeBB.require('winston');

exports.init = function(params, callback) {
	if(accountHelpers.getUserDataByUserSlug._emailHidden) {
		return callback();
	}

	var oldGetUserDataByUserSlug = accountHelpers.getUserDataByUserSlug;
	accountHelpers.getUserDataByUserSlug = function(userslug, callerUID, callback) {
		oldGetUserDataByUserSlug(userslug, callerUID, function(err, userData) {
			if(err) {
				return callback(err);
			}
			var isAdmin = userData.isAdmin;
			var isSelf = userData.isSelf;
			//winston.warn("getUserDataByUserSlug(" + userslug + "," + callerUID + ")");
			//winston.warn("isAdmin: " + isAdmin);
			//winston.warn("isSelf: " + isSelf);
			//winston.warn("userData.email: " + userData.email);
			//winston.warn("userData.emailClass: " + userData.emailClass);

			if(!isAdmin && !isSelf) {
				//winston.warn("Hiding email address");
				userData.email = '';
				userData.emailClass = 'hide';
			}

			//winston.warn("*result* userData.email: " + userData.email);
			//winston.warn("*result* userData.emailClass: " + userData.emailClass);

			return callback(null, userData);
		});
	};
	accountHelpers.getUserDataByUserSlug._emailHidden = true;
	winston.info("Now hiding emails from non-admin");
	return callback();
};

})();
