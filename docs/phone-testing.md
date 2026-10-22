# Testing without a Fire TV

Sport Overlay is built for Fire OS. The same code also runs on a phone and in a browser, which is handy for a quick review. On those targets the dashboard uses the single-column layout; the two-panel layout appears only on TV (`Platform.isTV`).

## Option A: Android TV emulator (closest to Fire OS)

1. In Android Studio, create a TV virtual device (for example *Android TV (1080p)*, API 34, x86).
2. Install the release APK:
   ```bash
   adb install -r sport-overlay-fire-tv-0.1.0.apk
   adb shell monkey -p tech.hokentech.sportoverlay -c android.intent.category.LEANBACK_LAUNCHER 1
   ```
3. Use the emulator's D-pad: the arrows move the focus, **OK** opens **Watch with overlay**, and **Back** returns.

## Option B: Expo Go on a phone (full app, including the video overlay)

1. On your computer, in the project folder:
   ```bash
   npx expo start --lan
   ```
2. On a phone on the same Wi-Fi, install **Expo Go**, open it and scan the QR code shown in the terminal. If the QR code does not work, choose "Enter URL manually" in Expo Go and type the `exp://<computer-ip>:8081` address printed in the terminal.
3. The dashboard opens. Pick a filter, tap a match, then **Watch with overlay**. Use **Hide info** and **Back** by tapping.

## Option C: browser (web build)

- Hosted: https://alicemessi.github.io/amazon-sport-overlay/
- Local:
  ```bash
  npm run web:build        # exports to dist/
  npx serve dist -l 3000   # or: python -m http.server 3000 --directory dist
  ```
  Then open `http://<computer-ip>:3000` on any device on the same network.

## Notes

- To check that you are running the current bundle, look at the footer at the bottom of the phone and web layout: it reads **"Sport Overlay v0.3 · phone layout"**. If it is missing, restart Expo with `npx expo start -c` to clear the cache.
- The overlay plays the bundled Wikimedia Commons clips (MP4/WebM, looping). If a browser blocks autoplay, click the video to start it.
