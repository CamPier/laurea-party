import { sheets } from '../config.js';

export function initRsvp() {
  const form = document.getElementById('rsvpForm');
  const status = document.getElementById('rsvpStatus');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.classList.remove('is-error');

    if (!sheets.scriptUrl) {
      status.classList.add('is-error');
      status.textContent = '✗ form non ancora collegato. riprova più tardi.';
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
          type: 'rsvp',
          name: data.get('name'),
          attending: data.get('attending'),
          guests: Number(data.get('guests')) || 1,
          notes: data.get('notes') || '',
        }),
      });

      form.reset();
      status.textContent = '✓ risposta salvata, grazie!';
    } catch (err) {
      console.error(err);
      status.classList.add('is-error');
      status.textContent = "✗ errore durante l'invio. riprova.";
    }
  });
}
