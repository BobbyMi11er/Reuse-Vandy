const express = require("express");
const pool = require("../connection"); // Import the MySQL connection pool

const likesRouter = express.Router();


likesRouter.get("/by-user/:user_firebase_id", async (req, res) => {
    try {
      const userFirebaseId = req.params.user_firebase_id;
      const [posts] = await pool.execute(
        "SELECT post_id FROM Likes WHERE user_firebase_id = ?",
        [userFirebaseId]
      );
  
      // if (posts.length === 0) {
      //   return res.status(404).json({ message: "No posts found for this user" });
      // }
  
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve likes", error });
    }
  });
  
  likesRouter.get("/by-post/:post_id", async (req, res) => {
    try {
      const [posts] = await pool.execute(
        "SELECT user_firebase_id FROM Likes WHERE post_id = ?",
        [req.params.post_id]
      );
  
      // if (posts.length === 0) {
      //   return res.status(404).json({ message: "No posts found for this user" });
      // }
  
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve likes", error });
    }
  });
  
  likesRouter.post("/", async (req, res) => {
    try {
      const {
        user_firebase_id,
        post_id
      } = req.body;
  
      queryString = "INSERT INTO Likes (user_firebase_id, post_id) VALUES (?, ?);"
  
      const [result] = await pool.execute(queryString, [
        user_firebase_id,
        post_id
      ]);
  
      res.status(201).json({ message: "Like added", post_id: result.insertId });
    } catch (err) {
      res.status(500).json({ message: "Failed to add like", err });
    }
  });
  
  // Delete a post by ID
  likesRouter.delete("/", async (req, res) => {
    try {

        const {
            user_firebase_id,
            post_id
          } = req.body;

      // Check if the post exists
      const [like] = await pool.execute("SELECT * FROM Likes WHERE post_id = ? AND user_firebase_id = ?", [
        post_id, user_firebase_id
      ]);
  
      if (like.length === 0) {
        return res.status(404).json({ message: "Like not found" });
      }
  
      // Mock or temporarily skip authorization check if needed
  
      await pool.execute("DELETE FROM Likes WHERE post_id = ? AND user_firebase_id = ?", [
        post_id, user_firebase_id
      ]);
      res.status(200).json({ message: "Like deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete like", error });
    }
  });

  module.exports = likesRouter;