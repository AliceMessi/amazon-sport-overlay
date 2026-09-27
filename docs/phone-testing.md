# Test on your phone — 2 ways (EN summary at bottom)

## Way A — Expo Go (full app, incl. video overlay) — recommended
1. Sul PC, nella cartella progetto:
   ```powershell
   npx expo start --lan
   ```
2. Sul telefono (stesso Wi-Fi del PC): installa **Expo Go** (Play Store / App Store), aprila e scansiona il QR nel terminale.
3. Si apre la dashboard → filtri → dettaglio → **Watch with overlay** → video con score bug sopra.
   - `Hide info` / `Back` con tap (su TV: frecce + OK).
4. Se il QR non va: in Expo Go usa "Enter URL manually" con l'URL `exp://192.168.1.65:8081` mostrato nel terminale.

## Way B — Browser del telefono (solo UI web, niente video nativo)
1. Sul PC:
   ```powershell
   npx serve dist -l 3000
   ```
   (oppure `python -m http.server 3000 --directory dist`)
2. Sul telefono (stesso Wi-Fi): apri `http://192.168.1.65:3000`.

## Note (v0.3)
- Come capire che hai il codice nuovo: in fondo alla dashboard c'è scritto **"Sport Overlay v0.3 · phone layout"**. Se non lo vedi, hai ancora il bundle vecchio → chiudi tutti i terminali expo e riparti con `-c`.
- Su telefono la dashboard è **una colonna con un unico scroll**: filtri → card → dettaglio → bottone verde **Watch with overlay**. Niente più scroll doppi.
- Video overlay = WebView YouTube: l'overlay info **non blocca i tap sul video** — se l'autoplay è bloccato, **tocca il video per farlo partire**.

---
*EN: Same Wi-Fi on PC + phone. A) `npx expo start --lan`, scan QR with Expo Go. B) Serve `dist/` and open `http://192.168.1.65:3000` in the phone browser (web UI only).*
