# Sport Overlay for Fire TV

**A TV-first companion for live minor-league sport.** The score bug sits on top of the match, and everything is driven by the remote.

Sport Overlay is a Fire OS app built with Expo and React Native TV for the **Build, Ship, Shape: Amazon Developer Hackathon** (Fire TV track, *sports* priority category). It shows every live and upcoming game on one landscape screen. Press **Watch with overlay** and a clip plays fullscreen with the live score bug and headline on top. You can hide and show the info at any time and go back with one button. No account, keys or backend are needed: a demo feed is bundled.

- ▶ **Demo video (1:06):** https://youtu.be/_W1ze9UiZrk
- 🌐 **Web preview (desktop browser):** https://alicemessi.github.io/amazon-sport-overlay/
- 📦 **Fire TV APK:** [latest release](https://github.com/AliceMessi/amazon-sport-overlay/releases/latest)
- 🧾 **Friction log:** [`docs/friction-log.md`](docs/friction-log.md)

![Dashboard on the Android TV emulator](docs/screenshots/01-home-all.png)

## Features

- **Live dashboard for the 10-foot UI.** Filters (All, Football, Basketball, Motorsport) run along the top, the event list sits on the left and the selected match on the right. Each card shows competition, teams, score and period (67', Q3 04:12, Lap 12/20). Upcoming games show their kick-off time.
- **D-pad native.** Every control is focusable with a visible focus ring. Moving the focus over a card selects it immediately. **OK/Select** opens the overlay, and **Back** returns to the list.
- **Video overlay engine.** One overlay works for every sport:
  - the score bug at the top left (teams, score, period, live dot);
  - a headline bar at the bottom (headline, competition, venue);
  - **Hide info / Show info** for clean video.
- **Real footage per sport, no geo-blocks.** Each sport plays its own freely licensed clip from Wikimedia Commons (credits below), so nothing is region-locked or ad-supported.
- **Fire TV packaging.** A custom Expo config plugin ([`plugins/withFireTv.js`](plugins/withFireTv.js)) makes every prebuild produce a TV app:
  - Leanback launcher and 320×180 banner;
  - touchscreen not required;
  - only the `INTERNET` permission, with cleartext traffic and backups off.
- **One codebase, three targets.** The same code runs as:
  - the two-panel TV layout on Fire OS / Android TV;
  - a single-column layout on phones;
  - a web build for quick review in a browser.

## Try it

### On a Fire TV device (sideload the APK)

1. On the Fire TV, open **Settings → My Fire TV → Developer options** and turn on **ADB debugging**. Note the IP address in **Settings → My Fire TV → About → Network**.
2. On a computer with [Android platform-tools](https://developer.android.com/tools/releases/platform-tools):
   ```bash
   adb connect <fire-tv-ip>:5555
   adb install -r sport-overlay-fire-tv-0.1.0.apk
   ```
3. Open **Sport Overlay Fire TV** from **Apps**. Use the arrows to move, **Select** to open the overlay, and **Back** to return.

The APK is a release build signed with a debug key. It works on Fire OS and on Android TV; an emulator image for x86/x86_64 also works.

### In a browser (fastest)

Open https://alicemessi.github.io/amazon-sport-overlay/. Click a filter or a card, then **Watch with overlay**. On the web the layout is the single-column phone variant; the two-panel layout is TV only.

### From source

Requirements: Node.js 20+, npm, and, for the Android build, JDK 17 and the Android SDK.

```bash
git clone https://github.com/AliceMessi/amazon-sport-overlay.git
cd amazon-sport-overlay
npm install
npm run verify                    # typecheck + ESLint + 32 Jest tests

# Android / Fire OS
npx expo prebuild --platform android --no-install
npm run android                   # runs on a connected Fire TV or a TV emulator
# or: cd android && ./gradlew assembleRelease   -> android/app/build/outputs/apk/release/app-release.apk
# or: npx eas-cli build --platform android --profile preview   (cloud APK)

# Web
npm run web                       # dev server
npm run web:build                 # static export to dist/
```

## How it works

```
App.tsx
 ├─ LiveSportsScreen   dashboard: filters, cards, detail panel (TV two-panel / phone column)
 │    └─ dashboardReducer   pure state: sportSelected, matchSelected, selectionMoved (wraps)
 └─ MatchOverlayScreen fullscreen clip + score bug + headline bar, Hide/Show info, Back
      ├─ native: expo-video VideoView (looping autoplay, no native controls)
      └─ web:    MatchOverlayScreen.web.tsx with <video> and a fallback <source>
src/data/demoMatches.ts   bundled demo feed (amateur clubs only)
src/screens/videoSource.ts one Commons clip per sport
plugins/withFireTv.js     Fire OS manifest + Leanback banner config plugin
```

- **TV runtime:** `react-native` points to `react-native-tvos` 0.86 (matching Expo SDK 57). `@react-native-tvos/config-tv` sets `isTV`. `Platform.isTV` switches between the two layouts.
- **State** is a small pure reducer (`src/state/sportsDashboard.ts`), so filtering and D-pad selection are unit-tested without rendering.
- **Demo data** contains amateur clubs only (Lombardy amateur football and basketball, Italian karting). The data shape (`SportMatch`) is the integration point for a live score provider.

## Tests

`npm test` runs 7 suites and 32 tests:

- **Dashboard reducer:** filters, selection and wrap-around.
- **Dashboard screen:** a filter auto-selects the first visible match, D-pad focus updates the detail panel, every control is focusable, the filter bar keeps its height on TV, and the Watch button is reachable.
- **Overlay screen, native and web:** source per sport, score bug, headline, hide/show, initial TV focus, and both the Back button and the remote's Back key.
- **TV build configuration and the Fire TV config plugin:** Leanback category, banner, features, permissions and backup flags.

## Demo footage and credits

All clips are streamed from Wikimedia Commons under free licenses. No professional-league footage and no ads are used.

| Sport | Clip | Author | License |
|---|---|---|---|
| Football | [Latvia–Gibraltar football 2026-03-31](https://commons.wikimedia.org/wiki/File:Latvia-Gibraltar_football_2026-03-31.webm) | Mārtiņš Bruņenieks | CC0 1.0 |
| Football (fallback) | [Girls football training](https://commons.wikimedia.org/wiki/File:Girls_football_training.webm) | Evworo | CC BY-SA 3.0 |
| Basketball | [Nabua street basketball](https://commons.wikimedia.org/wiki/File:Nabua_street_basketball_WTR.webm) | Yawrei | CC BY-SA 4.0 |
| Motorsport | [Go-karting at Cook Forest Fun Park](https://commons.wikimedia.org/wiki/File:Go-karting_at_Cook_Forest_Fun_Park,_Farmington_Township,_Clarion_County,_Pennsylvania_-_20220726.webm) | Andre Carrotflower | CC BY-SA 4.0 |

The clips are used unmodified: the app draws its overlay on top during playback. Team names in the demo feed are fictional pairings of amateur clubs, and all scores are made up.

## Language note for the demo video

The demo video was recorded in early October 2026, before the interface was translated. The narration and the overlay buttons are already in English, but some on-screen labels are in Italian. Since then the app shows the English text below.

| On screen in the video | English (current app) |
|---|---|
| Tutto il tuo sport, in un colpo d'occhio | All your sport, at a glance |
| Tutti · Calcio · Basket · Formula 1 | All · Football · Basketball · Motorsport |
| Diretta e prossimi eventi · 5 EVENTI | Live and upcoming · 5 EVENTS |
| PARTITA SELEZIONATA | SELECTED MATCH |
| INIZIA / TERMINATA | UPCOMING / FINAL |
| Comandi telecomando: Usa le frecce per spostarti e OK per selezionare. | Remote controls: Use the arrows to move and OK to select. |
| Partita equilibrata nel secondo tempo | Evenly matched in the second half |
| Lambrate recupera due punti nel terzo quarto | Lambrate claws back two points in the third quarter |
| Duello ravvicinato nella zona lenta | Wheel-to-wheel duel through the slow section |
| Segrate completa il comeback | Segrate completes the comeback |
| Sfida ad alta tensione per il primo posto | High-stakes clash for first place |
| Giro 12/20 · 67° | Lap 12/20 · 67' |

Competition, club and venue names (for example *Promozione Lombardia*, *Comunale Lambrate*) are proper names and stay as they are.

## Tested on

- Android TV emulator (API 34, x86) with the release APK. No public Fire TV emulator image exists, so this is the closest stand-in for Fire OS; see friction log entry 1.
- Web build in Chromium at 1920×1080 and at phone size.
- Windows 11, Node.js 24, Expo SDK 57.

## AI assistance

Development was assisted by Claude Code, directed and reviewed by the author. The concept renders in the pitch deck are AI-generated and labelled as such.

## License

[MIT](LICENSE) © 2026 AliceMessi. The demo clips keep their own licenses (see above).
