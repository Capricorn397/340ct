'use strict'

const express = require('express')
const router = express.Router()
const login = require('./modules/login')
const register = require('./modules/register')
const coursework = require('./modules/coursework')
const submission = require('./modules/submission')


const serverErrorCode = 500

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', { title: 'Express' })
})

router.get('/login', function(req, res) {
	res.render('partials/login')
})

router.get('/register', function(req, res) {
	res.render('partials/register')
})

router.get('/myToken', function(req, res) {
	res.json({'token': req.cookies.token })
})

router.get('/upload', function(req, res) {
	res.render('partials.upload')
})

// INPUT: Anything
// OUTPUT: Anything
router.post('/api/echo', function(req, res) {
	console.log(req.body)
	res.json(req.body)
})

// INPUT: { "user": "test" }
// OUTPUT: { "salt": "response" }
/**
 * Endpoint to get the salt for a given user
 */
router.post('/api/login/salt', function(req, res) {
	login.salt(req.body.user).then((response) => {
		res.json(response)
	}).catch((response) => {
		res.status(serverErrorCode).json(response)
	})
})

// INPUT: { "user": "test", "password": "hashed_password" }
// OUTPUT: { "token": token }
/**
 * Endpoint to generate a login token for a given user and set its expiry time.
 */
router.post('/api/login/token', function(req, res) {
	login.token(req.body.user, req.body.password).then((response) => {
		res.json(response)
	}).catch((response) => {
		res.status(serverErrorCode).json(response)
	})
})

// INPUT: { "user": "test" }
// OUTPUT: { "salt": "response" }
/**
 * Endpoint to create a blank user with just a username and salt
 */
router.post('/api/register/salt', function(req, res) {
	register.salt(req.body.user).then((response) => {
		res.json(response)
	}).catch((response) => {
		res.status(serverErrorCode).json(response)
	})
})

/*INPUT:
 * {
 *		"user": "username",
 *		"hashed_password": "hashed_password",
 *		"firstname": "forename",
 *		"surname": "surname",
 *		"title", "Mr"
 * }
 */
// OUTPUT: { "success": "true" }
/**
 * Endpoint to finalise registration of a user (must have used /api/register/salt first)
 */
router.post('/api/register/user', function(req, res) {
	register.finalise(req.body.user, req.body.hashed_password, req.body.firstname, req.body.surname, req.body.title).then((response) => {
		res.json(response)
	}).catch((response) => {
		res.status(serverErrorCode).json(response)
	})
})

router.post('/api/coursework', (req, res) => {
	coursework.setCoursework(req.cookies.token, req.body.module, req.body.title, req.body.description, req.body.dueDate, req.body.isGroup, req.body.weighting, req.body.maxMark).then((courseworkId) => {
		res.json({'success': true, 'created_id': courseworkId})
	}).catch((err) => {
		res.status(serverErrorCode).json({'success': false, 'data': err})
	})
})

/*INPUT:
 * {
 *		"student": "username",
 *		"title": "title",
 *		"description": "description",
 *		"dueDate": "DueDate",
 *		"isGroup": "isGroup"
 *		"weighting": "weighting"
 *		"maxMark": "maxMark"
 * }
 */
/*OUTPUT:
 *	{
 * 		"success": "true",
 *		"created_id": id
 *	}
 */
/**
 * Endpoint to finalise assignment of coursework to an individual student
 */
router.post('/api/coursework/student', (req, res) => {
	coursework.setStudentCoursework(req.cookies.token, req.body.student, req.body.title, req.body.description, req.body.dueDate, req.body.isGroup, req.body.weighting, req.body.maxMark).then((courseworkId) => {
		res.json({'success': true, 'created_id': courseworkId})
	}).catch((err) => {
		res.status(serverErrorCode).json({'success': false, 'data': err})
	})
})

router.post('/api/upload', (req, res) => {
	submission()
})

module.exports = router
