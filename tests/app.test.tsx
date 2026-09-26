import React from 'react';
import renderer, { act, type ReactTestRenderer } from 'react-test-renderer';
import App from '../App';

describe('App', () => {
  let screen: ReactTestRenderer | undefined;

  beforeEach(() => {
    act(() => {
      screen = renderer.create(<App />);
    });
  });

  afterEach(() => {
    if (screen) {
      act(() => screen?.unmount());
      screen = undefined;
    }
  });

  test('opens the multi-sport companion with the first live match', () => {
    expect(screen?.root.findByProps({ testID: 'selected-match-title' }).props.children).toBe(
      'Inter vs Milan',
    );
  });
});
