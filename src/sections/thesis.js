import { thesis } from '../config.js';

export function initThesis() {
  document.getElementById('tesiTitle').innerHTML =
    `<strong>${thesis.title}</strong> — ${thesis.subtitle}`;

  const container = document.getElementById('thesisCards');

  container.innerHTML = thesis.topics
    .map(
      (topic) => `
        <div class="thesis-card">
          <h3 class="thesis-card__heading">${topic.heading}</h3>
          <p class="thesis-card__text">${topic.text}</p>
          ${
            topic.meme
              ? `<img class="thesis-card__meme" src="${topic.meme}" alt="${topic.heading}" loading="lazy" />`
              : `<div class="thesis-card__meme-placeholder">[ metti un meme/gif in /public/memes/ e collegalo in config.js ]</div>`
          }
        </div>
      `
    )
    .join('');
}
