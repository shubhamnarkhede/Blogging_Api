
const {execQuery} = require('../db');
const {execQuery2} = require('../db');

function update(req, res) {
	// {new_bio: ...}
	//update Users_Profile table;  replace bio by req.body.new_bio;
	execQuery('UPDATE Users SET bio=? where username=?',
		[req.body.new_bio, req.user.username], (err, result, fields) => {
		if (err) {
			console.error(err);
			res.status(500).send('Error!');
			return;
		}
		res.status(201).send('Bio updated!');
	});
	
}

function follow(req, res) {
	// {user_to_follow: ... }
//	let user = req.user.username, user_to_follow = req.body.user_to_follow;
	
	//First check if the user whom we want to follow exists
	if (req.body.user_to_follow === req.user.username) {
		return res.status(400).send('Why follow yourself? :P');
	}
	
	execQuery('SELECT * FROM Users WHERE username=?', [req.body.user_to_follow],
		(err, result, fields) => {
			if (err) {
				console.error(err);
				res.status(500).send('Error!');
				return;
			}
			let status = (result.length == 0) ? 'Failure' : 'Success';

			if (status === 'Failure')
				res.status(400).send('The given user doesn\'t exist!');
			else {
			/*
				const user = {username};
				const accessToken = auth.getToken(user);  
				res.json({ accessToken: accessToken }); */
				execQuery('INSERT INTO AfollowsB (A, B) VALUES (?, ?)',
					[req.user.username, req.body.user_to_follow], (err, result, fields) => {
					if (err) {
						console.error(err);
						res.status(500).send('Error!');
						return;
					}
					res.status(201).send(req.user.username + ' is following ' + req.body.user_to_follow + ' now!')
				});				
			}
	});	
	// add row to AfollowsB table
	//feed.follow(user, to_follow_user);
}


function unfollow(req, res) {
	// {user_to_unfollow: ... }
	//let user = req.user.username, user_to_unfollow = req.body.user_to_unfollow;
	// remove appropriate row from AfollowsB table
	execQuery('DELETE FROM AfollowsB WHERE A=? AND B=?',
		[req.user.username, req.body.user_to_unfollow], (err, result, fields) => {
		if (err) {
			console.error(err);
			res.status(500).send('Error!');
			return;
		}
		res.status(201).send('Done!');//user + ' stopped following ' + user_to_follow + '.')
	});	
}

async function showMyProfile(req, res) {
	// empty body
	// show_profile_by_username(req.user.username)
	let result = await getProfileByUsername(req.user.username);
	res.json({username: result[0].username, bio: result[0].bio});

/*	if (result.length !== 0)	

	else
			res.status(404).send('No such data!');	 */
}

async function showProfile(req, res) {
	// {"username": ... } ; input format, profile to show
	// show_profile_by_username(req.body.username)
	let result = await getProfileByUsername(req.body.username);
	if (result.length !== 0)	
			res.json({username: result[0].username, bio: result[0].bio});
	else
			res.status(404).send('No such user!');
}

//Helper for 3 show_profile_X functions
async function getProfileByUsername(username) {
	// show info from Users_Profile (username, bio), Articles (article count), AfollowsB (follower count, following count) and return one object
	// {username: .. , bio: .. , articles_count: ..., followers_count: .., following_count: ..}
	// return info;
	
	let resultPromise = execQuery2('SELECT username, bio FROM Users where username=?', [username]);
	let result = await resultPromise; // if the username is invalid, result is []; so doing result[0].bio will throw TypeError
	return result;
//	return {username: result[0].username, bio: result[0].bio};
	/* // Below code was tested in `test.js'
		let resultPromise = execQuery2('SELECT username, bio FROM Users where username=?', [req.body.username]);
	let result;
	try {
		result = await resultPromise;
		if (result.length !== 0)	
			res.json({bio: result[0].bio, username: result[0].username})
		else
			res.status(400).send('No such data!') // I missed this else part and Postman didn't get any response, so was stuck.
	} catch (e) {
		console.error(e);
		res.status(400).send('wrong input data');
	}
	*/
}

async function showAllProfiles(req, res) {
	//input: empty body
	let all_users = [];
	let resultPromise = execQuery2('SELECT username, bio FROM Users', []);
	let result = await resultPromise; // if the username is invalid, result is []; so doing result[0].bio will throw TypeError
	res.json(result);
/*	for (item of result)
		all_users.push(item.username)
	
	for (user of all_users) {
		
	}*/
	
	// iterate all users, run `show_profile_by_username' for each and add to array
	// return all_users;
}

module.exports = {follow, unfollow, update, showAllProfiles, showMyProfile, showProfile};


