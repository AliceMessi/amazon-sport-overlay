import React from 'react';
import renderer, { act, type ReactTestRenderer } from 'react-test-renderer';
import type { SportMatch } from '../src/domain/matches';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const MatchOverlayScreenWeb = require('../src/screens/MatchOverlayScreen.web').default;

const match: SportMatch = {
  id: 'serie-a-inter-milan',
  sport: 'football',
  competition: 'Serie A',
  status: 'live',
  startsAt: '2026-09-25T18:00:00.000Z',
  homeTeam: { name: 'Inter', score: 1 },
  awayTeam: { name: 'Milan', score: 1 },
  period: '67°',
  venue: 'San Siro',
  headline: 'Derby della Madonnina',
};

describe('MatchOverlayScreen.web', () => {
  let screen: ReactTestRenderer | undefined;

  afterEach(() => {
    if (screen) {
      act(() => screen?.unmount());
      screen = undefined;
    }
  });

  test('embeds YouTube in a fullscreen iframe with score bug on top', () => {
    act(() => {
      screen = renderer.create(
        <MatchOverlayScreenWeb match={match} onBack={() => undefined} />,
      );
    });
    const iframe = screen.root.findByProps({ testID: 'youtube-iframe' });
    expect(iframe.props.src).toContain('youtube.com/embed/0rOAweY4dFQ');
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
