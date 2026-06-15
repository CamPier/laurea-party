# 🎓 Laurea Party — pierluigi --laurea --status=COMPLETATA

Sito in stile terminal/hacker per la festa di laurea. Statico (Vite + JS
vanilla), con Google Sheets (via Apps Script) per RSVP e guestbook, Spotify
per la playlist collaborativa e Immich per la galleria foto.

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
- `sheets.scriptUrl` → URL del Web App Apps Script per RSVP/guestbook (vedi
  sezione 3).

I **ringraziamenti** si scrivono direttamente in `index.html`, dentro la
sezione `<section id="grazie">` (cerca il commento `TODO`).

## 2. Meme/gif per "Tesi for dummies"

1. Metti i file immagine/gif dentro `public/memes/` (es.
   `public/memes/agente-ai.gif`).
2. In `src/config.js`, per ogni voce di `thesis.topics`, imposta
   `meme: '/memes/agente-ai.gif'`.
3. Finché `meme` è vuoto, la card mostra un placeholder con le istruzioni.

## 3. Google Sheets (RSVP + Guestbook)

Il form RSVP e il guestbook scrivono su un **Google Sheet**, tramite uno
script di **Google Apps Script** che fa da "backend" gratuito.

1. Crea un nuovo [Google Sheet](https://sheets.new) (es. "Laurea — risposte").
2. Apri **Estensioni → Apps Script**.
3. Cancella il contenuto di `Code.gs` e incolla quello di
   [`google-apps-script/Code.gs`](google-apps-script/Code.gs) di questo
   repo. Salva.
4. **Deploy → Nuova implementazione**:
   - Tipo: **App web**
   - Esegui come: **Me**
   - Chi ha accesso: **Chiunque**
   La prima volta Google chiederà delle autorizzazioni: accettale (è il tuo
   script sul tuo foglio).
5. Copia l'URL generato (finisce con `/exec`) e inseriscilo in
   `src/config.js` → `sheets.scriptUrl`.

I fogli **RSVP** e **Guestbook** (con le intestazioni) vengono creati
automaticamente alla prima richiesta — non serve eseguire nulla a mano.

Risultato:
- le risposte RSVP finiscono nel foglio **RSVP** (timestamp, nome, presenza,
  numero persone, note) — le vedi solo tu apertamente nel tuo Google Sheet;
- i messaggi del guestbook finiscono nel foglio **Guestbook** e vengono
  letti dal sito (pubblici, aggiornati ogni ~15 secondi).

> Se in futuro modifichi `google-apps-script/Code.gs`, devi creare una
> **nuova versione dell'implementazione** (Deploy → Gestisci implementazioni
> → Modifica → Nuova versione) perché le modifiche siano effettive. L'URL
> `/exec` resta lo stesso.

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
4. Dopo il primo deploy, in **Custom domains** aggiungi
   `laurea.camozzi.app` (il DNS, essendo già su Cloudflare, viene
   configurato automaticamente).

Non servono variabili d'ambiente: gli URL di Google Apps Script e Immich
sono configurati direttamente in `src/config.js`.

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
  style.css               # tema terminal
  utils.js                # helper condivisi
  main.js                  # entrypoint, inizializza tutte le sezioni
  easter-eggs.js           # easter eggs
  sections/
    countdown.js           # hero + countdown
    maps.js                 # Google Maps embed
    rsvp.js                 # form RSVP -> Google Sheet
    schedule.js             # programma serata
    spotify.js              # embed playlist
    guestbook.js            # messaggi (Google Sheet) + foto (Immich)
    thesis.js               # tesi for dummies
google-apps-script/
  Code.gs                  # backend Apps Script (RSVP + Guestbook)
```
