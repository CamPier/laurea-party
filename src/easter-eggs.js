const KONAMI = [
  'ArrowUp',
  'ArrowDown',
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
];

export function initEasterEggs() {
  consoleMessage();
  initKonamiCode();
}

function consoleMessage() {
  console.log(
    '%c👋 Ciao curioso!',
    'color:#39ff14; font-size:18px; font-weight:bold; font-family:monospace;'
  );
  console.log(
    '%cStai guardando il codice della mia festa di laurea.\nSe trovi un bug... è una feature. 😉\n\nPS: prova il cheat code 🎮 (↑ ↓ ↑ ↓ ← → ← →)',
    'color:#ffb000; font-family:monospace; font-size:13px;'
  );
}

function initKonamiCode() {
  let progress = 0;

  window.addEventListener('keydown', (e) => {
    const expected = KONAMI[progress];
    const matches = e.key.toLowerCase() === expected.toLowerCase();

    if (matches) {
      progress++;
      if (progress === KONAMI.length) {
        progress = 0;
        triggerEasterEgg();
      }
    } else {
      progress = e.key.toLowerCase() === KONAMI[0].toLowerCase() ? 1 : 0;
    }
  });
}

function triggerEasterEgg() {
  const overlay = document.createElement('div');
  overlay.className = 'easter-egg-overlay';
  overlay.innerHTML = `
    <div>
      <div class="easter-egg-overlay__content">
        🎉 sudo unlock --open-bar<br />cheat code attivato!
      </div>
      <div class="easter-egg-overlay__hint">
        (forse non è davvero open bar, ma ti meriti un applauso 👏 — clicca per chiudere)
      </div>
    </div>
  `;
  overlay.addEventListener('click', () => overlay.remove());
  document.body.appendChild(overlay);
}
