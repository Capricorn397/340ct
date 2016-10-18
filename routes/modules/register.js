var Pool = require('pg').Pool;
var logins = require('../constants');

var pool = new Pool(logins.dbInfo);
pool.on('error', function(e, client) {
  console.log(e);
});

/**
 * Registers a new user with just username and salt, then returns the salt
 */
exports.salt = function(user, cb) {
  checkExists(user, function(exists) {
    if (exists) {
      cb({success: false, data: "User already exists. Cannot recreate salt."}, true);
    } else {
      genSalt(user, function(error, salt) {
        if (error) {
          cb({success: false, data: "Could not generate salt."}, true);
        } else {
          cb({"salt": salt}, false);
        }
      });
    }
  });
}

/**
 * Fills in the blank data for a given user.
 */
exports.finalise = function(user, hashed_password, firstname, surname, title, cb) {
  checkBlankPassword(user, function(blank) {
    if (blank) {
      appendToUser(user, hashed_password, firstname, surname, title, function(success) {
        if (success) {
          cb({success: true}, false);
        } else {
          cb({success: false, data: "Unable to update user record."}, true);
        }
      });
    } else {
      cb({success: false, data: "User already registered. Don't try and re-register."}, true);
    }
  });
}

/**
 * Checks if a user already exists
 */
function checkExists(user, cb) {
  const query = "SELECT user_id FROM users WHERE username='" + user + "'";
  pool.query(query, function(err, result) {
    if (err) {
      console.log(err);
      cb(true); // Better to say it exists than have duplicates
    }
    if (result.rows.length === 0) {
      cb(false);
    } else {
      cb(true);
    }
  });
}

/**
 * Generates a new salt.
 */
function genSalt(user, cb) {
  require('crypto').randomBytes(16, function(err, buffer) {
    var salt = buffer.toString('hex');
    if (err) {
      cb(true);
    } else {
      const query = "INSERT INTO users (username, salt) VALUES ('" + user + "', '" + salt + "')";
      pool.query(query, function(err, result) {
        if (err) {
          console.log(err);
          cb(true); // Better to say it exists than have duplicates
        } else {
          cb(false, salt);
        }
      });
    }
  });
}

/**
 * Verify a user has no password
 */
function checkBlankPassword(user, cb) {
  const query = "SELECT hashed_password FROM users WHERE username='" + user + "' AND hashed_password IS NULL";
  pool.query(query, function(err, result) {
    if (err) {
      console.log(err);
      cb(false); // Better to say it exists than have duplicates
    }
    if (result.rows.length === 0) {
      cb(false);
    } else {
      cb(true);
    }
  });
}

/**
 * Adds new data to a user
 */
function appendToUser(user, hashed_password, firstname, surname, title, cb) {
  const query = "UPDATE users SET hashed_password='" + hashed_password + "', forename='" + firstname + "', surname='" + surname + "', title='" + title + "' WHERE username='" + user + "'";
  pool.query(query, function(err) {
    if (err) {
      console.log(err);
      cb(false);
    } else {
      cb(true);
    }
  });
}
