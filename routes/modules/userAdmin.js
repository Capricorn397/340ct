'use strict'

const auth = require('./auth')
const logins = require('../constants')
const adminRights = 3
const Pool = require('pg').Pool
const pool = new Pool(logins.dbInfo)

exports.viewUsers = (token) =>
	new Promise ((resolve, reject) => {
		auth.token(token).then((user) => {
			if (user.rights >= adminRights) {
				const query = 'SELECT username, user_id from users'
				pool.query(query, function(err, result) {
					if (err) {
						reject(err)
					} else {
						resolve(result)
					}
				})
			}
		})
	})

exports.deleteUser = (token, user) =>
	new Promise ((resolve, reject) => {
		auth.token(token).then((result) => {
			if (result.rights >= adminRights) {
				const query = `DELETE FROM users WHERE username='${user}'`
				pool.query(query, function(err) {
					if (err) {
						reject(err)
					} else {
						resolve()
					}
				})
			}
		})
	})
