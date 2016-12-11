'use strict'

const auth = require('./auth')
const logins = require('../constants')
const adminRights = 3
const Pool = require('pg').Pool
const pool = new Pool(logins.dbInfo)

exports.viewUsers = (token) => {
	auth.token(token).then((user) => {
		if (user.rights >= adminRights) {
			const query = 'SELECT username, user_id from users'
			pool.query(query, function(err, result) {
				if (err) {
					return err
				} else {
					console.log(result)
				}
			})
		}
	})
}
