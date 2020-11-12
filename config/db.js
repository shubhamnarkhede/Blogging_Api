const mysql = require('mysql2');


function execQuery(sql, placeholderValues, callback) {
	let con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        
	});
	con.connect(err => {
		if (err) {
			throw err;
			console.log(err);
			console.error('DataBase connection error!');
		}
	});	
	con.query(sql, placeholderValues, callback);		
	con.end();	
}

//Uses Promise; was having trouble with grabbing return values from callback; had to settle for async-await finally
function execQuery2(sqlQuery, placeholderValues) {
	return new Promise((resolve, reject) => {
		 let con = mysql.createConnection({
			host: 'localhost',
			user: 'root',
			password: '1234',
			database: 'blog-dev'
		});
						
		con.query(sqlQuery, placeholderValues, (err, result, fields) => {
			if (err) {
				console.error(err);
				reject('ERROR')
			}
			con.end();
			resolve(result);
		});
	});
}
// SOLVE UNHANDLED PROMISE ISSUE;

module.exports = {execQuery, execQuery2};

