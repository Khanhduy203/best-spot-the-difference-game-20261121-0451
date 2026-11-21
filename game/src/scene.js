// Sunny Garden scene: one drawing routine, two variants.
// Variant "A" is the reference picture; variant "B" changes seven details.
// DIFFS lists each change with its hit zone in scene coordinates.

export const SCENE_WIDTH = 560;
export const SCENE_HEIGHT = 420;

export const DIFFS = [
  { id: 'sunglasses', name: 'The sun wears sunglasses', x: 70, y: 60, r: 38 },
  { id: 'apple', name: 'An apple is missing from the tree', x: 152, y: 178, r: 22 },
  { id: 'cat', name: 'The cat on the path is gone', x: 300, y: 352, r: 32 },
  { id: 'curtains', name: 'Curtains appeared in the window', x: 340, y: 240, r: 28 },
  { id: 'bird', name: 'A bird vanished from the sky', x: 330, y: 70, r: 24 },
  { id: 'flower', name: 'A flower changed colour', x: 250, y: 382, r: 22 },
  { id: 'smoke', name: 'The chimney smoke is gone', x: 443, y: 128, r: 28 },
];

function disc(ctx, x, y, r, fill) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

function drawSky(ctx) {
  const sky = ctx.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, '#6fbdf2');
  sky.addColorStop(1, '#cfeeff');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, SCENE_WIDTH, 300);
}

function drawSun(ctx, variant) {
  ctx.strokeStyle = '#f5b90d';
  ctx.lineWidth = 4;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(70 + Math.cos(a) * 40, 60 + Math.sin(a) * 40);
    ctx.lineTo(70 + Math.cos(a) * 52, 60 + Math.sin(a) * 52);
    ctx.stroke();
  }
  disc(ctx, 70, 60, 33, '#ffd93b');
  disc(ctx, 59, 55, 3.5, '#23301f');
  disc(ctx, 81, 55, 3.5, '#23301f');
  ctx.beginPath();
  ctx.arc(70, 62, 12, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.strokeStyle = '#23301f';
  ctx.lineWidth = 3;
  ctx.stroke();
  if (variant === 'B') {
    // Difference 1: the sun wears sunglasses.
    ctx.fillStyle = '#1c2733';
    ctx.beginPath();
    ctx.roundRect(50, 46, 20, 15, 5);
    ctx.roundRect(72, 46, 20, 15, 5);
    ctx.fill();
    ctx.fillRect(68, 51, 6, 4);
  }
}

function drawCloud(ctx, x, y, scale) {
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  disc(ctx, x, y, 20 * scale, '#ffffff');
  disc(ctx, x + 22 * scale, y + 4 * scale, 16 * scale, '#ffffff');
  disc(ctx, x - 22 * scale, y + 5 * scale, 15 * scale, '#ffffff');
  ctx.fillRect(x - 38 * scale, y, 76 * scale, 12 * scale);
}

function drawBird(ctx) {
  // Difference 5: this bird only exists in picture A.
  ctx.strokeStyle = '#23301f';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(318, 70, 12, Math.PI * 1.15, Math.PI * 1.95);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(342, 70, 12, Math.PI * 1.05, Math.PI * 1.85);
  ctx.stroke();
}

function drawGround(ctx) {
  ctx.fillStyle = '#79c94f';
  ctx.fillRect(0, 300, SCENE_WIDTH, 120);
  ctx.fillStyle = '#8ed45f';
  ctx.beginPath();
  ctx.ellipse(140, 330, 190, 46, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#e8d5a3';
  ctx.beginPath();
  ctx.moveTo(372, 330);
  ctx.lineTo(416, 330);
  ctx.lineTo(448, 420);
  ctx.lineTo(344, 420);
  ctx.closePath();
  ctx.fill();
}

function drawFence(ctx) {
  ctx.fillStyle = '#f7f3e3';
  for (let x = 18; x <= 280; x += 26) {
    ctx.fillRect(x, 316, 12, 30);
    ctx.beginPath();
    ctx.moveTo(x, 316);
    ctx.lineTo(x + 6, 306);
    ctx.lineTo(x + 12, 316);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillRect(14, 326, 272, 6);
}

function drawHouse(ctx, variant) {
  ctx.fillStyle = '#fff3d6';
  ctx.fillRect(300, 205, 170, 125);
  ctx.strokeStyle = '#b08968';
  ctx.lineWidth = 3;
  ctx.strokeRect(300, 205, 170, 125);
  ctx.fillStyle = '#d95f4b';
  ctx.beginPath();
  ctx.moveTo(288, 208);
  ctx.lineTo(385, 138);
  ctx.lineTo(482, 208);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#b08968';
  ctx.fillRect(432, 148, 26, 58);
  ctx.fillStyle = '#8b5a2b';
  ctx.fillRect(368, 258, 48, 72);
  disc(ctx, 408, 296, 4, '#ffd93b');
  ctx.fillStyle = '#bfe3ff';
  ctx.fillRect(320, 222, 42, 42);
  ctx.strokeStyle = '#8b5a2b';
  ctx.lineWidth = 3;
  ctx.strokeRect(320, 222, 42, 42);
  ctx.beginPath();
  ctx.moveTo(341, 222);
  ctx.lineTo(341, 264);
  ctx.moveTo(320, 243);
  ctx.lineTo(362, 243);
  ctx.stroke();
  if (variant === 'B') {
    // Difference 4: curtains hang in the window.
    ctx.fillStyle = '#e86a92';
    ctx.beginPath();
    ctx.moveTo(320, 222);
    ctx.lineTo(332, 222);
    ctx.lineTo(328, 264);
    ctx.lineTo(320, 264);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(362, 222);
    ctx.lineTo(350, 222);
    ctx.lineTo(354, 264);
    ctx.lineTo(362, 264);
    ctx.closePath();
    ctx.fill();
  }
}

function drawSmoke(ctx) {
  // Difference 7: chimney smoke only exists in picture A.
  ctx.fillStyle = 'rgba(190,190,190,0.85)';
  disc(ctx, 445, 138, 11, 'rgba(190,190,190,0.85)');
  disc(ctx, 452, 118, 13, 'rgba(200,200,200,0.7)');
  disc(ctx, 460, 96, 15, 'rgba(210,210,210,0.55)');
}

function drawTree(ctx, variant) {
  ctx.fillStyle = '#8b5a2b';
  ctx.fillRect(108, 235, 26, 95);
  ctx.fillStyle = '#3e9b4f';
  disc(ctx, 122, 195, 52, '#3e9b4f');
  disc(ctx, 84, 222, 36, '#4cb15e');
  disc(ctx, 162, 222, 38, '#4cb15e');
  disc(ctx, 100, 185, 8, '#e23b3b');
  disc(ctx, 135, 215, 8, '#e23b3b');
  if (variant === 'A') {
    // Difference 2: the third apple is missing in picture B.
    disc(ctx, 152, 178, 8, '#e23b3b');
  }
}

function drawCat(ctx) {
  // Difference 3: the cat sits on the path only in picture A.
  ctx.fillStyle = '#f2a65a';
  ctx.beginPath();
  ctx.ellipse(300, 358, 20, 15, 0, 0, Math.PI * 2);
  ctx.fill();
  disc(ctx, 300, 338, 12, '#f2a65a');
  ctx.beginPath();
  ctx.moveTo(290, 330);
  ctx.lineTo(292, 318);
  ctx.lineTo(299, 328);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(310, 330);
  ctx.lineTo(308, 318);
  ctx.lineTo(301, 328);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#f2a65a';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(318, 356, 12, -0.4, 1.2);
  ctx.stroke();
  disc(ctx, 296, 336, 2, '#23301f');
  disc(ctx, 304, 336, 2, '#23301f');
}

function drawFlower(ctx, x, y, petal) {
  ctx.strokeStyle = '#2b7a2b';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + 16);
  ctx.stroke();
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    disc(ctx, x + Math.cos(a) * 8, y + Math.sin(a) * 8, 6, petal);
  }
  disc(ctx, x, y, 5, '#ffd93b');
}

function drawButterfly(ctx) {
  ctx.fillStyle = '#9b6dd6';
  ctx.beginPath();
  ctx.ellipse(492, 146, 9, 6, -0.5, 0, Math.PI * 2);
  ctx.ellipse(508, 146, 9, 6, 0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#23301f';
  ctx.fillRect(498, 140, 4, 14);
}

export function drawScene(ctx, variant) {
  ctx.clearRect(0, 0, SCENE_WIDTH, SCENE_HEIGHT);
  drawSky(ctx);
  drawSun(ctx, variant);
  drawCloud(ctx, 210, 55, 1);
  drawCloud(ctx, 440, 95, 0.8);
  if (variant === 'A') drawBird(ctx);
  drawGround(ctx);
  drawFence(ctx);
  drawHouse(ctx, variant);
  if (variant === 'A') drawSmoke(ctx);
  drawTree(ctx, variant);
  drawFlower(ctx, 60, 385, '#ffde59');
  drawFlower(ctx, 150, 392, '#ff8fab');
  // Difference 6: this flower is red in A, purple in B.
  drawFlower(ctx, 250, 382, variant === 'A' ? '#e23b3b' : '#9b6dd6');
  drawFlower(ctx, 500, 388, '#ffffff');
  drawFlower(ctx, 524, 360, '#ff9f43');
  if (variant === 'A') drawCat(ctx);
  drawButterfly(ctx);
  ctx.fillStyle = '#3e9b4f';
  disc(ctx, 505, 322, 20, '#3e9b4f');
  disc(ctx, 528, 330, 15, '#4cb15e');
}

export function drawMarker(ctx, diff) {
  ctx.strokeStyle = '#ff2e2e';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(diff.x, diff.y, diff.r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.85)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(diff.x, diff.y, diff.r + 3, 0, Math.PI * 2);
  ctx.stroke();
}
