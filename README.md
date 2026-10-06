# Sport Overlay Fire TV

Companion live multi-sport per Fire TV, costruito con Expo e React Native TV.

## Stato

- Feed dimostrativo locale dilettanti (calcio Promozione/Coppa Lombardia, basket Serie C, Kart Cup Italia)
- UI landscape ottimizzata per TV
- Controlli focusable e navigazione D-pad nativa
- Launcher Android TV Leanback e banner 320×180
- Nessuna dipendenza RevenueCat, Supabase o scanner visivo

## Demo footage

Minor-match clips from Wikimedia Commons (freely licensed, no geo-blocking):
- Latvia vs Gibraltar 2026-03-31 (primary loop) + amateur training clip (fallback).
- Credit: Wikimedia Commons contributors, CC BY-SA. No Serie A/pro footage.

## Comandi

```bash
npm install
npm run verify
npx expo prebuild --platform android --no-install
npm run android
```

Build cloud Android:

```bash
npx eas-cli build --platform android --profile preview
```

## Test

```bash
npm test -- --runInBand
```

I test coprono reducer e filtri, integrazione dell’entrypoint, interazione D-pad e plugin nativo Fire TV.
