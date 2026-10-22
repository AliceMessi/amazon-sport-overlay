# Test report: Sport Overlay for Fire TV (2026-10-22)

## 1. Automated checks: PASS

`npm run verify` runs typecheck, ESLint and Jest; all three are green. Jest runs 7 suites and 32 tests:

| Suite | What it checks |
|---|---|
| `sportsDashboard.test.ts` | `filterMatches`, `createDashboardState`, and the `dashboardReducer` actions `sportSelected`, `matchSelected` and `selectionMoved` (wrap-around) |
| `liveSportsScreen.test.tsx` | A filter auto-selects the first visible match. D-pad focus updates the detail panel. Every control is `focusable`. The filter bar keeps its natural height. The Watch button and the phone layout are present. |
| `matchOverlay.test.tsx` | Native overlay: clip per sport, score bug, headline, Hide/Show info, initial TV focus on Hide info, Back button and the remote's Back key |
| `matchOverlayWeb.test.tsx` | Web overlay: `<video>` source with fallback, score bug, Back |
| `app.test.tsx` | The app opens on the first demo match |
| `tvConfiguration.test.ts` | Uses the `react-native-tvos` runtime, sets the TV config plugin and npm peer settings |
| `withFireTv.test.ts` | Fire OS manifest: Leanback launcher category, banner, touchscreen not required, `INTERNET` only, cleartext and backups off |

## 2. Android TV emulator: PASS

The release APK (`assembleRelease`, signed with a debug key) was tested on an Android TV emulator (API 34, x86, 1920×1080):

- The app installs and starts from the Leanback launcher.
- The dashboard shows the two-panel TV layout with English labels. All four filter chips are readable. That was fixed on 22 Oct: the chip labels used to be clipped on TV.
- D-pad: the focus moves across filters and cards, and the detail panel follows the focus.
- **Watch with overlay** plays the clip for each sport fullscreen with the score bug and headline. **Hide info**, **Show info** and **Back** work.

Screenshots: `docs/screenshots/01–07`.

## 3. Web build: PASS

`npx expo export --platform web` builds without errors. It is published at https://alicemessi.github.io/amazon-sport-overlay/ and checked in Chromium at 1920×1080 and at phone size (`docs/screenshots/08-phone-layout.png`). The overlay plays the Commons clip.

## 4. Not covered

- **Physical Fire TV hardware.** No device was available, and no public Fire TV emulator image exists. The Android TV emulator is the stand-in; see `docs/friction-log.md` entry 1.
- **Vega OS.** This is a Fire OS (Android) app; a Vega build would need the Vega SDK toolchain.
