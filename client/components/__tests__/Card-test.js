import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Card from '../Card';
import { Ionicons } from '@expo/vector-icons';

jest.mock('../../firebase', () => ({
  auth: {},
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => 'IoniconsMock',
}));

describe('Card Component', () => {
  const mockProps = {
    post_id: 1,
    title: 'Sample Item',
    price: 50,
    size: 'M',
    image_url: 'sample_image_url',
    created_at: new Date(),
    user_firebase_id: 'user_123',
  };

  test('renders correctly with given props', () => {
    const { getByText, getByTestId } = render(<Card {...mockProps} />);
    
    expect(getByText('Sample Item')).toBeTruthy();
    expect(getByText('$50')).toBeTruthy();
    expect(getByTestId('heart-icon')).toBeTruthy();
  });

  test('renders the image', () => {
    const { getByTestId } = render(<Card {...mockProps} />);
    const image = getByTestId('image');
    
    expect(image).toBeTruthy(); 
    expect(image.props.source.uri).toEqual("https://reuse-vandy.s3.us-east-2.amazonaws.com/adaptive-icon.png");
  });

  test('handles heart icon press', () => {
    const { getByTestId } = render(<Card {...mockProps} />);
    
    const heartIcon = getByTestId('heart-icon');
    fireEvent.press(heartIcon);
    
    // Check if the heart icon is pressed (though no action occurs here)
    expect(heartIcon).toBeTruthy();
  });
});