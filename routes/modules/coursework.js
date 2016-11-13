'use strict'

const Pool = require('pg').Pool
const logins = require('../constants')
const auth = require('./auth')

const pool = new Pool(logins.dbInfo)
pool.on('error', function(e) {
	console.log(e)
})

exports.setCoursework = (token, module, title, description, dueDate, isGroup, weighting, maxMark) =>
	new Promise((resolve, reject) => {
		canMake(token, module).then(() => {
			assignCoursework(module, title, description, dueDate, isGroup, weighting, maxMark).then((coursework_id) => {
				resolve(coursework_id)
			}).catch((err) => {
				reject(err)
			})
		})
	}).catch((err) => {
		console.log(err)
	})

const canMake = (token, module) =>
	new Promise((resolve, reject) => {
		auth.token(token).then((user) => {
			checkLeader(module, user).then(() => {
				resolve()
			}).catch((err) => {
				reject(err)
			})
		})
	})

const checkLeader = (module, user) =>
	new Promise((resolve, reject) => {
		const adminRights = 3
		if (user.rights === adminRights) resolve()
		const query = `SELECT * FROM module WHERE name='${module}' AND tutor_id=${user.id}`
		pool.query(query, (err, result) => {
			if (err) {
				console.log(err)
				reject(err)
			}
			if (result.rows.length === 0) {
				reject('Not module leader or administrator.')
			} else {
				resolve()
			}
		})
	})

const assignCoursework = (studentId, module, title, description, dueDate, isGroup, weighting, maxMark) =>
	new Promise((resolve, reject) => {
		getModuleId(module).then((moduleId) => {
			const query = `INSERT INTO coursework(module_id, title, description, due_date, is_group, weighting, maxMark) VALUES (${moduleId}, '${title}', '${description}', '${dueDate}', ${isGroup}, ${weighting}, ${maxMark}) RETURNING coursework_id`
			pool.query(query, (err, result) => {
				if (err) {
					reject(err)
				} else {
					resolve(result.rows[0].coursework_id)
				}
			})
		})
	})

const getModuleId = (module) =>
	new Promise((resolve, reject) => {
		const query = `SELECT module_id FROM module WHERE name='${module}'`
		pool.query(query, (err, result) => {
			if (err) {
				reject(err)
			}
			if (result.rows.length === 0) {
				reject('Invalid module name.')
			} else {
				resolve(result.rows[0].module_id)
			}
		})
	})
