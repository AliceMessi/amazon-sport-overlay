# Match overlay demo — minor-match footage + info on top

## What was built (MP4/WebM default, no geo-blocking)
`src/screens/MatchOverlayScreen.tsx` (native, `expo-video`) + `MatchOverlayScreen.web.tsx` (browser, fullscreen `<video>` with fallback `<source>`):
- **Default source = MP4/WebM direct**: Latvia vs Gibraltar 2026-03-31 (real minor match, Wikimedia Commons 480p vp9, ~17s loop), fallback amateur girls-training clip. No YouTube → no region blocks, no ads, no copyright risk.
- Demo feed = amateur clubs only (Promozione/Serie C Lombardia, Kart Cup Italia).
- Attribution: footage by Wikimedia Commons contributors (CC BY-SA) — credited in README.
- Legacy `YOUTUBE_DEMO_ID` (derby Inter-Milan) kept for reference only; Serie A embeds are region-blocked in IT.
`src/screens/MatchOverlayScreen.tsx` (native, `react-native-webview`) + `MatchOverlayScreen.web.tsx` (browser, fullscreen `iframe` — because react-native-webview has no web implementation):
- **Default source = YouTube**: derby highlights Inter-Milan 1-2 (Serie A official channel, `YOUTUBE_DEMO_ID = '0rOAweY4dFQ'` in `src/screens/videoSource.ts`), autoplay, no player chrome (`controls=0&rel=0&modestbranding=1&playsinline=1`).
- **Score bug** top-left + headline/venue bottom bar rendered **on top of the video** (absolute overlay, info views don't swallow taps).
- **Hide info / Back** (focusable → D-pad OK on TV, tap on phone).
- Entry: **Watch with overlay** in every detail panel. Swap video: change one ID (`YOUTUBE_DEMO_ID`) or pass `source={{ type: 'youtube', videoId }}` / `{ type: 'mp4', uri }`.
- Spare derby IDs (all embeddable): `7YyOTvPR950`, `vAfMw-uXqXU`, `GesRzSU7nnE`, `44PNLZbb_EA`.

## Swap the demo footage (important for Devpost)
Default `DEMO_VIDEO_URI` = Google sample bucket placeholder. For the <3 min submission video, use **royalty-free football stock only** (no TV rips — judges reject copyrighted footage):
- Pexels Videos → search "football stadium" (Pexels license, free).
- Coverr → "soccer" clips (free license).
- Or film 30s of an amateur match yourself.

Download the MP4, put it in `assets/demo-match.mp4`, then:
```tsx
<MatchOverlayScreen match={watching} videoUri={...} onBack={...} />
// or change DEMO_VIDEO_URI to require('../assets/demo-match.mp4')
```
For a remote URL just pass `videoUri="https://..."`.

## Tests
`tests/matchOverlay.test.tsx` (native: YouTube default + embed URL, mp4 fallback, toggle, back), `tests/matchOverlayWeb.test.tsx` (web iframe + back) + mocks. Full suite: **7 files / 27 tests green**. Headless-browser check: dashboard renders, Watch opens overlay with real YouTube iframe + score bug on top, buttons work, 0 console errors.

## MVP note
YouTube embeds can show ads / be blocked / require network — acceptable for the MVP demo. For the <3 min Devpost video, record the app running (screen capture counts as your demo, not redistributed footage).
