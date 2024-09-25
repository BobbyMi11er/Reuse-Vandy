require('dotenv').config()
// Import the express module
const express=require('express');
// Create an instance of the express application
const app=express();
// Specify a port number for the server
const port=process.env.SERVER_PORT

const conn = require('./connection')
const bodyParser = require('body-parser')


// Start the server and listen to the port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

conn.connect(function(err) {
  if (err) throw err;
  console.log("Connected to DB!");
});
