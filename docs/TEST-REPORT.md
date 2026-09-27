# Test Report — amazon-sport-overlay (2026-09-26)

## 1. Automated verification — PASS
- `npm run verify` = typecheck + eslint + jest → green
- `npm test -- --runInBand`: **5 suites, 19 tests, all passing**
  - `sportsDashboard.test.ts` — filterMatches, createDashboardState, dashboardReducer (sportSelected, matchSelected, selectionMoved wrap-around)
  - `liveSportsScreen.test.tsx` — filter + auto-select first visible, D-pad `onFocus` updates panel, all buttons `focusable`
  - `app.test.tsx` — opens with `Inter vs Milan`
  - `tvConfiguration.test.ts` + `withFireTv.test.ts` — Leanback launcher, banner, TV plugin config

## 2. Web build — PASS
- `npx expo export --platform web` → `dist/index.html` + bundle (374 KB), no errors.
- This proves the Metro bundle resolves and the UI renders outside native.

## 3. Functional walkthrough (logic-level, from tests + code)
- Home (All): 5 events, selected = `serie-a-inter-milan` → detail shows `Inter vs Milan, 1 — 1`.
- Football filter: 2 events (Inter-Milan, Real-PSG), auto-select first.
- Basket filter: Olimpia-Virtus + Lakers-Warriors; focus on card 2 updates title.
- F1: Verstappen vs Leclerc, `Giro 42/58`.
- D-pad: `selectionMoved ±1` wraps around visible list; focus ring `#55E6C1`.

## 4. Not tested here (needs device)
- `npm run android` / EAS build on real Fire TV or Fire TV simulator (required for the <3 min demo video).
- Reason: no Android SDK / Fire TV device in this environment.

## 5. Deliverables added today
- `docs/screenshots/01..05.png` (1920×1080 faithful UI renders)
- `docs/pitch-deck-en.md` + `docs/pitch-deck.html` (10 slides, EN, problem → solution)

## Verdict
**Project works at UI-logic + web-bundle level. Ready for Devpost except the device demo video.**
Next step: run on Fire TV simulator, screen-record <3 min EN, upload to YouTube/Vimeo, then submit (deadline Oct 23, 2026).
