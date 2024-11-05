import { UserType } from "../models/userModel"; // Assuming Post is imported from another file
import { handleJsonResponse } from "../handleJsonResponse"; // Import the response handler

// Backend URL from the environment variable
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
export const USERS_API_URL = `${BACKEND_URL}/users`;

// Function to create a new post with Firebase authorization token, including price and size
export const createUser = async (
  token: string,
  user: UserType
): Promise<UserType> => {
  try {
    const response = await fetch(USERS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Firebase Authorization token
      },
      body: JSON.stringify(user), // user
    });

    console.log("Response Status:", response.status);
    console.log("Response Headers:", response.headers);
    // console.log("Response Body:", await response.text());

    if (!response.ok) {
      throw new Error(
        `Failed to create user: ${response.status} ${response.statusText}`
      );
    }

    return await handleJsonResponse(response);
  } catch (error: any) {
    console.error("Error creating user:", error.message);
    throw error;
  }
};

export const updateUser = async (
  token: string,
  user_id: string,
  user: UserType
): Promise<UserType> => {
  try {
    const response = await fetch(`${USERS_API_URL}/update/${user_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Firebase Authorization token
      },
      body: JSON.stringify(user), // Post now includes price and size
    });

    return await handleJsonResponse(response);
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

export const getUserById = async (
  token: string,
  user_id: string
): Promise<UserType> => {
  try {
    const response = await fetch(`${USERS_API_URL}/${user_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Firebase Authorization token
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to get user: ${response.status} ${response.statusText}`
      );
    }

    return await handleJsonResponse(response);
  } catch (error: any) {
    console.error("Error getting user:", error.message);
    throw error;
  }
};

export const deleteUserById = async (
  token: string,
  user_id: string
): Promise<UserType> => {
  try {
    const response = await fetch(`${USERS_API_URL}/${user_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Firebase Authorization token
      },
    });

    return await handleJsonResponse(response);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
