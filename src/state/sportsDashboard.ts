import type { SportFilter, SportMatch } from '../domain/matches';

export type DashboardState = {
  sport: SportFilter;
  selectedMatchId: string | null;
};

export type DashboardAction =
  | { type: 'sportSelected'; sport: SportFilter }
  | { type: 'matchSelected'; matchId: string }
  | { type: 'selectionMoved'; direction: -1 | 1 };

export function filterMatches(
  matches: readonly SportMatch[],
  sport: SportFilter,
): readonly SportMatch[] {
  return sport === 'all'
    ? matches
    : matches.filter((match) => match.sport === sport);
}

export function createDashboardState(
  matches: readonly SportMatch[],
): DashboardState {
  return {
    sport: 'all',
    selectedMatchId: matches[0]?.id ?? null,
  };
}

export function dashboardReducer(
  state: DashboardState,
  action: DashboardAction,
  matches: readonly SportMatch[],
): DashboardState {
  if (action.type === 'sportSelected') {
    const firstMatch = filterMatches(matches, action.sport)[0];
    return {
      sport: action.sport,
      selectedMatchId: firstMatch?.id ?? null,
    };
  }

  const visibleMatches = filterMatches(matches, state.sport);
  if (action.type === 'matchSelected') {
    const isVisible = visibleMatches.some((match) => match.id === action.matchId);
    return isVisible ? { ...state, selectedMatchId: action.matchId } : state;
  }

  if (visibleMatches.length === 0) {
    return state;
  }

  const currentIndex = visibleMatches.findIndex(
    (match) => match.id === state.selectedMatchId,
  );
  const nextIndex =
    (Math.max(currentIndex, 0) + action.direction + visibleMatches.length) %
    visibleMatches.length;

  return {
    ...state,
    selectedMatchId: visibleMatches[nextIndex].id,
  };
}
