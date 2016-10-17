var express = require('express');
var router = express.Router();
var Pool = require('pg').Pool;
var login = require('./modules/login');

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

router.post('/api/login/token', function(req, res, next) {
  login.token(req.body.user, req.body.password, function(response, error) {

  });
});

module.exports = router;
