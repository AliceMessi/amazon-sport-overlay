import React from 'react';
import renderer, { act, type ReactTestRenderer } from 'react-test-renderer';
import type { SportMatch } from '../src/domain/matches';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const MatchOverlayScreenWeb = require('../src/screens/MatchOverlayScreen.web').default;

const match: SportMatch = {
  id: 'promozione-lambrate-corsico',
  sport: 'football',
  competition: 'Promozione Lombardia',
  status: 'live',
  startsAt: '2026-09-25T18:00:00.000Z',
  homeTeam: { name: 'Polisportiva Lambrate', score: 1 },
  awayTeam: { name: 'ASD Corsico', score: 1 },
  period: '67°',
  venue: 'Comunale Lambrate',
  headline: 'Partita equilibrata nel secondo tempo',
};

describe('MatchOverlayScreen.web', () => {
  let screen: ReactTestRenderer | undefined;

  afterEach(() => {
    if (screen) {
      act(() => screen?.unmount());
      screen = undefined;
    }
  });

  test('plays mp4 in a fullscreen video tag with score bug on top', () => {
    act(() => {
      screen = renderer.create(
        <MatchOverlayScreenWeb match={match} onBack={() => undefined} />,
      );
    });
    const video = screen.root.findByProps({ testID: 'mp4-video' });
    expect(video).toBeTruthy();
    expect(
      screen.root.findByProps({ testID: 'overlay-score-bug' }),
    ).toBeTruthy();
  });

  test('back button calls onBack', () => {
    const onBack = jest.fn();
    act(() => {
      screen = renderer.create(
        <MatchOverlayScreenWeb match={match} onBack={onBack} />,
      );
    });
    act(() => screen.root.findByProps({ testID: 'overlay-back' }).props.onPress());
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
