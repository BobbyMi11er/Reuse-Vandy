const express = require('express');
const bodyParser = require('body-parser');
const postRouter = require('./routers/postRouter'); // Import the post routes
const userRouter = require('./routers/userRouter.js');
// const { authenticate } = require('./middleware/auth'); 

const app = express();

// Middleware
app.use(bodyParser.json());

// Authentication middleware
// THIS WILL BE IMPLEMENTED WITH FIREBASE ONCE PR MERGED
// app.use(authenticate); // This will apply authentication globally; modify if needed

// Use the postRouter for routes starting with /posts
app.use('/posts', postRouter);

// Use the userRouter for routes starting with /users
app.use('/users', userRouter);

// Example home route
app.get('/', (req, res) => {
    res.send('ReuseVandy API is running!');
});

// Error handling middleware
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
    });
});

// Start the server
const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
