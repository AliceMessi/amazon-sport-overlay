export const sports = ['football', 'basketball', 'formula1'] as const;

export type Sport = (typeof sports)[number];
export type SportFilter = 'all' | Sport;
export type MatchStatus = 'live' | 'upcoming' | 'finished';

export type Team = {
  name: string;
  score: number | null;
};

export type SportMatch = {
  id: string;
  sport: Sport;
  competition: string;
  status: MatchStatus;
  startsAt: string;
  homeTeam: Team;
  awayTeam: Team;
  venue?: string;
  headline?: string;
  period?: string;
};
