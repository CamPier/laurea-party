/**
 * Backend per RSVP + Guestbook del sito di laurea.
 * Salva tutto in due fogli dello stesso Google Sheet: "RSVP" e "Guestbook".
 *
 * Setup:
 * 1. Crea un Google Sheet (vuoto va bene).
 * 2. Estensioni -> Apps Script, incolla questo file come Code.gs.
 * 3. Deploy -> Nuova implementazione -> tipo "Web app":
 *    - Esegui come: Me
 *    - Chi ha accesso: Chiunque
 * 4. Copia l'URL del Web App (finisce con /exec) in src/config.js,
 *    campo `sheets.scriptUrl`.
 *
 * I fogli "RSVP" e "Guestbook" vengono creati automaticamente alla prima
 * richiesta, se non esistono già.
 *
 * Ogni volta che modifichi questo script devi creare una nuova versione
 * dell'implementazione (Deploy -> Gestisci implementazioni -> Modifica ->
 * Nuova versione) perché le modifiche siano effettive. L'URL /exec resta
 * lo stesso.
 */

const RSVP_HEADERS = ['Timestamp', 'Nome', 'Presenza', 'N. persone', 'Note'];
const GUESTBOOK_HEADERS = ['Timestamp', 'Nome', 'Messaggio'];

function doGet(e) {
  const params = (e && e.parameter) || {};

  if (params.action === 'guestbook') {
    return jsonResponse({ messages: readGuestbook() });
  }
  return jsonResponse({ ok: true });
}

function doPost(e) {
  const contents = (e && e.postData && e.postData.contents) || '{}';
  const data = JSON.parse(contents);

  if (data.type === 'rsvp') {
    appendRsvp(data);
  } else if (data.type === 'guestbook') {
    appendGuestbook(data);
  } else {
    return jsonResponse({ ok: false, error: 'unknown type' });
  }

  return jsonResponse({ ok: true });
}

function appendRsvp(data) {
  const sheet = getOrCreateSheet('RSVP', RSVP_HEADERS);
  sheet.appendRow([
    new Date(),
    String(data.name || '').slice(0, 100),
    data.attending === 'yes' ? 'yes' : 'no',
    Number(data.guests) || 1,
    String(data.notes || '').slice(0, 1000),
  ]);
}

function appendGuestbook(data) {
  const sheet = getOrCreateSheet('Guestbook', GUESTBOOK_HEADERS);
  sheet.appendRow([new Date(), String(data.name || '').slice(0, 100), String(data.message || '').slice(0, 1000)]);
}

function readGuestbook() {
  const sheet = getOrCreateSheet('Guestbook', GUESTBOOK_HEADERS);
  const rows = sheet.getDataRange().getValues();
  rows.shift(); // intestazione

  return rows
    .filter((r) => r[1] || r[2])
    .map((r) => ({
      timestamp: r[0] instanceof Date ? r[0].toISOString() : String(r[0]),
      name: String(r[1] || ''),
      message: String(r[2] || ''),
    }))
    .reverse();
}

function getOrCreateSheet(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);

  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }

  return sheet;
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
