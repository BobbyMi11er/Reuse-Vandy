import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginPage from '../../app/(auth)/login';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
}));

jest.mock('../../firebase', () => ({
  auth: {},
}));

describe('LoginPage', () => {
  const mockRouterReplace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({ replace: mockRouterReplace });
  });

  test('renders login screen elements', () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(<LoginPage />);

    expect(getByTestId('login-text')).toBeTruthy();
    expect(getByText('Welcome back to Reuse Vandy!')).toBeTruthy();
    expect(getByPlaceholderText('hello@reallygreatsite.com')).toBeTruthy();
    expect(getByPlaceholderText('********')).toBeTruthy();
    expect(getByTestId('login-button')).toBeTruthy();
  });

  test('shows alert when fields are empty', async () => {
    const { getByText, getByTestId } = render(<LoginPage />);

    // Mock the alert function
    global.alert = jest.fn();

    const loginButton = getByTestId('login-button');
    fireEvent.press(loginButton);

    expect(global.alert).toHaveBeenCalledWith('Please fill out all fields.');
  });

  // test('calls signInWithEmailAndPassword with correct arguments', async () => {
  //   const { getByText, getByPlaceholderText, getByTestId } = render(<LoginPage />);

  //   // Set up a resolved promise for successful login
  //   signInWithEmailAndPassword.mockResolvedValueOnce();

  //   fireEvent.changeText(getByPlaceholderText('hello@reallygreatsite.com'), 'test@example.com');
  //   fireEvent.changeText(getByPlaceholderText('********'), 'password123');
    
  //   fireEvent.press(getByTestId('login-button'));

  //   await waitFor(() => {
  //     expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'password123');
  //     expect(mockRouterReplace).toHaveBeenCalledWith('/(tabs)/home');
  //   });
  // });

  test('shows error message when login fails', async () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(<LoginPage />);

    // Set up a rejected promise to simulate login failure
    signInWithEmailAndPassword.mockRejectedValueOnce(new Error('Login failed'));

    fireEvent.changeText(getByPlaceholderText('hello@reallygreatsite.com'), 'wrong@example.com');
    fireEvent.changeText(getByPlaceholderText('********'), 'wrongpassword');
    
    fireEvent.press(getByTestId('login-button'));

    await waitFor(() => {
      expect(getByText('Login failed')).toBeTruthy();
    });
  });
});