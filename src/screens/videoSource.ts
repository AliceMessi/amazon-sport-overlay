import type { SportMatch } from '../domain/matches';

export const DEMO_VIDEO_URI =
  'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

// Derby highlights (Serie A official channel). Swap with any YouTube video ID.
export const YOUTUBE_DEMO_ID = '0rOAweY4dFQ';

export type VideoSource =
  | { type: 'mp4'; uri: string }
  | { type: 'youtube'; videoId: string };

export function youtubeEmbedUrl(videoId: string): string {
  return (
    `https://www.youtube.com/embed/${videoId}` +
    '?autoplay=1&controls=0&rel=0&modestbranding=1&playsinline=1'
  );
}

export function scoreLine(match: SportMatch): string {
  const home = match.homeTeam.score;
  const away = match.awayTeam.score;
  if (home === null || away === null) {
    return `${match.homeTeam.name} vs ${match.awayTeam.name}`;
  }
  return `${match.homeTeam.name} ${home} — ${away} ${match.awayTeam.name}`;
}
