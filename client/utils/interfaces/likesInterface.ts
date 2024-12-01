// Assuming LikeType is imported from a models file
import { LikeType } from "../models/likeModel"; // Define LikeType to match the Like object structure
import { handleJsonResponse } from "../handleJsonResponse"; // Import the response handler

// Backend URL from the environment variable
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
export const LIKES_API_URL = `${BACKEND_URL}/likes`;

// Function to get posts liked by a specific user
export const getLikesByUser = async (
  token: string,
  userFirebaseId: string
): Promise<LikeType[]> => {
  try {
    const response = await fetch(`${LIKES_API_URL}/by-user/${userFirebaseId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Firebase Authorization token
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to retrieve likes: ${response.status} ${response.statusText}`
      );
    }

    return await handleJsonResponse(response);
  } catch (error: any) {
    console.error("Error fetching likes by user:", error.message);
    throw error;
  }
};

// Function to get users who liked a specific post
export const getLikesByPost = async (
  token: string,
  postId: number
): Promise<LikeType[]> => {
  try {
    const response = await fetch(`${LIKES_API_URL}/by-post/${postId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Firebase Authorization token
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to retrieve likes: ${response.status} ${response.statusText}`
      );
    }

    return await handleJsonResponse(response);
  } catch (error: any) {
    console.error("Error fetching likes by post:", error.message);
    throw error;
  }
};

// Function to add a like
export const addLike = async (
  token: string,
  like: LikeType
): Promise<{ message: string; post_id: number }> => {
  try {
    const response = await fetch(LIKES_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Firebase Authorization token
      },
      body: JSON.stringify(like), // Like object
    });

    if (!response.ok) {
      throw new Error(
        `Failed to add like: ${response.status} ${response.statusText}`
      );
    }

    return await handleJsonResponse(response);
  } catch (error: any) {
    console.error("Error adding like:", error.message);
    throw error;
  }
};

// Function to delete a like
export const deleteLike = async (
  token: string,
  like: LikeType
): Promise<{ message: string }> => {
  try {
    const response = await fetch(LIKES_API_URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Firebase Authorization token
      },
      body: JSON.stringify(like), // Like object
    });

    if (!response.ok) {
      throw new Error(
        `Failed to delete like: ${response.status} ${response.statusText}`
      );
    }

    return await handleJsonResponse(response);
  } catch (error: any) {
    console.error("Error deleting like:", error.message);
    throw error;
  }
};
