import type { SportMatch } from '../src/domain/matches';
import {
  createDashboardState,
  dashboardReducer,
  filterMatches,
} from '../src/state/sportsDashboard';

const matches: SportMatch[] = [
  {
    id: 'football-1',
    sport: 'football',
    competition: 'Serie A',
    status: 'live',
    startsAt: '2026-09-25T18:00:00.000Z',
    homeTeam: { name: 'Inter', score: 1 },
    awayTeam: { name: 'Milan', score: 1 },
  },
  {
    id: 'basketball-1',
    sport: 'basketball',
    competition: 'LBA',
    status: 'live',
    startsAt: '2026-09-25T18:30:00.000Z',
    homeTeam: { name: 'Olimpia Milano', score: 74 },
    awayTeam: { name: 'Virtus Bologna', score: 69 },
  },
  {
    id: 'basketball-2',
    sport: 'basketball',
    competition: 'LBA',
    status: 'upcoming',
    startsAt: '2026-09-25T20:00:00.000Z',
    homeTeam: { name: 'Barcellona', score: null },
    awayTeam: { name: 'Baskonia', score: null },
  },
];

describe('filterMatches', () => {
  test('returns only matches from the selected sport', () => {
    expect(filterMatches(matches, 'basketball').map((match) => match.id)).toEqual([
      'basketball-1',
      'basketball-2',
    ]);
  });

  test('returns every match for the all filter', () => {
    expect(filterMatches(matches, 'all')).toHaveLength(3);
  });
});

describe('dashboardReducer', () => {
  test('selects the first match when the sport filter changes', () => {
    const state = dashboardReducer(
      createDashboardState(matches),
      { type: 'sportSelected', sport: 'basketball' },
      matches,
    );

    expect(state).toEqual({
      sport: 'basketball',
      selectedMatchId: 'basketball-1',
    });
  });

  test('moves the selection within the filtered matches and wraps around', () => {
    const basketballState = {
      sport: 'basketball' as const,
      selectedMatchId: 'basketball-2',
    };

    const state = dashboardReducer(
      basketballState,
      { type: 'selectionMoved', direction: 1 },
      matches,
    );

    expect(state.selectedMatchId).toBe('basketball-1');
  });

  test('keeps an empty dashboard safe', () => {
    const state = dashboardReducer(
      { sport: 'all', selectedMatchId: null },
      { type: 'selectionMoved', direction: -1 },
      [],
    );

    expect(state.selectedMatchId).toBeNull();
  });
});
