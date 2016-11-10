var express = require('express');
var cookieParser = require('cookie-parser');
var router = express.Router();
var login = require('./modules/login');
var register = require('./modules/register');
var auth = require('./modules/auth')
var modules = require('./modules/moduleOptions');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('partials/login');
});

router.get('/register', function(req, res, next) {
	res.render('partials/register')
})

router.get('/myToken', function(req, res, next) {
	res.json({'token': req.cookies.token })
})
router.get('/modules/add', function(req, res, next) {
	res.render('partials/addModule')
})
// INPUT: Anything
// OUTPUT: Anything
router.post('/api/echo', function (req, res) {
  console.log(req.body);
  res.json(req.body);
});

// INPUT: { "user": "test" }
// OUTPUT: { "salt": "response" }
/**
 * Endpoint to get the salt for a given user
 */
router.post('/api/login/salt', function(req, res, next) {
  console.log(req.body);
  login.salt(req.body.user, function(response, error) {
    if (error) {
      res.status(500).json(response);
    } else {
      res.json(response);
    }
  });
});

// INPUT: { "user": "test", "password": "hashed_password" }
// OUTPUT: { "token": token }
/**
 * Endpoint to generate a login token for a given user and set its expiry time.
 */
router.post('/api/login/token', function(req, res, next) {
  console.log(req.body);
  login.token(req.body.user, req.body.password, function(response, error) {
    if (error) {
      res.status(500).json(response);
    } else {
      res.json(response);
    }
  });
});

// INPUT: { "user": "test" }
// OUTPUT: { "salt": "response" }
/**
 * Endpoint to create a blank user with just a username and salt
 */
router.post('/api/register/salt', function(req, res, next) {
  register.salt(req.body.user, function(response, error) {
    if (error) {
      res.status(500).json(response);
    } else {
      res.json(response);
    }
  });
});

/*INPUT:
 * {
 *    "user": "username",
 *    "hashed_password": "hashed_password",
 *    "firstname": "forename",
 *    "surname": "surname",
 *    "title", "Mr"
 * }
 */
// OUTPUT: { "success": "true" }
/**
 * Endpoint to finalise registration of a user (must have used /api/register/salt first)
 */
router.post('/api/register/user', function(req, res, next) {
  register.finalise(req.body.user, req.body.hashed_password, req.body.firstname, req.body.surname, req.body.title, function(response, error) {
    if (error) {
      res.status(500).json(response);
    } else {
      res.json(response);
    }
  });
});

router.post('/api/module/add', function(req, res, next) {
	modules.addModule(req.cookies.token ,req.body, function(response, error) {
		if (error) {
			res.status(500).json(response)
		} else {
			res.json(response)
		}
	})
})
module.exports = router;
