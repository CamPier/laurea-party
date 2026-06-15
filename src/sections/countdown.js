import { party } from '../config.js';
import { formatDate } from '../utils.js';

export function initCountdown() {
  typeTitle();

  document.getElementById('heroSubtitle').textContent = party.subtitle;

  const target = new Date(party.date);
  document.getElementById('heroDate').textContent = `📅 ${formatDate(target)}`;

  const els = {
    days: document.getElementById('cd-days'),
    hours: document.getElementById('cd-hours'),
    minutes: document.getElementById('cd-minutes'),
    seconds: document.getElementById('cd-seconds'),
  };

  function update() {
    const diff = Math.max(0, target - new Date());

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    els.days.textContent = String(days).padStart(2, '0');
    els.hours.textContent = String(hours).padStart(2, '0');
    els.minutes.textContent = String(minutes).padStart(2, '0');
    els.seconds.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

function typeTitle() {
  const el = document.getElementById('typedTitle');
  const text = party.title;
  let i = 0;

  function step() {
    el.textContent = text.slice(0, i);
    if (i <= text.length) {
      i++;
      setTimeout(step, 45);
    }
  }

  step();
}
