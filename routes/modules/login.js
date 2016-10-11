var Pool = require('pg').Pool;

exports.salt = function(user, cb) {
  const saltQuery = "SELECT salt FROM users WHERE username='" + user + "'";
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
    console.log(e);
  });
  pool.query(saltQuery, function(err, result) {
    if (err) {
      console.log(err);
      cb({success: false, data: err}, false);
    }
    if (result.rows.length === 0) {
      cb({success: false, data: "Invalid username provided."}, true);
    } else {
      cb({salt: result.rows[0].salt}, true);
    }
  });
}
