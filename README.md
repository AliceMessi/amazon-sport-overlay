# Sport Overlay Fire TV

Companion live multi-sport per Fire TV, costruito con Expo e React Native TV.

## Stato

- Feed dimostrativo locale per calcio, basket e Formula 1
- UI landscape ottimizzata per TV
- Controlli focusable e navigazione D-pad nativa
- Launcher Android TV Leanback e banner 320×180
- Nessuna dipendenza RevenueCat, Supabase o scanner visivo

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
