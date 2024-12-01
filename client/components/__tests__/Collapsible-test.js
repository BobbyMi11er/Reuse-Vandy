import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Collapsible } from '../Collapsible';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';

jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => 'IoniconsMock',
}));

describe('Collapsible Component', () => {
  test('renders with title and children', () => {
    const { getByText } = render(
      <Collapsible title="Sample Title">
        <ThemedText>Sample Content</ThemedText>
      </Collapsible>
    );

    // Verify title renders
    expect(getByText('Sample Title')).toBeTruthy();
    // Verify children content does not render initially
    expect(() => getByText('Sample Content')).toThrow();
  });

  test('toggles content visibility on press', () => {
    const { getByText, queryByText } = render(
      <Collapsible title="Sample Title">
        <ThemedText>Sample Content</ThemedText>
      </Collapsible>
    );

    const titleElement = getByText('Sample Title');
    fireEvent.press(titleElement);

    // Verify children content appears after pressing
    expect(getByText('Sample Content')).toBeTruthy();

    // Press again to collapse
    fireEvent.press(titleElement);
    expect(queryByText('Sample Content')).toBeNull();
  });


  test('displays the correct icon based on isOpen state', () => {
    const { getByText, getByTestId } = render(<Collapsible></Collapsible>);

    // Initially, the icon should be 'chevron-forward-outline' when closed
    expect(getByTestId('icon').props.name).toBe('chevron-forward-outline');

    // Simulate opening by pressing the title
    fireEvent.press(getByText('Sample Title'));

    // After pressing, the icon should change to 'chevron-down' indicating the component is open
    expect(getByTestId('icon').props.name).toBe('chevron-down');

    // Simulate closing by pressing the title again
    fireEvent.press(getByText('Sample Title'));

    // After pressing again, the icon should return to 'chevron-forward-outline'
    expect(getByTestId('icon').props.name).toBe('chevron-forward-outline');
  });

});