'use strict'

const Pool = require('pg').Pool
const logins = require('../constants')
const auth = require('./auth')

const pool = new Pool(logins.dbInfo)
pool.on('error', function(e) {
	console.log(e)
})

/**
 * Sets coursework for a given module
 * @param {String} token - The authentication token for the user trying to set the coursework
 * @param {String} module - The case sensitive name of the module
 * @param {String} title - The title of the coursework
 * @param {String} description - The description of the coursework
 * @param {String} dueDate - The date the coursework is due, in YYYYMMDD format
 * @param {boolean} isGroup - Whether the project is a group project
 * @param {double} weighting - The weighting in regards to other courseworks on the module
 * @param {integer} maxMark - The maximum attainable maxMark
 * @returns {integer} - The coursework_id within the database, so it can be used in future
 * @author Alex
  */
exports.setCoursework = (token, module, title, description, dueDate, isGroup, weighting, maxMark) =>
	new Promise((resolve, reject) => {
		canMake(token, module).then(() => {
			assignCoursework(module, title, description, dueDate, isGroup, weighting, maxMark).then((coursework_id) => {
				resolve(coursework_id)
			}).catch((err) => {
				reject(err)
			})
		}).catch((err) => {
			reject(err)
		})
	})

/**
 * Checks if the owner of a given token can add coursework to the given module
 * @param {String} token - The authentication token for the user
 * @param {String} module - The case sensitive name of the module
 * @returns {boolean} - Resolves if validated
 * @author Alex
 */
const canMake = (token, module) =>
	new Promise((resolve, reject) => {
		auth.token(token).then((user) => {
			checkLeader(module, user).then(() => {
				resolve()
			}).catch((err) => {
				reject(err)
			})
		}).catch((err) => {
			reject(err)
		})
	})

/**
 * Checks if a user is the leader of a module or an administrator
 * @param {String} module - The case sensitive name of the module
 * @param {Object} user - The object returned by auth.token for a given user
 * @returns {boolean} - Resolves if user is leader/admin
 * @author Alex
 */
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

/**
 * Assigns coursework to a given module
 * @param {String} module - The case sensitive name of the module
 * @param {String} title - The title of the coursework
 * @param {String} description - The description of the coursework
 * @param {String} dueDate - The date the coursework is due, in YYYYMMDD format
 * @param {boolean} isGroup - Whether the project is a group project
 * @param {double} weighting - The weighting in regards to other courseworks on the module
 * @param {integer} maxMark - The maximum attainable maxMark
 * @returns {integer} - The coursework_id in the database
 * @author Alex
 */
const assignCoursework = (module, title, description, dueDate, isGroup, weighting, maxMark) =>
	new Promise((resolve, reject) => {
		getModuleId(module).then((moduleId) => {
			const query = `INSERT INTO coursework(module_id, title, description, due_date, is_group, weighting, maximum_mark) VALUES (${moduleId}, '${title}', '${description}', '${dueDate}', ${isGroup}, ${weighting}, ${maxMark}) RETURNING coursework_id`
			pool.query(query, (err, result) => {
				if (err) {
					reject(err)
				} else {
					resolve(result.rows[0].coursework_id)
				}
			})
		}).catch((err) => {
			reject(err)
		})
	})

	/**
	 * Assigns coursework to an individual student
	 * @param {String} username - The username of the student
	 * @param {String} title - The title of the coursework
	 * @param {String} description - The description of the coursework
	 * @param {String} dueDate - The date the coursework is due, in YYYYMMDD format
	 * @param {boolean} isGroup - Whether the project is a group project
	 * @param {double} weighting - The weighting in regards to other courseworks on the module
	 * @param {integer} maxMark - The maximum attainable maxMark
	 * @returns {integer} - The coursework_id in the database
	 * @author Josh
	 */
const assignIndividualCoursework = (username, title, description, dueDate, isGroup, weighting, maxMark) =>
	new Promise((resolve, reject) => {
		getStudentId(username).then((userId) => {
			const query = `INSERT INTO coursework(user_id, title, description, due_date, is_group, weighting, maximum_mark) VALUES (${userId}, '${title}', '${description}', '${dueDate}', ${isGroup}, ${weighting}, ${maxMark}) RETURNING coursework_id`
			pool.query(query, (err, result) => {
				if (err) {
					reject(err)
				} else {
					resolve(result.rows[0].coursework_id)
				}
			})
		}).catch((err) => {
			reject(err)
		})
	})
	/**
	 * Sets coursework for a given module
	 * @param {String} token - The authentication token for the user trying to set the coursework
	 * @param {String} username - The name of the user
	 * @param {String} title - The title of the coursework
	 * @param {String} description - The description of the coursework
	 * @param {String} dueDate - The date the coursework is due, in YYYYMMDD format
	 * @param {boolean} isGroup - Whether the project is a group project
	 * @param {double} weighting - The weighting in regards to other courseworks on the module
	 * @param {integer} maxMark - The maximum attainable maxMark
	 * @returns {integer} - The coursework_id within the database, so it can be used in future
	 * @author Josg
	  */
exports.setCoursework = (token, username, title, description, dueDate, isGroup, weighting, maxMark) =>
	new Promise((resolve, reject) => {
		canMake(token, username).then(() => {
			assignIndividualCoursework(username, title, description, dueDate, isGroup, weighting, maxMark).then((coursework_id) => {
				resolve(coursework_id)
			}).catch((err) => {
				reject(err)
			})
		}).catch((err) => {
			reject(err)
		})
	})
/**
 * Gets the module ID in the database for a given module
 * @param {String} module - The case sensitive name of the module
 * @returns {integer} - The database module_id of the module
 * @author Alex
 */
const getModuleId = (module) =>
	new Promise((resolve, reject) => {
		const query = `SELECT module_id FROM module WHERE name='${module}'`
		console.log(query)
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
	/**
	 * Gets the student ID in the database for a given student
	 * @param {String} username - The username of the student
	 * @returns {integer} - The database student_id of the student
	 * @author Josh
	 */
const getStudentId = (username) =>
	new Promise((resolve, reject) => {
		const query = `SELECT user_id FROM users WHERE name='${username}'`
		console.log(query)
		pool.query(query, (err, result) => {
			if (err) {
				reject(err)
			}
			if (result.rows.length === 0) {
				reject('Invalid student name.')
			} else {
				resolve(result.rows[0].user_id)
			}
		})
	})
