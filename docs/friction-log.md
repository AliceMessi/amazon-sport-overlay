# Friction Log — Sport Overlay for Fire TV (Amazon Developer Hackathon 2026)

Environment: Windows 11, React Native TV (Expo 57), target Fire OS (Leanback). No physical Fire TV on desk — all device testing on emulator.

## 1. No Fire TV emulator image in Android SDK Manager

- **Attempted:** `sdkmanager "system-images;android-34;android-tv;x86_64"` for a Fire TV simulator.
- **Expected:** an official Fire TV / Fire OS system image, as the rules ask for "Fire TV/Vega simulator".
- **Actual:** no Fire TV image exists publicly; closest are `android-tv` / `google-tv` x86 images (and only `x86`, not `x86_64`, on API 34).
- **Severity:** important.
- **Workaround:** used `system-images;android-34;android-tv;x86` (our APK ships x86/x86_64 native libs, so it runs). Demo video recorded there.
- **Suggestion:** publish a Fire TV emulator image (or document the Android TV image as the accepted stand-in) in the hackathon resources. Critical for devs without a Stick.

## 2. Vega vs Fire OS docs split is confusing for React Native devs

- **Attempted:** follow "Fire TV" track docs to run an Expo/React Native TV app on the Vega Virtual Device.
- **Expected:** one path for "run your TV app on a simulator".
- **Actual:** Vega docs assume Vega SDK/`.vpkg` apps; Fire OS (Android-based, `.apk`) is a different pipeline. Took a web search + forum dive to confirm the Android emulator route.
- **Severity:** important.
- **Workaround:** Android TV emulator + sideloaded APK.
- **Suggestion:** a track chooser table ("If your app is X, test it with Y") on the hackathon Resources page. Important.

## 3. `adb shell am start` silently stops foregrounding the app

- **Attempted:** `adb shell am start -n tech.hokentech.sportoverlay/.MainActivity` between takes.
- **Expected:** app comes to foreground (it did the first times).
- **Actual:** after several cycles the command printed "intent delivered to currently running instance" while the TV launcher stayed foreground — breaking blind recording scripts twice (one take recorded the launcher/YouTube instead of the app).
- **Severity:** important.
- **Workaround:** `adb shell monkey -p <pkg> -c android.intent.category.LEANBACK_LAUNCHER 1` + verify with `dumpsys activity activities | grep topResumedActivity` before every take.
- **Suggestion:** niche — mostly an adb quirk, but a "verify foreground before screenrecord" note would have saved an hour. Nice-to-have.

## 4. `screenrecord` clips stop at ~40s on the TV emulator

- **Attempted:** `adb shell screenrecord --time-limit 90/100/120` for a single-take demo.
- **Expected:** ~90s clip.
- **Actual:** every take stopped at 39–49s (across time-limit values, sleep disabled).
- **Severity:** nice-to-have (worked around).
- **Workaround:** recorded the overlay segment device-side (perfect 1080p) and the dashboard segment via PC window capture (ffmpeg gdigrab), then edited both with title/outro cards + narration.
- **Suggestion:** document `screenrecord` limits on TV images, if known. Nice-to-have.

## 5. Release APK needs manual signing outside EAS

- **Attempted:** local `gradlew assembleRelease` for a store-ready artifact.
- **Expected:** signed APK like the debug build.
- **Actual:** unsigned `app-release.apk` (no signing config in Expo prebuild output); installed only after `apksigner sign` with a generated debug keystore. Also hit `INSTALL_FAILED_UPDATE_INCOMPATIBLE` switching between EAS-signed preview and local debug signatures — fixed with `adb uninstall` first.
- **Severity:** nice-to-have.
- **Workaround:** keytool + apksigner, documented in repo scripts.
- **Suggestion:** Expo/EAS docs already cover this; no Amazon action needed. Noted for completeness.
