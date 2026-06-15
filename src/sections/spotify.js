import { party } from '../config.js';

export function initSpotify() {
  const iframe = document.getElementById('spotifyIframe');
  const match = party.spotifyPlaylistUrl.match(/playlist\/([a-zA-Z0-9]+)/);
  const id = match ? match[1] : '';

  iframe.src = `https://open.spotify.com/embed/playlist/${id}?utm_source=generator&theme=0`;
}
