// routes/postRouter.js

const express = require('express');
const pool = require('../connection'); // Import the MySQL connection pool

const postRouter = express.Router();

// Create a new post
postRouter.post('/', async (req, res) => {
    const { title, description, color, image_url } = req.body;

    try {
        // Parameterized query to safely insert data into the database
        const queryString = `INSERT INTO Post (user_firebase_id, title, description, color, image_url) 
                             VALUES (?, ?, ?, ?, ?)`;
                             
        // Execute the query with user_firebase_id set to '1' as an example
        const [result] = await pool.execute(queryString, ['1', title, description, color, image_url]);

        // Send response with the newly created post ID
        res.status(201).json({ message: 'Post created', post_id: result.insertId });
    } catch (err) {
        // Handle errors
        res.status(500).json({ message: 'Failed to create post', err });
    }
});

// Get all posts with optional search and filter by color
postRouter.get('/', async (req, res) => {
    const { search, color } = req.query;
    try {
        let query = 'SELECT * FROM Post WHERE 1=1'; // Base query (1=1 ensures always valid syntax for further conditions)
        const queryParams = [];

        if (search) {
            query += ' AND title LIKE ?';
            queryParams.push(`%${search}%`);
        }

        if (color) {
            query += ' AND color = ?';
            queryParams.push(color);
        }

        // Execute the query with optional search and filter parameters
        const [posts] = await pool.execute(query, queryParams);
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve posts', error });
    }
});

// Get a single post by ID
postRouter.get('/:post_id', async (req, res) => {
    try {
        const [post] = await pool.execute('SELECT * FROM Post WHERE post_id = ?', [req.params.post_id]);

        if (post.length === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json(post[0]);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve post', error });
    }
});

// Update a post by ID
postRouter.put('/:post_id', async (req, res) => {
    const { title, description, color, image_url } = req.body;
    try {
        // Check if the post exists
        const [post] = await pool.execute('SELECT * FROM Post WHERE post_id = ?', [req.params.post_id]);

        if (post.length === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Assuming req.user.id is the logged-in user's ID
        if (post[0].user_id !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Perform the update
        await pool.execute(
            'UPDATE Post SET title = ?, description = ?, color = ?, image_url = ? WHERE post_id = ?',
            [title, description, color, image_url, req.params.post_id]
        );
        res.status(200).json({ message: 'Post updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update post', error });
    }
});

// Delete a post by ID
postRouter.delete('/:post_id', async (req, res) => {
    try {
        // Check if the post exists
        const [post] = await pool.execute('SELECT * FROM Post WHERE post_id = ?', [req.params.post_id]);

        if (post.length === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Ensure the user is authorized to delete the post
        if (post[0].user_id !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Delete the post
        await pool.execute('DELETE FROM Post WHERE post_id = ?', [req.params.post_id]);
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete post', error });
    }
});

module.exports = postRouter;