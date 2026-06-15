import { collection, addDoc, serverTimestamp, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase.js';
import { immich } from '../config.js';
import { escapeHtml } from '../utils.js';

export function initGuestbook() {
  initForm();
  initMessages();
  initImmichGallery();
}

function initForm() {
  const form = document.getElementById('guestbookForm');
  const status = document.getElementById('guestbookStatus');
  const fileInput = form.querySelector('input[type="file"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.classList.remove('is-error');
    status.textContent = 'invio in corso...';

    const data = new FormData(form);
    const files = fileInput.files ? Array.from(fileInput.files) : [];

    try {
      await addDoc(collection(db, 'guestbook'), {
        name: data.get('name'),
        message: data.get('message'),
        createdAt: serverTimestamp(),
      });

      let uploadErrors = 0;
      if (files.length > 0) {
        const results = await Promise.allSettled(files.map(uploadToImmich));
        uploadErrors = results.filter((r) => r.status === 'rejected').length;
        if (uploadErrors === 0) initImmichGallery();
      }

      form.reset();

      if (uploadErrors > 0) {
        status.classList.add('is-error');
        status.textContent = `✓ messaggio pubblicato, ma ${uploadErrors} foto non sono state caricate. Usa il link "carica le tue foto" qui sotto.`;
      } else {
        status.textContent = '✓ messaggio pubblicato!';
      }
    } catch (err) {
      console.error(err);
      status.classList.add('is-error');
      status.textContent = "✗ errore durante l'invio. riprova.";
    }
  });
}

async function uploadToImmich(file) {
  if (!immich.sharedLinkKey) {
    throw new Error('Immich non configurato');
  }

  const now = new Date();
  const body = new FormData();
  body.append('assetData', file);
  body.append('deviceAssetId', `web-${now.getTime()}-${file.name}`);
  body.append('deviceId', 'laurea-website');
  body.append('fileCreatedAt', now.toISOString());
  body.append('fileModifiedAt', now.toISOString());
  body.append('isFavorite', 'false');

  const res = await fetch(`${immich.baseUrl}/api/assets?key=${immich.sharedLinkKey}`, {
    method: 'POST',
    body,
  });

  if (!res.ok) {
    throw new Error(`Upload Immich fallito: HTTP ${res.status}`);
  }

  return res.json();
}

function initMessages() {
  const container = document.getElementById('guestbookMessages');
  const q = query(collection(db, 'guestbook'), orderBy('createdAt', 'desc'), limit(50));

  onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        container.innerHTML = '<p class="loading">Nessun messaggio ancora. Sii il primo! 👋</p>';
        return;
      }

      container.innerHTML = snapshot.docs
        .map((doc) => {
          const d = doc.data();
          const time = d.createdAt?.toDate ? d.createdAt.toDate().toLocaleString('it-IT') : '';
          return `
            <div class="guestbook__message">
              <span class="guestbook__message-time">${time}</span>
              <span class="guestbook__message-name">${escapeHtml(d.name)}:</span>
              <span>${escapeHtml(d.message)}</span>
            </div>
          `;
        })
        .join('');
    },
    (err) => {
      console.error(err);
      container.innerHTML = '<p class="loading">Errore nel caricamento dei messaggi.</p>';
    }
  );
}

async function initImmichGallery() {
  const hint = document.getElementById('immichHint');
  const gallery = document.getElementById('immichGallery');

  if (!immich.sharedLinkKey) {
    hint.innerHTML = '📸 La galleria foto sarà collegata a breve. Per ora condividi gli scatti più belli con Pierluigi!';
    return;
  }

  const shareUrl = `${immich.baseUrl}/share/${immich.sharedLinkKey}`;
  hint.innerHTML = `📸 Allega una foto al tuo messaggio qui sopra, oppure <a href="${shareUrl}" target="_blank" rel="noopener">carica le tue foto direttamente su Immich →</a>`;

  try {
    const res = await fetch(`${immich.baseUrl}/api/shared-links/me?key=${immich.sharedLinkKey}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const assets = data.assets || [];

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
