import { party } from '../config.js';

export function initSchedule() {
  const ol = document.getElementById('timeline');

  ol.innerHTML = party.schedule
    .map(
      (item) => `
        <li>
          <span class="timeline__icon">${item.icon}</span>
          <span class="timeline__time">${item.time}</span>
          <span>${item.label}</span>
        </li>
      `
    )
    .join('');
}
