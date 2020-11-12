
const auth = require('../config/auth')
const {execQuery} = require('../config/db')

function register(req, res) {
	//input: {username: ..., password: ..., bio: ...}
	//let status = register.registerUser(req.body.username, req.body.password);
	//Insert row into Users table;

	execQuery('INSERT INTO users (username, password, bio) VALUES (?, ?, ?)',
		[req.body.username, req.body.password, req.body.bio], (err, result, fields) => {
			if (err) {
				console.error(err);
				res.status(500).send('Error!');
				return;
			}	
			res.status(201).send('User registered!');
	});
}

function login(req, res) {
	// {username:..., password: ... }
  const username = req.body.username;
  const password = req.body.password;

	 execQuery('SELECT * FROM Users WHERE username=? and password=?', [username, password],
		(err, result, fields) => {
			if (err) {
				console.error(err);
				res.status(500).send('Error!');
				return;
			}
			let status = (result.length == 0) ? 'Failure' : 'Success';

			if (status === 'Failure')
				res.status(401).send('Unauthorized!');
			else {
				const user = {username};
				const accessToken = auth.getToken(user);  
				res.json({ accessToken: accessToken });
			}
		});
}


function update(req, res) {
	// {"new_password": ... };
	
  execQuery('UPDATE Users SET password=? where username=?',
		[req.body.new_password, req.user.username], (err, result, fields) => {
		if (err) {
			console.error(err);
			res.status(500).send('Error!');
			return;
		}
	  res.status(201).send('Password updated successfully!');
	});
}


module.exports = {register, login, update};

