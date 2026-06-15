import { party } from '../config.js';
import { formatDate } from '../utils.js';

export function initMaps() {
  document.getElementById('locationName').textContent = `"${party.location.name}"`;
  document.getElementById('locationAddress').textContent = `"${party.location.address}"`;
  document.getElementById('locationDate').textContent = `"${formatDate(new Date(party.date))}"`;

  const query = encodeURIComponent(party.location.address);
  document.getElementById('mapsIframe').src = `https://www.google.com/maps?q=${query}&output=embed`;
}
