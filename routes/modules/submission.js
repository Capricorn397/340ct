'use strict'

const auth = require('./auth') // used to authenticate
const formidable = require ('formidable') //used to take an incoming form
const fs = require ('fs')
const path = require ('path') // used to append path names
const Pool = require ('pg').Pool// used to query the sql database
const logins = require('../constants')// used to login to the database

const pool = new Pool(logins.dbInfo)
pool.on('error', function(e) {
	console.log(e)
})


module.exports = (req, res) => {

	const form = new formidable.IncomingForm() 

	form.uploadDir = path.join(__dirname, '../uploads')

	auth.token(req.cookies.token).then((user) => {
		const query = `INSERT INTO submission (student_id, submission_path, status) VALUES (${user.id}, '${form.uploadDir}', 'SUBMITTED')`
		pool.query(query, function(err, result) {
			if (err) {
				console.log(err)
			}
		})
	})

	form.on('file', function(field, file) {
		fs.rename(file.path, path.join(form.uploadDir, file.name))
	})

	form.on('error', function(err) {
		console.log('An error has occured: \n' + err)
	})
	form.on('end', function() {
		res.end('success')
	})
	form.parse(req)
}
