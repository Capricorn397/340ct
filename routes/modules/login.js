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
  verifyUser(user, hashedPassword, function(valid, userId) {
    if (valid) {
      genToken(userId, function(error, token) {
        if (error) {
          cb({success: false, data: "Failed to generate token"}, true);
        } else {
          cb({"token": token}, false);
        }
      });
    } else {
      cb({success: false, data: "Invalid password."}, true);
    }
  });
}

function verifyUser(user, hashedPassword, cb) {
  const verificationQuery = "SELECT user_id FROM users WHERE username='"
                            + user + "' AND hashed_password = '"
                            + hashedPassword + "'";
  var pool = new Pool(logins.dbInfo);
  pool.on('error', function(e, client) {
    console.log(e);
  });
  pool.query(verificationQuery, function(err, result) {
    if (err) {
      console.log(err);
      cb(false);
    }
    if (result.rows.length === 0) {
      cb(false);
    } else {
      cb(true, result.rows[0].user_id);
    }
  });
}

function genToken(userId, cb) {
  require('crypto').randomBytes(48, function(err, buffer) {
    var token = buffer.toString('hex');
    const tokenQuery = "INSERT INTO login_token (user_id, token, expiry_time) \
                        VALUES (" + userId + ", " + token +
                        ", NOW() + interval \'15 minutes\') RETURNING token";
    console.log(tokenQuery);
    var pool = new Pool(logins.dbInfo);
    pool.on('error', function(e, client) {
      console.log(e);
    });
    pool.query(tokenQuery, function(err, result) {
      if (err) {
        console.log(err);
        cb(true);
      }
      if (result.rows.length === 0) {
        cb(true);
      } else {
        cb(false, result.rows[0].token);
      }
    });
  });
}
