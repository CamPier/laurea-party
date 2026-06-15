import './style.css';
import { initCountdown } from './sections/countdown.js';
import { initMaps } from './sections/maps.js';
import { initRsvp } from './sections/rsvp.js';
import { initSchedule } from './sections/schedule.js';
import { initSpotify } from './sections/spotify.js';
import { initGuestbook } from './sections/guestbook.js';
import { initEasterEggs } from './easter-eggs.js';

initCountdown();
initMaps();
initRsvp();
initSchedule();
initSpotify();
initGuestbook();
initEasterEggs();

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.terminal-nav__links');

navToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('is-open');
});

navLinks?.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    navLinks.classList.remove('is-open');
  }
});
