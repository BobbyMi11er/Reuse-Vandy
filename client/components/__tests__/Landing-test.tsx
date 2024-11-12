import * as React from 'react';
import renderer from 'react-test-renderer';

import LandingPage from '@/app/(auth)/landing';

it(`renders correctly`, () => {
  const tree = renderer.create(<LandingPage/>).toJSON();

  expect(tree).toMatchSnapshot();
});
