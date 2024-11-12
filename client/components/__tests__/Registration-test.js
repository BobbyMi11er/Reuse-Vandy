import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import RegistrationPage from '../../app/(auth)/register';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  auth: {},
}));

jest.mock('../../firebase', () => ({
  auth: {},
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
}));

describe('RegistrationPage', () => {
  const mockRouterReplace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({ navigate: mockRouterReplace });
  });

  test('renders registration form elements', () => {
    const { getByText, getByPlaceholderText } = render(<RegistrationPage />);

    expect(getByText('Create New Account')).toBeTruthy();
    expect(getByText('Welcome to Reuse Vandy!')).toBeTruthy();
    expect(getByPlaceholderText('Jiara Martins')).toBeTruthy();
    expect(getByPlaceholderText('hello@reallygreatsite.com')).toBeTruthy();
    expect(getByPlaceholderText('123-456-7890')).toBeTruthy();
    expect(getByPlaceholderText('********')).toBeTruthy();
    expect(getByText('Sign up')).toBeTruthy();
  });

  test('shows alert when fields are empty', async () => {
    const { getByText } = render(<RegistrationPage />);

    // Mock the alert function
    global.alert = jest.fn();

    const signUpButton = getByText('Sign up');
    fireEvent.press(signUpButton);

    expect(global.alert).toHaveBeenCalledWith('Please fill out all fields.');
  });

  test('calls createUserWithEmailAndPassword with correct values', async () => {
    const { getByText, getByPlaceholderText } = render(<RegistrationPage />);

    // Mock successful Firebase response
    createUserWithEmailAndPassword.mockResolvedValueOnce({
      user: { uid: 'mockedUid' },
    });

    fireEvent.changeText(getByPlaceholderText('Jiara Martins'), 'John Doe');
    fireEvent.changeText(getByPlaceholderText('hello@reallygreatsite.com'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('123-456-7890'), '123-456-7890');
    fireEvent.changeText(getByPlaceholderText('********'), 'password123');
    
    fireEvent.press(getByText('Sign up'));

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'password123');
      expect(mockRouterReplace).toHaveBeenCalledWith('/login');
    });
  });

  test('shows error message when registration fails', async () => {
    const { getByText, getByPlaceholderText } = render(<RegistrationPage />);

    // Mock failed Firebase response
    createUserWithEmailAndPassword.mockRejectedValueOnce(new Error('Registration failed'));

    fireEvent.changeText(getByPlaceholderText('Jiara Martins'), 'John Doe');
    fireEvent.changeText(getByPlaceholderText('hello@reallygreatsite.com'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('123-456-7890'), '123-456-7890');
    fireEvent.changeText(getByPlaceholderText('********'), 'password123');
    
    fireEvent.press(getByText('Sign up'));

    await waitFor(() => {
      expect(getByText('Registration failed')).toBeTruthy();
    });
  });
});