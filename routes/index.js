var express = require('express');
var router = express.Router();
var Pool = require('pg').Pool;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('partials/login');
});
// INPUT: { "user": "test" }
// OUTPUT: {  }
router.get('/api/login/salt', function(req, res, next) {
  const saltQuery = "SELECT salt FROM users WHERE username='alex'";//req.body.user
  const results = [];
  var pool = new Pool({
    user: "coursework_rw",
    password: "StealthyChef",
    host: "164.132.195.20",
    database: "coursework",
    max: 10,
    idleTimeoutMillis: 1000
  });
  pool.on('error', function(e, client) {

  });
  pool.query(saltQuery, function(err, result) {
    if (err) {
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    return res.json({salt: result.rows[0].salt});
  });
});

module.exports = router;
