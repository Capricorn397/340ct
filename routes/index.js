var express = require('express');
var router = express.Router();
var pg = require('pg');

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
  const connectionString = "postgres://coursework_rw:StealthyChef@164.132.195.20:5432/coursework";
  pg.connect(connectionString, (err, client, done) => {
    if (err) {
      done();
      console.log(err);
      return res.status(500), json({success: false, data: err});
    }
    const query = client.query(saltQuery);
    query.on('row', (row) => {
      results.push(row);
    });
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

module.exports = router;
