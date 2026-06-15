/**
 * Backend per RSVP + Guestbook del sito di laurea.
 * Salva tutto in due fogli dello stesso Google Sheet: "RSVP" e "Guestbook".
 *
 * Setup:
 * 1. Crea un Google Sheet (vuoto va bene).
 * 2. Estensioni -> Apps Script, incolla questo file come Code.gs.
 * 3. Esegui la funzione `setup` una volta (menu in alto, scegli "setup",
 *    poi Esegui) per creare i fogli "RSVP" e "Guestbook" con le intestazioni.
 * 4. Deploy -> Nuova implementazione -> tipo "Web app":
 *    - Esegui come: Me
 *    - Chi ha accesso: Chiunque
 * 5. Copia l'URL del Web App (finisce con /exec) in src/config.js,
 *    campo `sheets.scriptUrl`.
 *
 * Ogni volta che modifichi questo script devi creare una nuova
 * implementazione (o gestire le versioni) perché l'URL resti valido.
 */

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  let rsvp = ss.getSheetByName('RSVP');
  if (!rsvp) rsvp = ss.insertSheet('RSVP');
  rsvp.getRange(1, 1, 1, 5).setValues([['Timestamp', 'Nome', 'Presenza', 'N. persone', 'Note']]);

  let guestbook = ss.getSheetByName('Guestbook');
  if (!guestbook) guestbook = ss.insertSheet('Guestbook');
  guestbook.getRange(1, 1, 1, 3).setValues([['Timestamp', 'Nome', 'Messaggio']]);
}

function doGet(e) {
  if (e.parameter.action === 'guestbook') {
    return jsonResponse({ messages: readGuestbook() });
  }
  return jsonResponse({ ok: true });
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);

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
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('RSVP');
  sheet.appendRow([
    new Date(),
    String(data.name || '').slice(0, 100),
    data.attending === 'yes' ? 'yes' : 'no',
    Number(data.guests) || 1,
    String(data.notes || '').slice(0, 1000),
  ]);
}

function appendGuestbook(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Guestbook');
  sheet.appendRow([new Date(), String(data.name || '').slice(0, 100), String(data.message || '').slice(0, 1000)]);
}

function readGuestbook() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Guestbook');
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

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
