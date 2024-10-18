const express = require('express');
const pool = require('../connection'); // Import the MySQL connection pool

const postRouter = express.Router();

// Create a new post
postRouter.post('/', async (req, res) => {
    const { user_firebase_id, title, description, color, image_url, price, size } = req.body;

    // TODO: user_firebase_id NEEDS to go through token verification with firebase
    try {
        // Parameterized query to safely insert data into the database with price and size
        const queryString = `INSERT INTO Post (user_firebase_id, title, description, color, image_url, price, size) 
                             VALUES (?, ?, ?, ?, ?, ?, ?)`;

        // Execute the query with all provided data, including price and size
        const [result] = await pool.execute(queryString, [user_firebase_id, title, description, color, image_url, price, size]);

        // Send response with the newly created post ID
        res.status(201).json({ message: 'Post created', post_id: result.insertId });
    } catch (err) {
        // Handle errors
        res.status(500).json({ message: 'Failed to create post', err });
    }
});

// Get all posts with optional search, filter by color, filter by user, and include price and size
postRouter.get('/', async (req, res) => {
    const { search, color, user_firebase_id, min_price, max_price, size } = req.query;
    try {
        let query = 'SELECT * FROM Post WHERE 1=1'; // Base query
        const queryParams = [];

        if (search) {
            query += ' AND title LIKE ?';
            queryParams.push(`%${search}%`);
        }

        if (color) {
            query += ' AND color = ?';
            queryParams.push(color);
        }

        if (user_firebase_id) {
            query += ' AND user_firebase_id = ?';
            queryParams.push(user_firebase_id);
        }

        if (min_price) {
            query += ' AND price >= ?';
            queryParams.push(min_price);
        }

        if (max_price) {
            query += ' AND price <= ?';
            queryParams.push(max_price);
        }

        if (size) {
            query += ' AND size = ?';
            queryParams.push(size);
        }

        // Execute the query with all search and filter parameters
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

// Update a post by ID, including price and size fields
postRouter.put('/:post_id', async (req, res) => {
    const { title, description, color, image_url, price, size } = req.body;
    try {
        // Check if the post exists
        const [post] = await pool.execute('SELECT * FROM Post WHERE post_id = ?', [req.params.post_id]);

        if (post.length === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // TODO: Add check that the user.firebase_user_id = post.firebase_user_id

        // Perform the update
        const [updatedPost] = await pool.execute(
            'UPDATE Post SET title = ?, description = ?, color = ?, image_url = ?, price = ?, size = ? WHERE post_id = ?',
            [title, description, color, image_url, price, size, req.params.post_id]
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
