import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.js';

export function initRsvp() {
  const form = document.getElementById('rsvpForm');
  const status = document.getElementById('rsvpStatus');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.classList.remove('is-error');
    status.textContent = 'invio in corso...';

    const data = new FormData(form);

    try {
      await addDoc(collection(db, 'rsvp'), {
        name: data.get('name'),
        attending: data.get('attending'),
        guests: Number(data.get('guests')) || 1,
        notes: data.get('notes') || '',
        createdAt: serverTimestamp(),
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
