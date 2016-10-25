var Pool = require('pg').Pool;
var logins = require('../constants');

// Initiate db connection pool
var pool = new Pool(logins.dbInfo);
pool.on('error', function(e, client) {
  console.log(e);
});

exports.token = function(token, callback) {
	const query = `SELECT login_token.user_id, users.rights_level \
									FROM login_token \
									INNER JOIN users ON (users.user_id = login_token.user_id) \
									WHERE token = '${token}' \
									AND (expiry_time IS NULL OR expiry_time > NOW())`
	pool.query(query, function(err, result) {
		if (err) {
			console.log(err);
			cb(new Error('Could not validate token.'));
		}
		if (result.rows.length === 0) {
			cb(new Error('Token invalid.'));
		} else {
			cb(null, result.rows[0].user_id, result.rows[0].rights_level);
			refreshToken(token);
		}
	});
}

function refreshToken(token) {
	const query = `UPDATE login_token SET expiry_time = NOW() + interval '15 minutes' WHERE token = ${token}`
	pool.query(query, function(err, results) {
		if (err) {
			console.log(err);
		}
	});
}
