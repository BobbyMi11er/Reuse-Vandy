const express = require('express');
const pool = require('../connection'); // Import your MySQL connection pool

const userRouter = express.Router();

// Create a new user
userRouter.post('/', async (req, res) => {
    const { user_firebase_id, name, pronoun, email, phone_number, profile_img_url } = req.body;

    try {
        const insertQuery = `INSERT INTO User (user_firebase_id, name, pronoun, email, phone_number, profile_img_url) VALUES (?, ?, ?, ?, ?, ?)`;
        const [insertResult] = await pool.execute(insertQuery, [user_firebase_id, name, pronoun, email, phone_number, profile_img_url]);

        res.status(201).json({ message: 'User inserted', user_id: insertResult.insertId });
    } catch (err) {
        res.status(500).json({ message: 'Failed to create user', error: err.message });
    }
});

// Get all users
userRouter.get('/', async (req, res) => {
    try {
        const selectQuery = `SELECT * FROM User`;
        const [rows] = await pool.execute(selectQuery);

        res.status(200).json(rows); // Return the array of all users
    } catch (err) {
        res.status(500).json({ message: 'Failed to retrieve users', error: err.message });
    }
});

// Get a user by user_firebase_id
userRouter.get('/:user_firebase_id', async (req, res) => {
    const { user_firebase_id } = req.params;

    try {
        const selectQuery = `SELECT * FROM User WHERE user_firebase_id = ?`;
        const [rows] = await pool.execute(selectQuery, [user_firebase_id]);

        if (rows.length > 0) {
            res.status(200).json(rows[0]);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Failed to retrieve user', error: err.message });
    }
});



// Update a user
userRouter.post('/update', async (req, res) => {
    const { user_firebase_id, name, pronoun, email, phone_number, profile_img_url } = req.body;

    try {
        const updateQuery = `UPDATE User SET name = ?, pronoun = ?, email = ?, phone_number = ?, profile_img_url = ? WHERE user_firebase_id = ?`;
        const [updateResult] = await pool.execute(updateQuery, [name, pronoun, email, phone_number, profile_img_url, user_firebase_id]);

        if (updateResult.affectedRows > 0) {
            res.status(200).json({ message: 'User updated successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Failed to update user', error: err.message });
    }
});

module.exports = userRouter;
