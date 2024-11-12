import {
  fetchPosts,
  fetchPostById,
  fetchPostByUserId,
  createPost,
  updatePost,
  deletePost,
  POSTS_API_URL,
} from '../../utils/interfaces/postInterface';

// Mock the global fetch function
global.fetch = jest.fn();

// Mock console.error to keep test output clean
console.error = jest.fn();

// Sample post data for testing
const mockPost = {
  id: 1,
  title: 'Test Post',
  description: 'Test Description',
  price: 100,
  size: 'M',
  color: 'blue',
  user_firebase_id: 'test123',
};

const mockToken = 'mock-firebase-token';

describe('Post Interface', () => {
  beforeEach(() => {
    // Clear mock data before each test
    fetch.mockClear();
    console.error.mockClear();
  });

  describe('fetchPosts', () => {
    it('should fetch all posts successfully', async () => {
      const mockResponse = [mockPost];
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await fetchPosts(mockToken);
      
      expect(fetch).toHaveBeenCalledWith(
        POSTS_API_URL + '?',
        expect.objectContaining({
          headers: { Authorization: `Bearer ${mockToken}` },
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should include query parameters when provided', async () => {
      const mockResponse = [mockPost];
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await fetchPosts(mockToken, 'searchTerm', 'blue', 'user123', 50, 200, 'M', 'asc');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('search=searchTerm'),
        expect.any(Object)
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('color=blue'),
        expect.any(Object)
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('min_price=50'),
        expect.any(Object)
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('max_price=200'),
        expect.any(Object)
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('size=M'),
        expect.any(Object)
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('sort_price=asc'),
        expect.any(Object)
      );
    });

    it('should handle fetch errors', async () => {
      const errorMessage = 'Network error';
      fetch.mockRejectedValueOnce(new Error(errorMessage));

      await expect(fetchPosts(mockToken)).rejects.toThrow(errorMessage);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('fetchPostById', () => {
    it('should fetch a single post successfully', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPost),
      });

      const result = await fetchPostById(mockToken, 1);

      expect(fetch).toHaveBeenCalledWith(
        `${POSTS_API_URL}/1`,
        expect.objectContaining({
          headers: { Authorization: `Bearer ${mockToken}` },
        })
      );
      expect(result).toEqual(mockPost);
    });
  });

  describe('fetchPostByUserId', () => {
    it('should fetch posts by user ID successfully', async () => {
      const mockResponse = [mockPost];
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await fetchPostByUserId(mockToken, 'user123');

      expect(fetch).toHaveBeenCalledWith(
        `${POSTS_API_URL}/user/user123`,
        expect.objectContaining({
          headers: { Authorization: `Bearer ${mockToken}` },
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('createPost', () => {
    it('should create a post successfully', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPost),
      });

      const result = await createPost(mockToken, mockPost);

      expect(fetch).toHaveBeenCalledWith(
        POSTS_API_URL,
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${mockToken}`,
          },
          body: JSON.stringify(mockPost),
        })
      );
      expect(result).toEqual(mockPost);
    });
  });

  describe('updatePost', () => {
    it('should update a post successfully', async () => {
      const updatedPost = { ...mockPost, title: 'Updated Title' };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(updatedPost),
      });

      const result = await updatePost(mockToken, 1, updatedPost);

      expect(fetch).toHaveBeenCalledWith(
        `${POSTS_API_URL}/1`,
        expect.objectContaining({
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${mockToken}`,
          },
          body: JSON.stringify(updatedPost),
        })
      );
      expect(result).toEqual(updatedPost);
    });
  });

  describe('deletePost', () => {
    it('should delete a post successfully', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      });

      await deletePost(mockToken, 1);

      expect(fetch).toHaveBeenCalledWith(
        `${POSTS_API_URL}/1`,
        expect.objectContaining({
          method: 'DELETE',
          headers: { Authorization: `Bearer ${mockToken}` },
        })
      );
    });
  });

  // Test error handling for HTTP errors
  describe('Error Handling', () => {
    it('should handle HTTP errors properly', async () => {
      const errorMessage = 'Not Found';
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: () => Promise.resolve(errorMessage),
      });

      await expect(fetchPosts(mockToken)).rejects.toThrow(
        `HTTP error! status: 404, message: ${errorMessage}`
      );
    });
  });
});