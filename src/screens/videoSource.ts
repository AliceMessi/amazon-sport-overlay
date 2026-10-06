import type { Sport, SportMatch } from '../domain/matches';

// Demo footage: real minor-match clips (Wikimedia Commons, freely licensed,
// no geo-blocking, no ads). Primary = Latvia vs Gibraltar (2026-03-31);
// fallback = amateur girls training. YouTube derby highlights removed:
// Serie A embeds are region-blocked in IT and carry ads/copyright risk.
export const DEMO_VIDEO_URI =
  'https://upload.wikimedia.org/wikipedia/commons/transcoded/0/06/Latvia-Gibraltar_football_2026-03-31.webm/Latvia-Gibraltar_football_2026-03-31.webm.480p.vp9.webm';

export const DEMO_VIDEO_FALLBACK_URI =
  'https://upload.wikimedia.org/wikipedia/commons/transcoded/7/7d/Girls_football_training.webm/Girls_football_training.webm.480p.vp9.webm';

// One real minor-match clip per sport: football = Latvia vs Gibraltar,
// basketball = Nabua street ball, kart = Cook Forest fun-park karts (60s).
const DEMO_VIDEO_BY_SPORT: Record<Sport, string> = {
  football: DEMO_VIDEO_URI,
  basketball:
    'https://upload.wikimedia.org/wikipedia/commons/transcoded/3/35/Nabua_street_basketball_WTR.webm/Nabua_street_basketball_WTR.webm.480p.vp9.webm',
  formula1:
    'https://upload.wikimedia.org/wikipedia/commons/transcoded/d/db/Go-karting_at_Cook_Forest_Fun_Park%2C_Farmington_Township%2C_Clarion_County%2C_Pennsylvania_-_20220726.webm/Go-karting_at_Cook_Forest_Fun_Park%2C_Farmington_Township%2C_Clarion_County%2C_Pennsylvania_-_20220726.webm.480p.vp9.webm',
};

export function demoSourceForSport(sport: Sport): VideoSource {
  return { type: 'mp4', uri: DEMO_VIDEO_BY_SPORT[sport] };
}

// Legacy YouTube demo (region-blocked in some countries). Kept for
// reference only; default playback is MP4/WebM above.
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
