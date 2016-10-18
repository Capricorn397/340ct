var express = require('express');
var router = express.Router();
var Pool = require('pg').Pool;
var login = require('./modules/login');
var register = require('./modules/register');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('partials/login');
});

router.post('/api/echo', function (req, res) {
  console.log(req.body);
  res.json(req.body);
});

// INPUT: { "user": "test" }
// OUTPUT: { "salt": "response" }
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
router.post('/api/login/token', function(req, res, next) {
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
router.post('/api/register/user', function(req, res, next) {
  register.finalise(req.body.user, req.body.hashed_password, req.body.firstname, req.body.surname, req.body.title, function(response, error) {
    if (error) {
      res.status(500).json(response);
    } else {
      res.json(response);
    }
  });
});

module.exports = router;
