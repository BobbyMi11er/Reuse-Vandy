require('dotenv').config()

var mysql = require('mysql')

var conn = mysql.createConnection({
    host: process.env.HOST_URL,
    user: process.env.USER,
    password: process.env.PASSWORD,
    timeout: 15
})

module.exports = conn;