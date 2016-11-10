'use strict'

const Pool = require('pg').Pool
const logins = require('../constants')
const crypto = require('crypto')

const pool = new Pool(logins.dbInfo)
pool.on('error', function(e) {
	console.log(e)
})

/**
 * Registers a new user with just username and salt, then returns the salt
 */
exports.salt = (user) =>
	new Promise((resolve, reject) => {
		checkExists(user).then(() => {
			genSalt(user).then((salt) => {
				resolve({'salt': salt})
			}).catch(() => {
				reject({success: false, data: 'Could not generate salt.'})
			})
		}).catch(() => {
			reject({success: false, data: 'User already exists. Cannot recreate salt.'})
		})
	})

/**
 * Fills in the blank data for a given user.
 */
exports.finalise = (user, hashed_password, firstname, surname, title) =>
	new Promise((resolve, reject) => {
		checkBlankPassword(user).then(() => {
			appendToUser(user, hashed_password, firstname, surname, title).then(() => {
				resolve({success: true})
			}).catch(() => {
				reject('Unable to update user record')
			})
		}).catch(() => {
			  reject('User already registered. Don\'t try and re-register.')
		})
	})

/**
 * Checks if a user already exists
 */
const checkExists = (user) =>
	new Promise((resolve, reject) => {
		const query = `SELECT user_id FROM users WHERE username='${user}'`
		pool.query(query, function(err, result) {
			if (err) {
				console.log(err)
				resolve()
			}
			if (result.rows.length === 0) {
				reject()
			} else {
				resolve()
			}
		})
	})

/**
 * Generates a new salt.
 */
const genSalt = (user) =>
	new Promise((resolve, reject) => {
		const saltLength = 16
	  crypto.randomBytes(saltLength, function(err, buffer) {
	    const salt = buffer.toString('hex')
	    if (err) {
	      reject(err)
	    } else {
	      const query = `INSERT INTO users (username, salt) VALUES ('${user}', '${salt}')`
	      pool.query(query, function(err) {
	        if (err) {
	          console.log(err)
	          reject(err) // Better to say it exists than have duplicates
	        } else {
	          resolve(salt)
	        }
	      })
	    }
	  })
	})

/**
 * Verify a user has no password
 */
const checkBlankPassword = (user) =>
	new Promise((resolve, reject) => {
	  const query = `SELECT hashed_password FROM users WHERE username='${user}' AND hashed_password IS NULL`
	  pool.query(query, function(err, result) {
	    if (err) {
	      console.log(err)
	      reject() // Better to say it exists than have duplicates
	    }
	    if (result.rows.length === 0) {
	      reject()
	    } else {
	      resolve()
	    }
	  })
	})

/**
 * Adds new data to a user
 */
const appendToUser = (user, hashed_password, firstname, surname, title) =>
	new Promise((resolve, reject) => {
	  const query = `UPDATE users SET hashed_password='${hashed_password}', forename='${firstname}', surname='${surname}', title='${title}' WHERE username='${user}'`
	  pool.query(query, function(err) {
	    if (err) {
	      console.log(err)
	      reject()
	    } else {
	      resolve()
	    }
	  })
	})
