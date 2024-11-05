import { PostType } from "../models/postModel"; // Assuming Post is imported from another file
import { handleJsonResponse } from "../handleJsonResponse"; // Import the response handler

// Backend URL from the environment variable
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
export const POSTS_API_URL = `${BACKEND_URL}/posts`;

// Function to fetch all posts with optional filters (including price and size) and Firebase authorization token
export const fetchPosts = async (
  token: string,
  search?: string,
  color?: string,
  user_firebase_id?: string,
  min_price?: number,
  max_price?: number,
  size?: string
): Promise<PostType[]> => {
  try {
    // Construct query parameters
    const queryParams = new URLSearchParams();
    if (search) queryParams.append("search", search);
    if (color) queryParams.append("color", color);
    if (user_firebase_id)
      queryParams.append("user_firebase_id", user_firebase_id);
    if (min_price !== undefined)
      queryParams.append("min_price", min_price.toString());
    if (max_price !== undefined)
      queryParams.append("max_price", max_price.toString());
    if (size) queryParams.append("size", size);

    const url = `${POSTS_API_URL}?${queryParams.toString()}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`, // Firebase Authorization token
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Error response:", errorData);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorData}`
      );
    }

    return await handleJsonResponse(response);
  } catch (error: any) {
    console.error("Detailed fetch error:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    throw error;
  }
};

// Function to fetch a single post by ID with Firebase authorization token
export const fetchPostById = async (
  token: string,
  post_id: number
): Promise<PostType> => {
  try {
    const response = await fetch(`${POSTS_API_URL}/${post_id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Firebase Authorization token
      },
    });

    return await handleJsonResponse(response);
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }
};

export const fetchPostByUserId = async (
  token: string,
  user_id: string
): Promise<PostType[]> => {
  try {
    const response = await fetch(`${POSTS_API_URL}/user/${user_id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Firebase Authorization token
      },
    });

    return await handleJsonResponse(response);
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }
};

// Function to create a new post with Firebase authorization token, including price and size
export const createPost = async (
  token: string,
  post: PostType
): Promise<PostType> => {
  try {
    console.log("post", post)
    const response = await fetch(POSTS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Firebase Authorization token
      },
      body: JSON.stringify(post), // Post now includes price and size
    });

    return await handleJsonResponse(response);
  } catch (error) {
    console.error("Error creating post (PostInterface):", error);
    throw error;
  }
};

// Function to update a post by ID with Firebase authorization token, including price and size
export const updatePost = async (
  token: string,
  post_id: number,
  post: PostType
): Promise<PostType> => {
  try {
    const response = await fetch(`${POSTS_API_URL}/${post_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Firebase Authorization token
      },
      body: JSON.stringify(post), // Post now includes price and size
    });

    return await handleJsonResponse(response);
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};

// Function to delete a post by ID with Firebase authorization token
export const deletePost = async (
  token: string,
  post_id: number
): Promise<void> => {
  try {
    const response = await fetch(`${POSTS_API_URL}/${post_id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`, // Firebase Authorization token
      },
    });

    await handleJsonResponse(response);
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};
