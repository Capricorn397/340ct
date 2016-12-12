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

//Function for adding a given module name with description to the SQL Database
exports.addModule = function(token, name, desc){
	auth.token(token).then((user) => { //Check the user is authorised to add a module
		console.log('pre auth')
		if (user.rights >= adminRights){
			console.log(`modops ${name} and ${user.id} and ${desc}`) //show what is being added
			const databaseQuery = `INSERT INTO module (name, tutor_id, description) \
														VALUES ('${name}', ${user.id}, '${desc}')`
			pool.query(databaseQuery, function(err){ //initiate a database connection sending the query
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
