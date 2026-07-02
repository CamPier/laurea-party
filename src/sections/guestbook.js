import { sheets, immich } from '../config.js';
import { escapeHtml } from '../utils.js';

const POLL_INTERVAL_MS = 15000;

export function initGuestbook() {
  initForm();
  initMessages();
  initGallery();
}

function initForm() {
  const form = document.getElementById('guestbookForm');
  const status = document.getElementById('guestbookStatus');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.classList.remove('is-error');

    if (!sheets.scriptUrl) {
      status.classList.add('is-error');
      status.textContent = '✗ guestbook non ancora collegato. riprova più tardi.';
      return;
    }

    status.textContent = 'invio in corso...';

    const data = new FormData(form);

    try {
      // no-cors: il redirect di Apps Script alla risposta finale non ha
      // header CORS, quindi non possiamo leggere la risposta. Il body
      // text/plain arriva comunque a doPost via e.postData.contents.
      await fetch(sheets.scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          type: 'guestbook',
          name: data.get('name'),
          message: data.get('message'),
        }),
      });

      form.reset();
      fetchMessages();
      status.textContent = '✓ messaggio pubblicato!';
    } catch (err) {
      console.error(err);
      status.classList.add('is-error');
      status.textContent = "✗ errore durante l'invio. riprova.";
    }
  });
}

function initMessages() {
  fetchMessages();
  setInterval(fetchMessages, POLL_INTERVAL_MS);
}

function initGallery() {
  initImmichGallery();
  setInterval(initImmichGallery, POLL_INTERVAL_MS);
}

async function fetchMessages() {
  const container = document.getElementById('guestbookMessages');

  if (!sheets.scriptUrl) {
    container.innerHTML = '<p class="loading">Il guestbook sarà disponibile a breve.</p>';
    return;
  }

  try {
    const res = await fetch(`${sheets.scriptUrl}?action=guestbook`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const messages = data.messages || [];

    if (messages.length === 0) {
      container.innerHTML = '<p class="loading">Nessun messaggio ancora. Sii il primo! 👋</p>';
      return;
    }

    container.innerHTML = messages
      .map((m) => {
        const time = m.timestamp ? new Date(m.timestamp).toLocaleString('it-IT') : '';
        return `
          <div class="guestbook__message">
            <span class="guestbook__message-time">${time}</span>
            <span class="guestbook__message-name">${escapeHtml(m.name)}:</span>
            <span>${escapeHtml(m.message)}</span>
          </div>
        `;
      })
      .join('');
  } catch (err) {
    console.error(err);
    container.innerHTML = '<p class="loading">Errore nel caricamento dei messaggi.</p>';
  }
}

async function initImmichGallery() {
  const hint = document.getElementById('immichHint');
  const gallery = document.getElementById('immichGallery');

  if (!immich.sharedLinkKey) {
    hint.innerHTML = '📸 La galleria foto sarà collegata a breve. Per ora condividi gli scatti più belli con Pierluigi!';
    return;
  }

  const shareUrl = `${immich.baseUrl}/share/${immich.sharedLinkKey}`;
  hint.innerHTML = `📸 <a href="${shareUrl}" target="_blank" rel="noopener">Carica foto della laurea →</a>`;

  try {
    const res = await fetch(`${immich.baseUrl}/api/shared-links/me?key=${immich.sharedLinkKey}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    let assets = data.assets || [];

    // Per gli shared link di tipo "Album" Immich non popola `assets` qui:
    // la lista va presa dall'endpoint dell'album.
    if (assets.length === 0 && data.album && data.album.id) {
      const albumRes = await fetch(`${immich.baseUrl}/api/albums/${data.album.id}?key=${immich.sharedLinkKey}`);
      if (albumRes.ok) {
        const albumData = await albumRes.json();
        assets = albumData.assets || [];
      }
    }

    if (assets.length === 0) {
      gallery.innerHTML = '<p class="loading">Nessuna foto ancora caricata.</p>';
      return;
    }

    gallery.innerHTML = assets
      .slice(0, 24)
      .map((asset) => {
        const thumbUrl = `${immich.baseUrl}/api/assets/${asset.id}/thumbnail?key=${immich.sharedLinkKey}`;
        return `<a href="${shareUrl}" target="_blank" rel="noopener"><img src="${thumbUrl}" alt="" loading="lazy" /></a>`;
      })
      .join('');
  } catch (err) {
    console.error('Immich gallery error:', err);
    gallery.innerHTML = '<p class="loading">Galleria non disponibile al momento.</p>';
  }
}
