const express = require("express");
const pool = require("../connection"); // Import the MySQL connection pool

const userRouter = express.Router();

// Create a new post
userRouter.get("/", async (req, res) => {
  try {
    // Select all users from the User table
    const selectQuery = `SELECT * FROM User`;
    const [users] = await pool.execute(selectQuery);

    // Send response with all users
    res.status(200).json(users);
  } catch (err) {
    // Handle errors
    res.status(500).json({ message: "Failed to retrieve users", err });
  }
});

userRouter.post("/", async (req, res) => {
  const {
    user_firebase_id,
    name,
    pronouns,
    email,
    phone_number,
    profile_img_url,
  } = req.body;

  // console.log("Request Body:", req.body);

  try {
    const insertQuery = `INSERT INTO User (
      user_firebase_id,
      email,
      name,
      phone_number,
      pronouns,
      profile_img_url
    ) VALUES (?, ?, ?, ?, ?, ?)`;
    const [insertResult] = await pool.execute(insertQuery, [
      user_firebase_id,
      email,
      name,
      phone_number,
      pronouns,
      profile_img_url,
    ]);

    res.status(201).json({
      message: "User inserted with ID:",
      user_firebase_id: insertResult.insertId,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create user", err });
  }
});

// Update user by ID
userRouter.post("/update/:id", async (req, res) => {
  const userId = req.params.id;
  const { name, pronouns, email, phone_number, profile_img_url } = req.body;

  try {
    // Update query instead of insert
    const updateQuery = `
      UPDATE User 
      SET 
        name = ?,
        pronouns = ?,
        email = ?,
        phone_number = ?,
        profile_img_url = ?
      WHERE user_firebase_id = ?
    `;

    const [result] = await pool.execute(updateQuery, [
      name,
      pronouns,
      email,
      phone_number,
      profile_img_url || null, // Handle null case for profile image
      userId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Return the updated user data
    const [updatedUser] = await pool.execute(
      "SELECT * FROM User WHERE user_firebase_id = ?",
      [userId]
    );

    res.status(200).json(updatedUser[0]);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({
      message: "Failed to update user",
      error: err.message,
    });
  }
});

// Retrieve a user by ID
userRouter.get("/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const selectQuery = `SELECT * FROM User WHERE user_firebase_id = ?`;
    const [user] = await pool.execute(selectQuery, [userId]);

    if (!user || user.length === 0) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(200).json(user[0]);
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve user", err });
  }
});

// Delete user by ID
userRouter.delete("/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const deleteQuery = `DELETE FROM User WHERE user_firebase_id = ?`;
    await pool.execute(deleteQuery, [userId]);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user", err });
  }
});

module.exports = userRouter;
