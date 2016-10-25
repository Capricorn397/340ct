var Pool = require('pg').Pool;
var logins = require('../constants');

// Initiate db connection pool
var pool = new Pool(logins.dbInfo);
pool.on('error', function(e, client) {
  console.log(e);
});

exports.token = function(token, callback) {
	const query = `SELECT user_id FROM login_token WHERE token = '${token}' AND (expiry_time IS NULL OR expiry_time > NOW())`
	pool.query(saltQuery, function(err, result) {
		if (err) {
			console.log(err);
			cb(new Error('Could not validate token.'));
		}
		if (result.rows.length === 0) {
			cb(new Error('Token invalid.'));
		} else {
			cb(null, result.rows[0].user_id);
		}
	});
}
