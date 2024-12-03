import {
  getLikesByUser,
  getLikesByPost,
  addLike,
  deleteLike,
  LIKES_API_URL,
} from "../../utils/interfaces/likesInterface";
import { handleJsonResponse } from "../../utils/handleJsonResponse";
import { LikeType } from "../../utils/models/likeModel";

jest.mock("../../utils/handleJsonResponse", () => ({
  handleJsonResponse: jest.fn(),
}));

global.fetch = jest.fn();

describe("Likes API functions", () => {
  const token = "mock-token";
  const userFirebaseId = "mock-user-id";
  const postId = 1;
  const like: LikeType = {
    post_id: postId,
    user_firebase_id: userFirebaseId,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getLikesByUser", () => {
    it("should fetch likes by user successfully", async () => {
      const mockLikes = [like];
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockLikes),
      });
      (handleJsonResponse as jest.Mock).mockResolvedValue(mockLikes);

      const result = await getLikesByUser(token, userFirebaseId);
      expect(fetch).toHaveBeenCalledWith(
        `${LIKES_API_URL}/by-user/${userFirebaseId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      expect(handleJsonResponse).toHaveBeenCalled();
      expect(result).toEqual(mockLikes);
    });

    it("should throw an error if fetch fails", async () => {
      const errorMessage = "Failed to retrieve likes: 404 Not Found";
      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "Not Found",
      });

      await expect(getLikesByUser(token, userFirebaseId)).rejects.toThrow(
        errorMessage
      );
      expect(fetch).toHaveBeenCalledWith(
        `${LIKES_API_URL}/by-user/${userFirebaseId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    });
  });

  describe("getLikesByPost", () => {
    it("should fetch likes by post successfully", async () => {
      const mockLikes = [like];
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockLikes),
      });
      (handleJsonResponse as jest.Mock).mockResolvedValue(mockLikes);

      const result = await getLikesByPost(token, postId);
      expect(fetch).toHaveBeenCalledWith(`${LIKES_API_URL}/by-post/${postId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      expect(handleJsonResponse).toHaveBeenCalled();
      expect(result).toEqual(mockLikes);
    });

    it("should throw an error if fetch fails", async () => {
      const errorMessage = "Failed to retrieve likes: 404 Not Found";
      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "Not Found",
      });

      await expect(getLikesByPost(token, postId)).rejects.toThrow(errorMessage);
      expect(fetch).toHaveBeenCalledWith(`${LIKES_API_URL}/by-post/${postId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    });
  });

  describe("addLike", () => {
    it("should add a like successfully", async () => {
      const mockResponse = { message: "Like added", post_id: 1 };
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
      });
      (handleJsonResponse as jest.Mock).mockResolvedValue(mockResponse);

      const result = await addLike(token, like);
      expect(fetch).toHaveBeenCalledWith(LIKES_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(like),
      });
      expect(handleJsonResponse).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });

    it("should throw an error if fetch fails", async () => {
      const errorMessage = "Failed to add like: 404 Not Found";
      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "Not Found",
      });

      await expect(addLike(token, like)).rejects.toThrow(errorMessage);
      expect(fetch).toHaveBeenCalledWith(LIKES_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(like),
      });
      expect(handleJsonResponse).not.toHaveBeenCalled();
    });

    it("should throw an error if handleJsonResponse fails", async () => {
      const mockError = new Error("Failed to parse JSON");
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({}),
      });
      (handleJsonResponse as jest.Mock).mockRejectedValue(mockError);

      await expect(addLike(token, like)).rejects.toThrow(mockError);
      expect(fetch).toHaveBeenCalledWith(LIKES_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(like),
      });
      expect(handleJsonResponse).toHaveBeenCalled();
    });
  });

  describe("deleteLike", () => {
    it("should delete a like successfully", async () => {
      const mockResponse = { message: "Like deleted" };
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
      });
      (handleJsonResponse as jest.Mock).mockResolvedValue(mockResponse);

      const result = await deleteLike(token, like);
      expect(fetch).toHaveBeenCalledWith(LIKES_API_URL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(like),
      });
      expect(handleJsonResponse).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });

    it("should throw an error if fetch fails", async () => {
      const errorMessage = "Failed to delete like: 404 Not Found";
      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "Not Found",
      });

      await expect(deleteLike(token, like)).rejects.toThrow(errorMessage);
      expect(fetch).toHaveBeenCalledWith(LIKES_API_URL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(like),
      });
      expect(handleJsonResponse).not.toHaveBeenCalled();
    });

    it("should throw an error if handleJsonResponse fails", async () => {
      const mockError = new Error("Failed to parse JSON");
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({}),
      });
      (handleJsonResponse as jest.Mock).mockRejectedValue(mockError);

      await expect(deleteLike(token, like)).rejects.toThrow(mockError);
      expect(fetch).toHaveBeenCalledWith(LIKES_API_URL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(like),
      });
      expect(handleJsonResponse).toHaveBeenCalled();
    });
  });
});
