var Pool = require('pg').Pool;
var logins = require('../constants');

exports.salt = function(user, cb) {
  const saltQuery = "SELECT salt FROM users WHERE username='" + user + "'";
  var pool = new Pool(logins.dbInfo);
  pool.on('error', function(e, client) {
    console.log(e);
  });
  pool.query(saltQuery, function(err, result) {
    if (err) {
      console.log(err);
      cb({success: false, data: err}, true);
    }
    if (result.rows.length === 0) {
      cb({success: false, data: "Invalid username provided."}, false);
    } else {
      cb({salt: result.rows[0].salt}, false);
    }
  });
};

exports.token = function(user, hashedPassword, cb) {
  const verificationQuery = "SELECT user_id FROM users WHERE username='"
                            + user + "' AND hashed_password = '"
                            + hashedPassword + "'";
  const tokenQuery = "INSERT INTO login_token (user_id, token, expiry_time) \
                      VALUES (" + userId + ", " + token +
                      ", NOW() + interval \'15 minutes\')";
}

function genToken(user) {

}
