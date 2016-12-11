'use strict'

const auth = require('./auth') // required to authenticate user rights levels
const logins = require('../constants') // used to connect to the sql database
const adminRights = 3 // setting admin user rights
const Pool = require('pg').Pool // creating database connection
const pool = new Pool(logins.dbInfo)

/**
	* Function that returns the current users in the database
	* @param {string} token - The cookie stored in the users browser on login, used to authenticate user rights levels
	* @returns {object} Returns the result of the database query
 */
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

/**
	* Function to delete users from the database
	*@param {string} token - The cookie stored in the users browser, used to athenticate user rights
	*@param {string} user - The user to delete
	*@returns {boolean} Returns true if the user is deleted successfully, else print relevant message
 */
exports.deleteUser = (token, user) =>
	new Promise ((resolve, reject) => {
		auth.token(token).then((result) => {
			if (result.rights >= adminRights) {
				const query = `DELETE FROM users WHERE username='${user}'`
				pool.query(query, function(err, result) {
					if (err) {
						reject(err)
						if (result.rows.length === 0) {
							reject('User does not exist')
						}	
					} else {
						resolve()
					}
				})
			}
		})
	})
