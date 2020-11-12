
const jwt = require('jsonwebtoken');

const {execQuery} = require('./db');

function authenticateUser(username, password) {
  execQuery('SELECT * FROM Users WHERE username=? and password=?', [username, password],
		(err, result, fields) => {
			if (err) {
				console.error(err);
				return;
			}
      return (result.length == 0) ? 'Failure' : 'Success';
    });
}

function getToken(user) {
	return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '900000s' });
}


function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  })
}

module.exports = {authenticateToken, getToken};