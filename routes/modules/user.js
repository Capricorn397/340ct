var logins = require('../constants');
var Pool = require('pg').Pool;

exports.userid = function(username, cb) {
  const idQuery = "SELECT user_id FROM users WHERE username='" + username + "'";

}
