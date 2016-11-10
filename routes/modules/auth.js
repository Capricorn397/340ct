'use strict'

const Pool = require('pg').Pool
const logins = require('../constants')

const pool = new Pool(logins.dbInfo)
pool.on('error', function(e) {
	console.log(e)
})

/**
 * Checks if a token is valid and refreshes its validity
 * @param {String} token - The token to check
 * @returns {Object} - The rights and user id of the owner of the token
 * @author Alex
 */
exports.token = (token) =>
	new Promise((resolve, reject) => {
		const query = `SELECT login_token.user_id, users.rights_level \
										FROM login_token \
										INNER JOIN users ON (users.user_id = login_token.user_id) \
										WHERE token = '${token}' \
										AND (expiry_time IS NULL OR expiry_time > NOW())`
		pool.query(query, function(err, result) {
			if (err) {
				console.log(err)
				reject('Could not validate token.')
			}
			if (result.rows.length === 0) {
				reject('Token invalid.')
			} else {
				refreshToken(token)
				resolve({ 'id': result.rows[0].user_id, 'rights': result.rows[0].rights_level })
			}
		})
	})

/**
 * Refreshes the value of the token, does not need to be called synchronously.
 * @param {String} token - The token to refresh
 * @returns {err} - Returns nothing, prints if there is an error
 * @author Alex
 */
const refreshToken = (token) => {
	const query = `UPDATE login_token SET expiry_time = NOW() + interval '15 minutes' WHERE token = ${token}`
	pool.query(query, function(err) {
		if (err) {
			console.log(err)
		}
	})
}
