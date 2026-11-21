// Bootstrap: wire the two canvases, the HUD buttons and the keyboard to the game.

import { SpotGame } from './game.js';

const $ = (id) => document.getElementById(id);

const game = new SpotGame($('canvasA'), $('canvasB'), {
  foundCount: $('foundCount'),
  timer: $('timer'),
  score: $('score'),
  hintBtn: $('hintBtn'),
  restartBtn: $('restartBtn'),
  toast: $('toast'),
  overlay: $('overlay'),
  overlayTitle: $('overlayTitle'),
  overlayText: $('overlayText'),
  overlayScore: $('overlayScore'),
  overlayBtn: $('overlayBtn'),
});

$('canvasA').addEventListener('click', (event) => game.clickOn($('canvasA'), event));
$('canvasB').addEventListener('click', (event) => game.clickOn($('canvasB'), event));
$('hintBtn').addEventListener('click', () => game.useHint());
$('restartBtn').addEventListener('click', () => game.restart());
$('overlayBtn').addEventListener('click', () => game.start());

document.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  if (key === 'h') game.useHint();
  if (key === 'r') game.restart();
  if ((key === 'enter' || key === ' ') && game.state !== 'playing') {
    event.preventDefault();
    game.start();
  }
});

const shot = new URLSearchParams(window.location.search).get('shot');
if (shot === 'play' || shot === 'win') game.demo(shot);
