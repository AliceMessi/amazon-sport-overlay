import React from 'react';
import renderer, { act, type ReactTestRenderer } from 'react-test-renderer';
import type { SportMatch } from '../src/domain/matches';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { default: MatchOverlayScreen } = require('../src/screens/MatchOverlayScreen');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { youtubeEmbedUrl, demoSourceForSport } = require('../src/screens/videoSource');

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

describe('MatchOverlayScreen', () => {
  let screen: ReactTestRenderer | undefined;

  afterEach(() => {
    if (screen) {
      act(() => screen?.unmount());
      screen = undefined;
    }
  });

  test('plays the minor-match mp4 by default with score bug overlay', () => {
    act(() => {
      screen = renderer.create(
        <MatchOverlayScreen match={match} onBack={() => undefined} />,
      );
    });
    const video = screen.root.findByProps({ testID: 'mock-video-view' });
    expect(video).toBeTruthy();
    expect(() =>
      screen.root.findByProps({ testID: 'youtube-webview' }),
    ).toThrow();
    expect(
      screen.root.findByProps({ testID: 'overlay-score-bug' }),
    ).toBeTruthy();
    expect(
      screen.root.findByProps({ testID: 'overlay-headline' }).props.children,
    ).toBe('Partita equilibrata nel secondo tempo');
  });

  test('maps each sport to its own minor-match clip', () => {
    expect(demoSourceForSport('football').uri).toContain('Latvia-Gibraltar');
    expect(demoSourceForSport('basketball').uri).toContain('Nabua');
    expect(demoSourceForSport('formula1').uri).toContain('Cook_Forest');
  });

  test('builds an autoplay embed URL without player chrome', () => {
    const url = youtubeEmbedUrl('0rOAweY4dFQ');
    expect(url).toBe(
      'https://www.youtube.com/embed/0rOAweY4dFQ?autoplay=1&controls=0&rel=0&modestbranding=1&playsinline=1',
    );
  });

  test('supports an mp4 source as fallback', () => {
    act(() => {
      screen = renderer.create(
        <MatchOverlayScreen
          match={match}
          source={{ type: 'mp4', uri: 'https://example.com/m.mp4' }}
          onBack={() => undefined}
        />,
      );
    });
    expect(screen.root.findByProps({ testID: 'mock-video-view' })).toBeTruthy();
  });

  test('toggle hides and shows the overlay info', () => {
    act(() => {
      screen = renderer.create(
        <MatchOverlayScreen match={match} onBack={() => undefined} />,
      );
    });
    const toggle = screen.root.findByProps({ testID: 'overlay-toggle' });

    act(() => toggle.props.onPress());
    expect(() =>
      screen.root.findByProps({ testID: 'overlay-score-bug' }),
    ).toThrow();

    act(() => toggle.props.onPress());
    expect(
      screen.root.findByProps({ testID: 'overlay-score-bug' }),
    ).toBeTruthy();
  });

  test('back button calls onBack', () => {
    const onBack = jest.fn();
    act(() => {
      screen = renderer.create(
        <MatchOverlayScreen match={match} onBack={onBack} />,
      );
    });
    act(() => screen.root.findByProps({ testID: 'overlay-back' }).props.onPress());
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
