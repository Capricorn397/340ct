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

exports.addModule = function(token, data){
	auth.token(token).then((user) => {
		console.log('pre auth')
		if (user.rights >= adminRights){
			console.log('post auth')
			const databaseQuery = `INSERT INTO module (name, tutor_id, description) \
														VALUES ('${data.moduleName}', ${user.id}, '${data.moduleDescription}')`
			pool.query(databaseQuery, function(err){
				if (err){
					return err
				} else {
					return `Module ${data.moduleName} added`
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
exports.editModule = function(token, data){
	console.log('Not Complete')
}
