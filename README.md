# 🎓 Laurea Party — pierluigi --laurea --status=COMPLETATA

Sito in stile terminal/hacker per la festa di laurea. Statico (Vite + JS
vanilla), con Firebase per RSVP e guestbook, Spotify per la playlist
collaborativa e Immich per la galleria foto.

## Avvio rapido

```bash
npm install
npm run dev      # sviluppo locale, http://localhost:5173
npm run build    # build di produzione in /dist
npm run preview  # preview della build
```

## 1. Modificare i contenuti — `src/config.js`

Tutto ciò che riguarda data, orario, indirizzo, programma, link Spotify e i
contenuti della sezione "tesi for dummies" si modifica in **un solo file**:
`src/config.js`. Dopo ogni modifica, se hai `npm run dev` attivo, il sito si
aggiorna da solo.

Cose da completare:

- `party.location.name` e `party.location.address` → indirizzo reale della
  festa (usato per Google Maps e mostrato in chiaro).
- `party.date` → conferma che `2026-07-24T18:00:00+02:00` sia corretto.
- `party.schedule` → aggiungi/modifica le voci del programma.
- `thesis.topics[].meme` → metti il path dell'immagine/gif (vedi sotto).

I **ringraziamenti** si scrivono direttamente in `index.html`, dentro la
sezione `<section id="grazie">` (cerca il commento `TODO`).

## 2. Meme/gif per "Tesi for dummies"

1. Metti i file immagine/gif dentro `public/memes/` (es.
   `public/memes/agente-ai.gif`).
2. In `src/config.js`, per ogni voce di `thesis.topics`, imposta
   `meme: '/memes/agente-ai.gif'`.
3. Finché `meme` è vuoto, la card mostra un placeholder con le istruzioni.

## 3. Firebase (RSVP + Guestbook)

Il form RSVP e il guestbook scrivono su **Firestore**.

1. Crea un progetto su [Firebase Console](https://console.firebase.google.com).
2. Abilita **Firestore Database** (modalità produzione, region `eur3` consigliata).
3. Aggiungi una **Web App** al progetto (icona `</>`) e copia la configurazione.
4. Copia `.env.example` in `.env` e incolla i valori:
   ```bash
   cp .env.example .env
   ```
5. Deploy delle security rules (già pronte in `firestore.rules`):
   ```bash
   npm install -g firebase-tools   # se non lo hai già
   firebase login
   firebase use --add               # seleziona il tuo progetto
   firebase deploy --only firestore:rules
   ```

Le regole in `firestore.rules`:
- chiunque può **inviare** una risposta RSVP, ma **nessuno** può leggerle dal
  client — le vedi solo tu nella console Firebase (Firestore → collezione
  `rsvp`);
- i messaggi del guestbook (collezione `guestbook`) sono pubblici: chiunque
  può scriverli e leggerli, ma non modificarli/cancellarli.

> Le chiavi `VITE_FIREBASE_*` finiscono nel bundle pubblico: è normale, sono
> identificatori del progetto, non segreti. La sicurezza è garantita dalle
> Firestore Rules, non dal nascondere queste chiavi.

## 4. Spotify — playlist collaborativa

La playlist è già collegata (`party.spotifyPlaylistUrl` in `config.js`) e
viene mostrata con il player embed di Spotify.

Per renderla **collaborativa** (se non l'hai già fatto):
1. Apri la playlist nell'app Spotify.
2. Tocca i tre puntini → **Collabora** ("Make collaborative").
3. Condividi il link — chiunque può aggiungere brani.

## 5. Immich — galleria/upload foto del guestbook

Il guestbook usa un **album condiviso Immich** per foto e video.

1. Sul tuo server Immich, crea un album (es. "Laurea Pierluigi 🎓").
2. Apri l'album → **Condividi** → **Crea link condiviso**.
3. Attiva **"Consenti agli utenti pubblici di caricare file"** ("Allow public
   user to upload").
4. Copia la chiave del link (la parte dopo `/share/` nell'URL).
5. In `src/config.js`, sezione `immich`:
   - `baseUrl`: l'URL pubblico della tua istanza (es.
     `https://immich.camozzi.app`, esposto via Cloudflare Tunnel).
   - `sharedLinkKey`: la chiave copiata al punto 4.

Il sito mostrerà una griglia di anteprime (lette dall'API pubblica dello
shared link) e, nel form del guestbook, un campo per allegare foto/video al
proprio messaggio: vengono caricati direttamente nell'album Immich tramite
`POST /api/assets?key=...`. C'è anche un link diretto alla pagina Immich per
chi preferisce caricare più foto insieme da lì.

> **Nota CORS:** sia la lettura delle anteprime (`GET`) che l'upload
> (`POST /api/assets`) sono richieste cross-origin dal sito
> (`https://laurea.camozzi.app`) verso Immich (`https://photos.camozzi.app`).
> Se vedi errori CORS in console, aggiungi l'origine del sito alle
> intestazioni CORS del reverse proxy davanti a Immich (header
> `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods` incl. `POST`,
> e `Access-Control-Allow-Headers`).

> **Nota versione API:** l'endpoint di upload (`POST /api/assets`) è quello
> delle versioni recenti di Immich. Se la tua istanza è più vecchia e usa
> `/api/asset/upload`, aggiorna l'URL in
> `src/sections/guestbook.js` (`uploadToImmich`). Se l'upload via sito non
> funziona, il link diretto alla pagina Immich resta sempre disponibile come
> alternativa.

## 6. Deploy su Cloudflare Pages (`laurea.camozzi.app`)

1. Pusha il repo su GitHub (o GitLab).
2. Su Cloudflare → **Workers & Pages** → **Create application** → **Pages** →
   **Connect to Git**.
3. Configurazione build:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. In **Settings → Environment variables**, aggiungi tutte le variabili
   `VITE_FIREBASE_*` dal tuo file `.env`.
5. Dopo il primo deploy, in **Custom domains** aggiungi
   `laurea.camozzi.app` (il DNS, essendo già su Cloudflare, viene
   configurato automaticamente).

## 7. Easter eggs 🥚

Ce ne sono un paio nascosti nel sito:
- apri la **console del browser** per un messaggio di benvenuto;
- prova il **Konami Code** (`↑ ↑ ↓ ↓ ← → ← → B A`) in qualsiasi punto della
  pagina.

Per aggiungerne altri, modifica `src/easter-eggs.js`.

## Struttura del progetto

```
index.html              # markup di tutte le sezioni
src/
  config.js              # ⭐ contenuti modificabili (data, indirizzo, ecc.)
  firebase.js             # init Firebase/Firestore
  style.css               # tema terminal
  utils.js                # helper condivisi
  main.js                  # entrypoint, inizializza tutte le sezioni
  easter-eggs.js           # easter eggs
  sections/
    countdown.js           # hero + countdown
    maps.js                 # Google Maps embed
    rsvp.js                 # form RSVP -> Firestore
    schedule.js             # programma serata
    spotify.js              # embed playlist
    guestbook.js            # messaggi (Firestore) + foto (Immich)
    thesis.js               # tesi for dummies
firestore.rules          # security rules Firestore
```
