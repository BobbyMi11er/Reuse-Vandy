const express = require("express");
const pool = require("../connection"); // Import the MySQL connection pool

const postRouter = express.Router();

// Create a new post
postRouter.post("/", async (req, res) => {
  const {
    user_firebase_id,
    title,
    description,
    color,
    image_url,
    price,
    size,
  } = req.body;

  try {
    const queryString = `INSERT INTO Post (user_firebase_id, title, description, color, image_url, price, size) 
                             VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const [result] = await pool.execute(queryString, [
      user_firebase_id,
      title,
      description,
      color,
      image_url,
      price,
      size,
    ]);

    res.status(201).json({ message: "Post created", post_id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: "Failed to create post", err });
  }
});

// Get all posts with optional search, filter by color, filter by user, and include price and size
postRouter.get("/", async (req, res) => {
  const { search, color, user_firebase_id, min_price, max_price, size } =
    req.query;
  try {
    let query = "SELECT * FROM Post WHERE 1=1 ORDER BY created_at DESC"; // Base query
    const queryParams = [];

    if (search) {
      query += " AND title LIKE ?";
      queryParams.push(`%${search}%`);
    }

    if (color) {
      query += " AND color = ?";
      queryParams.push(color);
    }

    if (user_firebase_id) {
      query += " AND user_firebase_id = ?";
      queryParams.push(user_firebase_id);
    }

    if (min_price) {
      query += " AND price >= ?";
      queryParams.push(min_price);
    }

    if (max_price) {
      query += " AND price <= ?";
      queryParams.push(max_price);
    }

    if (size) {
      query += " AND size = ?";
      queryParams.push(size);
    }

    const [posts] = await pool.execute(query, queryParams);
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve posts", error });
  }
});

// Get a single post by ID
postRouter.get("/:post_id", async (req, res) => {
  try {
    const [post] = await pool.execute("SELECT * FROM Post WHERE post_id = ?", [
      req.params.post_id,
    ]);

    if (post.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post[0]);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve post", error });
  }
});

postRouter.get("/user/:user_firebase_id", async (req, res) => {
  try {
    const userFirebaseId = req.params.user_firebase_id;
    const [posts] = await pool.execute(
      "SELECT * FROM Post WHERE user_firebase_id = ?",
      [userFirebaseId]
    );

    // if (posts.length === 0) {
    //   return res.status(404).json({ message: "No posts found for this user" });
    // }

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve posts", error });
  }
});

// Update a post by ID, including price and size fields
postRouter.put("/:post_id", async (req, res) => {
  const { title, description, color, image_url, price, size } = req.body;
  try {
    // Check if the post exists
    const [post] = await pool.execute("SELECT * FROM Post WHERE post_id = ?", [
      req.params.post_id,
    ]);

    if (post.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }

    const [updatedPost] = await pool.execute(
      "UPDATE Post SET title = ?, description = ?, color = ?, image_url = ?, price = ?, size = ? WHERE post_id = ?",
      [title, description, color, image_url, price, size, req.params.post_id]
    );
    res.status(200).json({ message: "Post updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update post", error });
  }
});

// Delete a post by ID
postRouter.delete("/:post_id", async (req, res) => {
  try {
    // Check if the post exists
    const [post] = await pool.execute("SELECT * FROM Post WHERE post_id = ?", [
      req.params.post_id,
    ]);

    if (post.length === 0) {
      print("HERE");
      return res.status(404).json({ message: "Post not found" });
    }

    // Mock or temporarily skip authorization check if needed

    await pool.execute("DELETE FROM Post WHERE post_id = ?", [
      req.params.post_id,
    ]);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete post", error });
  }
});

module.exports = postRouter;
