const mysql = require('mysql2');
const {createPool} = require("mysql");
//Pooling
const pool = createPool({
	host: 'localhost',
	user: 'root',
	password: '1234',
	database: 'blog-dev',
	connectionLimit: 1000
});
//For pooling

function execQuery(sql, placeholderValues, callback) {
	pool.query(sql, placeholderValues, callback);
}

//Uses Promise; was having trouble with grabbing return values from callback; had to settle for async-await finally
function execQuery2(sqlQuery, placeholderValues) {
	return new Promise((resolve, reject) => {					
		pool.query(sqlQuery, placeholderValues, (err, result, fields) => {
			if (err) {
				console.error(err);
				reject('ERROR');
			}
			resolve(result);
		});
	});
}

module.exports = {execQuery, execQuery2};
