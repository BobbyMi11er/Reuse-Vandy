import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LandingPage from '../LandingPage';
import { useRouter } from 'expo-router';

// Mock the `useRouter` hook
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

describe('LandingPage', () => {
  const mockNavigate = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    // Mock navigate and push functions
    useRouter.mockReturnValue({
      navigate: mockNavigate,
      push: mockPush,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly with title, button, and footer text', () => {
    const { getByText } = render(<LandingPage />);

    expect(getByText('Reuse Vandy')).toBeTruthy();
    expect(getByText('Sign in')).toBeTruthy();
    expect(getByText("Don't have an account?")).toBeTruthy();
    expect(getByText('Sign up')).toBeTruthy();
    expect(getByText('Copyright © SWE Group 15 All Rights Reserved')).toBeTruthy();
  });

  test('navigates to login page when "Sign in" button is pressed', () => {
    const { getByText } = render(<LandingPage />);

    const signInButton = getByText('Sign in');
    fireEvent.press(signInButton);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('navigates to register page when "Sign up" text is pressed', () => {
    const { getByText } = render(<LandingPage />);

    const signUpText = getByText('Sign up');
    fireEvent.press(signUpText);

    expect(mockPush).toHaveBeenCalledWith('/register');
  });
});
