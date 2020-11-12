
const {execQuery} = require('../config/db');
const {execQuery2} = require('../config/db');


//INSERT New Article
function createArticle(req, res) {
//input: {title: ..., content: ...}
//	let article = {username: req.user.username, title: req.body.title, content: req.body.content};
	
	execQuery('INSERT INTO Articles (username, article_title, article_content, timestamp) VALUES (?, ?, ?, ?)',
		[req.user.username, req.body.title, req.body.content, Date.now()], (err, result, fields) => {
		if (err) {
			console.error(err);
			res.status(500).send('Error!');
			return;
		}
		res.status(201).send('Article inserted!');
	});
	
}

//UPDATE

function updateArticle(req, res) {
	//input: {article_id: ..., new_title: ..., new_content: ...}
	// check if this article exists and is written by current user
	// delete article from Articles where articleid = article_id_inp & user = current_user;
	// Alter Articles table
	// update Users SET username='qqqq', password='eeezzz',bio='e3e3' where username='eee';

	execQuery('UPDATE Articles SET article_title=?, article_content=?, timestamp=? where username=? and article_id=?',
		[req.body.new_title, req.body.new_content, Date.now(), req.user.username, req.body.article_id],
		(err, result, fields) => {
			if (err) {
				console.error(err);
				res.status(500).send('Error!');
				return;
			}
	  	res.status(201).send('If such an article existed, it is updated successfully!');
		});
}

//DELETE
function deleteArticle(req, res) {
	//input: {article_id: ...}
	// check if this article exists and is written by current user
	// delete row
	execQuery('DELETE FROM Articles WHERE article_id=? AND username=?',
		[req.body.article_id, req.user.username], (err, result, fields) => {
		if (err) {
			console.error(err);
			res.status(500).send('Error!');
			return;
		}
		res.status(200).send('Article deleted!');//user + ' stopped following ' + user_to_follow + '.')
	});
}


//REST ALL, SELECT QUERY

async function getArticlesByUser(username) {
			
	let resultPromise = execQuery2('SELECT * FROM Articles where username=?', [username]);
	let result = await resultPromise; // if the username is invalid, result is []; so doing result[0].bio will throw TypeError
	return result;
}

async function listArticlesByUser(req, res) {
	//input: {"username": ...}
	let result = await getArticlesByUser(req.body.username);
	res.json(result);
}

async function listMyArticles(req, res) {
	//input: empty
	//list_articles_by_user(req.user.username);
	let result = await getArticlesByUser(req.user.username);
	res.json(result);
}

async function listAllArticles(req, res) {
	//input: empty
	// select * from Articles order by timestamp desc;
	let resultPromise = execQuery2('SELECT * FROM Articles', []);
	let result = await resultPromise; // if the username is invalid, result is []; so doing result[0].bio will throw TypeError
	res.json(result);
}


async function myFeed(req, res) {

	let resultPromise = execQuery2('SELECT B as username FROM AfollowsB where A=?', [req.user.username]);
	let followingUsers = await resultPromise; // if the username is invalid, result is []; so doing result[0].bio will throw TypeError
	//array of objects returned like: [ {username: .. }, {username: ..}, {..}, ...]
	let feed = [];
	for (user of followingUsers) {
		let articlesForThisUser = await getArticlesByUser(user.username);
		for (article of articlesForThisUser)
			feed.push(article);
	}
	// sort into descending order by timestamp, so most recent article is on top of our feed
	
	feed.sort(function (item1, item2) {
		return item2.timestamp - item1.timestamp; 
	});
	
	for (article of feed) {
		let dateObj = new Date(article.timestamp);			
		let readableTimestamp = dateObj.toLocaleTimeString() + ", " + dateObj.getDate() + "/"
									+ dateObj.getMonth() + "/" + dateObj.getFullYear();
		article.timestamp = readableTimestamp;		
	}
	res.json(feed);
	
}


module.exports = {myFeed, createArticle, updateArticle, deleteArticle, listArticlesByUser, listMyArticles, listAllArticles};


