'use strict'

//const server = require('')
const Pool = require('pg').Pool;
const logins = require('../constants');
const auth = require('./auth')
const adminRights = 3
// Initiate db connection pool
const pool = new Pool(logins.dbInfo);
pool.on('error', function(e) {
	console.log(e);
});

exports.addModule = function(token, name, desc){
	auth.token(token).then((user) => {
		console.log('pre auth')
		if (user.rights >= adminRights){
			console.log(`modops ${name} and ${user.id} and ${desc}`)
			const databaseQuery = `INSERT INTO module (name, tutor_id, description) \
														VALUES ('${name}', ${user.id}, '${desc}')`
			pool.query(databaseQuery, function(err){
				if (err){
					return err
				} else {
					return `Module ${name} added`
				}
			})
		}
	}).catch((err) => {
		console.log(err)
	})
}

exports.viewModule = function(token, data){
	const databaseQuery = `SELECT name, tutor_id, description FROM module WHERE name='${data.name}'`
	Pool.query(databaseQuery, function(response, err){
		if (err) {
			return err
		} else {
			return response
		}
	})
}
