'use strict'

const Pool = require('pg').Pool
const logins = require('../constants')
const crypto = require('crypto')

const pool = new Pool(logins.dbInfo)
pool.on('error', function(e) {
	console.log(e)
})

/**
 * Returns the salt for a given user
 * @param {string} user - The username of the user
 * @return {string} - The salt associated with the user
 * @author Alex
 */
exports.salt = (user) =>
	new Promise((resolve, reject) => {
	  const saltQuery = `SELECT salt FROM users WHERE username='${user}'`
	  pool.query(saltQuery, function(err, result) {
	    if (err) {
	      console.log(err)
	      reject(err)
	    }
	    if (result.rows.length === 0) {
	      reject('Invalid username provided.')
	    } else {
		    resolve({salt: result.rows[0].salt})
	    }
	  })
	})

/**
 * Returns a generated token for a given user/password
 */
exports.token = (user, hashedPassword) =>
	new Promise((resolve, reject) => {
		verifyUser(user, hashedPassword).then((userId) => {
	    genToken(userId).then((token) => {
	    	resolve({'token': token})
	    })
		}).catch(() => {
			reject('Failed to generate token')
		})
	})

/**
 * Verifies correct password for a user
 */
const verifyUser = (user, hashedPassword) =>
	new Promise((resolve, reject) => {
	  const verificationQuery = `SELECT user_id FROM users \
																WHERE username='${user}' \
																AND hashed_password='${hashedPassword}'`
	  pool.query(verificationQuery, function(err, result) {
	    if (err) {
	      console.log(err)
	      reject(err)
	    }
	    if (result.rows.length === 0) {
	      reject(false)
	    } else {
	      resolve(result.rows[0].user_id)
	    }
	  })
	})

/**
 * Generates a login token
 */
const genToken = (userId) =>
	new Promise((resolve, reject) => {
		const tokenLength = 48
		crypto.randomBytes(tokenLength, function(err, buffer) {
			if (err) {
				reject(err)
			}
	    const token = buffer.toString('hex')
	    const tokenQuery = `INSERT INTO login_token (user_id, token, expiry_time) \
	                        VALUES ("${userId}, '${token}', NOW() + interval '15 minutes') \
													RETURNING token`
	    pool.query(tokenQuery, function(err, result) {
	      if (err) {
	        console.log(err)
	        reject(err)
	      }
	      if (result.rows.length === 0) {
	        reject('Error inserting row.')
	      } else {
	        resolve(false, result.rows[0].token)
	      }
	    })
	  })
	})
