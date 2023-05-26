const pgp = require('pg-promise')(/* options */)
require('dotenv').config();
const connectionString = process.env.DATABASE_URL; // Suppose DATABASE_URL is the name of your environment variable

console.log(process.env.DATABASE_URL);

const db = pgp(connectionString)

db.one('SELECT $1 AS value', 123)
  .then((data) => {
    // console.log('DATA:', data.value)
  })
  .catch((error) => {
    console.log('ERROR:', error)
  })
  module.exports = db;

