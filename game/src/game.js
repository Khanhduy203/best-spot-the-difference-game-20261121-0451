// Spot the Difference game logic: state machine, clicks, timer, score, hints.
// One scene is drawn twice (variants A and B); a click on either picture checks
// the same seven hit zones, and every found difference is circled on both.

import { DIFFS, drawMarker, drawScene } from './scene.js';

const TIME_LIMIT_SECONDS = 120;
const WRONG_CLICK_PENALTY_SECONDS = 3;
const POINTS_PER_FIND = 100;
const TIME_BONUS_PER_SECOND = 10;
const HINTS_AT_START = 2;

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export class SpotGame {
  constructor(canvasA, canvasB, ui) {
    this.canvasA = canvasA;
    this.canvasB = canvasB;
    this.ctxA = canvasA.getContext('2d');
    this.ctxB = canvasB.getContext('2d');
    this.ui = ui;
    this.state = 'ready';
    this.found = new Set();
    this.score = 0;
    this.secondsLeft = TIME_LIMIT_SECONDS;
    this.hintsLeft = HINTS_AT_START;
    this.timerId = null;
    this.missMarks = [];
    this.render();
  }

  render() {
    drawScene(this.ctxA, 'A');
    drawScene(this.ctxB, 'B');
    for (const diff of DIFFS) {
      if (this.found.has(diff.id)) {
        drawMarker(this.ctxA, diff);
        drawMarker(this.ctxB, diff);
      }
    }
    for (const mark of this.missMarks) {
      const ctx = mark.canvas === 'A' ? this.ctxA : this.ctxB;
      ctx.strokeStyle = '#ff2e2e';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(mark.x - 9, mark.y - 9);
      ctx.lineTo(mark.x + 9, mark.y + 9);
      ctx.moveTo(mark.x + 9, mark.y - 9);
      ctx.lineTo(mark.x - 9, mark.y + 9);
      ctx.stroke();
    }
    this.ui.foundCount.textContent = `${this.found.size} / ${DIFFS.length}`;
    this.ui.timer.textContent = formatTime(Math.max(0, this.secondsLeft));
    this.ui.score.textContent = String(this.score);
    this.ui.hintBtn.textContent = `Hint (${this.hintsLeft})`;
    this.ui.hintBtn.disabled = this.state !== 'playing' || this.hintsLeft === 0;
  }

  start() {
    this.stopTimer();
    this.state = 'playing';
    this.found = new Set();
    this.score = 0;
    this.secondsLeft = TIME_LIMIT_SECONDS;
    this.hintsLeft = HINTS_AT_START;
    this.missMarks = [];
    this.ui.overlay.classList.add('hidden');
    this.render();
    this.timerId = setInterval(() => this.tick(), 1000);
  }

  restart() {
    this.start();
  }

  stopTimer() {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  tick() {
    if (this.state !== 'playing') return;
    this.secondsLeft -= 1;
    this.render();
    if (this.secondsLeft <= 0) this.endGame(false);
  }

  clickOn(canvas, event) {
    if (this.state !== 'playing') return;
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((event.clientY - rect.top) / rect.height) * canvas.height;
    const hit = DIFFS.find(
      (d) => !this.found.has(d.id) && Math.hypot(d.x - x, d.y - y) <= d.r,
    );
    if (hit) {
      this.markFound(hit, POINTS_PER_FIND);
      this.toast(`Found it — ${hit.name}!`, false);
    } else {
      this.secondsLeft = Math.max(0, this.secondsLeft - WRONG_CLICK_PENALTY_SECONDS);
      const mark = { canvas: canvas === this.canvasA ? 'A' : 'B', x, y };
      this.missMarks.push(mark);
      setTimeout(() => {
        this.missMarks = this.missMarks.filter((m) => m !== mark);
        this.render();
      }, 700);
      this.toast(`Not a difference — ${WRONG_CLICK_PENALTY_SECONDS} seconds lost`, true);
      this.render();
      if (this.secondsLeft <= 0) this.endGame(false);
    }
  }

  markFound(diff, points) {
    this.found.add(diff.id);
    this.score += points;
    this.render();
    if (this.found.size === DIFFS.length) this.endGame(true);
  }

  useHint() {
    if (this.state !== 'playing' || this.hintsLeft === 0) return;
    const remaining = DIFFS.filter((d) => !this.found.has(d.id));
    if (remaining.length === 0) return;
    this.hintsLeft -= 1;
    const revealed = remaining[0];
    this.toast(`Hint — ${revealed.name}`, false);
    this.markFound(revealed, 0);
  }

  endGame(won) {
    this.stopTimer();
    this.state = won ? 'won' : 'lost';
    if (won) this.score += this.secondsLeft * TIME_BONUS_PER_SECOND;
    this.render();
    this.ui.overlayTitle.textContent = won
      ? 'You found all 7!'
      : 'Time ran out!';
    this.ui.overlayText.textContent = won
      ? `Every difference found with ${formatTime(this.secondsLeft)} to spare.`
      : `You found ${this.found.size} of ${DIFFS.length} differences. Give it another go!`;
    this.ui.overlayScore.hidden = false;
    this.ui.overlayScore.textContent = `Score: ${this.score}`;
    this.ui.overlayBtn.textContent = 'Play again';
    this.ui.overlay.classList.remove('hidden');
  }

  toast(message, bad) {
    const el = this.ui.toast;
    el.textContent = message;
    el.classList.toggle('bad', bad);
    el.classList.add('show');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
  }

  // Demo states for screenshots (?shot=play or ?shot=win): the game plays
  // itself partway so a screenshot shows a game in progress or finished.
  demo(mode) {
    this.start();
    if (mode === 'play') {
      this.stopTimer();
      this.secondsLeft = 87;
      this.markFound(DIFFS[0], POINTS_PER_FIND);
      this.markFound(DIFFS[2], POINTS_PER_FIND);
      this.markFound(DIFFS[5], POINTS_PER_FIND);
      this.state = 'playing';
      this.render();
    } else if (mode === 'win') {
      this.stopTimer();
      this.secondsLeft = 41;
      for (const diff of DIFFS) this.found.add(diff.id);
      this.score = DIFFS.length * POINTS_PER_FIND;
      this.endGame(true);
    }
  }
}
