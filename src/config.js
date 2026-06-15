// ============================================================
// CONFIG.JS — modifica questi valori per personalizzare il sito
// Nessuna build necessaria: rilancia `npm run dev` / `npm run build`
// ============================================================

export const party = {
  // Titolo e sottotitolo mostrati nell'hero
  title: 'pierluigi --laurea --status=COMPLETATA',
  subtitle: 'Vieni a festeggiare con me 🎓',

  // Data e ora di inizio festa (formato ISO, fuso orario Italia)
  // TODO: conferma orario esatto se diverso da 18:00
  date: '2026-07-24T18:00:00+02:00',

  // Indirizzo completo del luogo della festa
  // TODO: sostituisci con l'indirizzo reale
  location: {
    name: 'Camozzi  House',
    address: 'Via Castellaro 19, Copparo',
  },

  // Programma della serata. Aggiungi/rimuovi voci a piacere.
  schedule: [
    { time: '18:00', label: 'Apertura festa & aperitivo', icon: '🍹' },
    { time: '20:00', label: 'Cena', icon: '🍕' },
    { time: '22:00', label: 'Musica & party', icon: '🎶' },
    { time: 'late', label: 'Until late...', icon: '🌙' },
  ],

  // Link alla playlist Spotify collaborativa
  spotifyPlaylistUrl:
    'https://open.spotify.com/playlist/2gTTLognAf1K8GtrsSOroO?si=ff69871e204048ee&pt=7c1bdf655183bad8cbb67805be2cc218',
};

// ============================================================
// GOOGLE SHEETS — RSVP + Guestbook
// ============================================================
export const sheets = {
  // URL del Web App di Google Apps Script (termina con /exec).
  // Vedi google-apps-script/Code.gs per il codice da incollare e
  // le istruzioni di deploy.
  // TODO: inserisci l'URL dopo il deploy dello script
  scriptUrl: '',
};

// ============================================================
// IMMICH — gallery / upload foto del guestbook
// ============================================================
export const immich = {
  // URL pubblico della tua istanza Immich (es. https://immich.camozzi.app)
  // TODO: inserisci l'URL pubblico quando il tunnel è configurato
  baseUrl: 'https://photos.camozzi.app',

  // Link condiviso (shared link) dell'album "Laurea" creato in Immich,
  // con "Allow public user to upload" attivo.
  // Genera il link da: Immich -> Album -> Condividi -> Crea link condiviso
  // Solo la chiave (la parte dopo /share/), NON l'URL completo
  sharedLinkKey: 'C5paZXASPJ4wS8ai3JVJMJ0ubNAM2PIq1iMFqnCZxJYgrN4LZfHcKJT8JTjgBnaTZVE',
};

// ============================================================
// TESI FOR DUMMIES — argomenti della tesi, uno per slide/card.
// Per ognuno lascia un campo `meme` da riempire con il path
// dell'immagine/gif (in /public/memes/).
// ============================================================
export const thesis = {
  title: 'AI e Customer Experience',
  subtitle:
    'Progettazione e Integrazione di Agenti Conversazionali Autonomi: architetture, protocolli (MCP) e applicazioni in ambito Enterprise',
  topics: [
    {
      heading: 'Cos\'è un Agente Conversazionale Autonomo?',
      text: 'Un software che capisce, decide e agisce da solo per portare a termine un compito — non solo risponde, ma fa le cose.',
      meme: '',
    },
    {
      heading: 'Customer Experience: perché conta',
      text: 'L\'azienda non parla più "a" te, ma "con" te — in tempo reale, 24/7, senza fila al call center.',
      meme: '',
    },
    {
      heading: 'Cos\'è MCP (Model Context Protocol)?',
      text: 'Il "linguaggio comune" che permette agli agenti AI di collegarsi a strumenti, dati e servizi senza reinventare la ruota ogni volta.',
      meme: '',
    },
    {
      heading: 'Architetture: come si costruisce un agente',
      text: 'Un cervello (LLM) + memoria + strumenti (tools) + un protocollo per parlare con il mondo esterno.',
      meme: '',
    },
    {
      heading: 'Applicazioni Enterprise',
      text: 'Dalle grandi aziende ai contact center: agenti che gestiscono richieste, integrano CRM e riducono i tempi di attesa.',
      meme: '',
    },
  ],
};
