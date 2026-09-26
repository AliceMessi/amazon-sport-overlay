import React from 'react';
import renderer, { act, type ReactTestRenderer } from 'react-test-renderer';
import LiveSportsScreen from '../src/screens/LiveSportsScreen';
import type { SportMatch } from '../src/domain/matches';

const matches: SportMatch[] = [
  {
    id: 'football-1',
    sport: 'football',
    competition: 'Serie A',
    status: 'live',
    startsAt: '2026-09-25T18:00:00.000Z',
    homeTeam: { name: 'Inter', score: 1 },
    awayTeam: { name: 'Milan', score: 1 },
    period: '67°',
    headline: 'Partita equilibrata nel secondo tempo',
  },
  {
    id: 'basketball-1',
    sport: 'basketball',
    competition: 'LBA',
    status: 'live',
    startsAt: '2026-09-25T18:30:00.000Z',
    homeTeam: { name: 'Olimpia Milano', score: 74 },
    awayTeam: { name: 'Virtus Bologna', score: 69 },
    period: 'Q3 04:12',
    headline: 'Milano recupera due punti',
  },
  {
    id: 'basketball-2',
    sport: 'basketball',
    competition: 'LBA',
    status: 'upcoming',
    startsAt: '2026-09-25T20:00:00.000Z',
    homeTeam: { name: 'Barcellona', score: null },
    awayTeam: { name: 'Baskonia', score: null },
    venue: 'Palau Blaugrana',
  },
];

describe('LiveSportsScreen', () => {
  let screen: ReactTestRenderer | undefined;

  function renderScreen() {
    act(() => {
      screen = renderer.create(<LiveSportsScreen matches={matches} />);
    });
    return screen;
  }

  afterEach(() => {
    if (screen) {
      act(() => screen?.unmount());
      screen = undefined;
    }
  });

  test('filters matches and selects the first visible match', () => {
    const renderedScreen = renderScreen();
    const basketballFilter = renderedScreen.root.findByProps({
      accessibilityLabel: 'Filtra Basket',
    });

    act(() => basketballFilter.props.onPress());

    expect(
      renderedScreen.root.findByProps({ testID: 'match-card-basketball-1' }),
    ).toBeTruthy();
    expect(
      renderedScreen.root.findByProps({ testID: 'selected-match-title' }).props.children,
    ).toBe('Olimpia Milano vs Virtus Bologna');
  });

  test('updates the match panel when a card receives D-pad focus', () => {
    const renderedScreen = renderScreen();
    const secondBasketballCard = renderedScreen.root.findByProps({
      testID: 'match-card-basketball-2',
    });

    act(() => secondBasketballCard.props.onFocus());

    expect(
      renderedScreen.root.findByProps({ testID: 'selected-match-title' }).props.children,
    ).toBe('Barcellona vs Baskonia');
  });

  test('makes every interactive control focusable with a remote', () => {
    const renderedScreen = renderScreen();
    const controls = renderedScreen.root.findAll(
      (node) =>
        node.props.accessibilityRole === 'button' &&
        typeof node.props.onPress === 'function',
    );

    expect(controls.length).toBeGreaterThan(0);
    expect(controls.every((control) => control.props.focusable === true)).toBe(true);
  });
});
