import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ListingForm from '../ListingForm';
import { auth } from '../../firebase';
import { createPost } from '../../utils/interfaces/postInterface';

// Mock the dependencies
jest.mock('../../firebase', () => ({
  auth: {
    currentUser: { getIdToken: jest.fn(), uid: 'user-123' },
  },
}));

jest.mock('../../utils/interfaces/postInterface', () => ({
  createPost: jest.fn(),
}));

describe('ListingForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    auth.currentUser.getIdToken.mockResolvedValue('mock-id-token'); // Mock ID token retrieval
  });

  test('renders all input fields and button', () => {
    const { getByText, getByPlaceholderText } = render(<ListingForm />);

    expect(getByText('Listing Name *')).toBeTruthy();
    expect(getByPlaceholderText('Listing Item')).toBeTruthy();
    expect(getByText('Description')).toBeTruthy();
    expect(getByText('Color')).toBeTruthy();
    expect(getByText('Image URL')).toBeTruthy();
    expect(getByText('Price *')).toBeTruthy();
    expect(getByPlaceholderText('$1')).toBeTruthy();
    expect(getByText('Size')).toBeTruthy();
    expect(getByText('Create Listing')).toBeTruthy();
  });

  test('shows alert when required fields are missing', async () => {
    const { getByText } = render(<ListingForm />);

    // Mock the alert function
    global.alert = jest.fn();

    // Press the submit button without filling required fields
    const submitButton = getByText('Create Listing');
    fireEvent.press(submitButton);

    expect(global.alert).toHaveBeenCalledWith('Please fill out all required fields.');
  });

  test('calls createPost when required fields are filled', async () => {
    const { getByText, getByPlaceholderText } = render(<ListingForm />);

    // Mock the alert and createPost function
    global.alert = jest.fn();
    createPost.mockResolvedValueOnce();

    // Fill in required fields
    fireEvent.changeText(getByPlaceholderText('Listing Item'), 'Test Item');
    fireEvent.changeText(getByPlaceholderText('$1'), '100');

    // Press the submit button
    fireEvent.press(getByText('Create Listing'));

    await waitFor(() => {
      expect(createPost).toHaveBeenCalledWith('mock-id-token', {
        post_id: 0,
        user_firebase_id: 'user-123',
        title: 'Test Item',
        description: '',
        color: '',
        image_url: '',
        price: 100,
        size: '',
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      });
      expect(global.alert).toHaveBeenCalledWith('Listing created successfully!');
    });
  });

  test('shows error alert when createPost fails', async () => {
    const { getByText, getByPlaceholderText } = render(<ListingForm />);

    // Mock the alert and createPost to throw an error
    global.alert = jest.fn();
    createPost.mockRejectedValueOnce(new Error('Failed to create listing'));

    // Fill in required fields
    fireEvent.changeText(getByPlaceholderText('Listing Item'), 'Test Item');
    fireEvent.changeText(getByPlaceholderText('$1'), '100');

    // Press the submit button
    fireEvent.press(getByText('Create Listing'));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Failed to create listing. Please try again.');
    });
  });
});
