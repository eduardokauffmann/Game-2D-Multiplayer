const socket = io();

const loginBox = document.getElementById('loginBox');
const nicknameInput = document.getElementById('nicknameInput');
const startBtn = document.getElementById('startBtn');
const gameContainer = document.getElementById('gameContainer');
const scoreList = document.getElementById('scoreList');
const killFeed = document.getElementById('killFeed');
const skinGrid = document.getElementById('skinGrid');
const selectedSkinName = document.getElementById('selectedSkinName');

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const SKINS = [
  { id: 'skin1',  name: 'Escudo Estelar',  file: 'skins/skin1.svg' },
  { id: 'skin2',  name: 'Baiacu Bravo',    file: 'skins/skin2.svg' },
  { id: 'skin3',  name: 'Poké-Esfera',     file: 'skins/skin3.svg' },
  { id: 'skin4',  name: 'Planeta Terra',   file: 'skins/skin4.svg' },
  { id: 'skin5',  name: 'Melancia',        file: 'skins/skin5.svg' },
  { id: 'skin6',  name: 'Olho Místico',    file: 'skins/skin6.svg' },
  { id: 'skin7',  name: 'Donut Morango',   file: 'skins/skin7.svg' },
  { id: 'skin8',  name: 'Bola 8',          file: 'skins/skin8.svg' },
  { id: 'skin9',  name: 'Alien Tóxico',    file: 'skins/skin9.svg' },
  { id: 'skin10', name: 'Lava Vulcânica',  file: 'skins/skin10.svg' },
  { id: 'skin11', name: 'Ninja Sombrio',   file: 'skins/skin11.svg' },
  { id: 'skin12', name: 'Abelha Rainha',   file: 'skins/skin12.svg' },
  { id: 'skin13', name: 'Alvo Neon',       file: 'skins/skin13.svg' },
  { id: 'skin14', name: 'Fantasma Boo',    file: 'skins/skin14.svg' },
  { id: 'skin15', name: 'Sol Radiante',    file: 'skins/skin15.svg' }
];

const loadedSkinImages = {};
let selectedSkinId = SKINS[0].id;

SKINS.forEach((skin) => {
  const img = new Image();
  img.src = skin.file;
  loadedSkinImages[skin.id] = img;

  const item = document.createElement('div');
  item.className = 'skin-item' + (skin.id === selectedSkinId ? ' selected' : '');
  item.title = skin.name;

  const previewImg = document.createElement('img');
  previewImg.src = skin.file;

  item.appendChild(previewImg);
  item.addEventListener('click', () => {
    document.querySelectorAll('.skin-item').forEach(el => el.classList.remove('selected'));
    item.classList.add('selected');
    selectedSkinId = skin.id;
    selectedSkinName.textContent = skin.name;
  });

  skinGrid.appendChild(item);
});

let myId = null;
let players = {};
let orbs = [];
const keys = { up: false, down: false, left: false, right: false };

function join() {
  const nick = nicknameInput.value.trim() || 'Célula';
  socket.emit('joinGame', { nickname: nick, skin: selectedSkinId });
  loginBox.classList.add('hidden');
  gameContainer.classList.remove('hidden');
}

startBtn.addEventListener('click', join);
nicknameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') join();
});

socket.on('init', (data) => {
  myId = data.id;
});

socket.on('stateUpdate', (state) => {
  players = state.players;
  orbs = state.orbs;
  updateScoreboard();
});

socket.on('killFeed', (msg) => {
  killFeed.textContent = msg;
  killFeed.classList.add('show');
  setTimeout(() => killFeed.classList.remove('show'), 3000);
});

function updateKey(key, pressed) {
  const k = key.toLowerCase();
  if (k === 'w' || k === 'arrowup') keys.up = pressed;
  if (k === 's' || k === 'arrowdown') keys.down = pressed;
  if (k === 'a' || k === 'arrowleft') keys.left = pressed;
  if (k === 'd' || k === 'arrowright') keys.right = pressed;
  socket.emit('playerMove', keys);
}

window.addEventListener('keydown', (e) => updateKey(e.key, true));
window.addEventListener('keyup', (e) => updateKey(e.key, false));

function updateScoreboard() {
  const sorted = Object.values(players)
    .filter(p => p.active)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  scoreList.innerHTML = sorted
    .map(p => `<li class="${p.id === myId ? 'me' : ''}">${p.nickname} — <strong>${p.score}</strong></li>`)
    .join('');
}

function drawGrid() {
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= canvas.width; x += 45) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y <= canvas.height; y += 45) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();

  for (const orb of orbs) {
    ctx.save();
    ctx.shadowColor = orb.color;
    ctx.shadowBlur = 10;
    ctx.fillStyle = orb.color;
    ctx.beginPath();
    ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  const sortedPlayers = Object.values(players)
    .filter(p => p.active)
    .sort((a, b) => a.radius - b.radius);

  for (const p of sortedPlayers) {
    ctx.save();
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 16;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = p.color;
    ctx.fill();

    ctx.save();
    ctx.clip();

    const skinImg = loadedSkinImages[p.skin];
    if (skinImg && skinImg.complete && skinImg.naturalWidth > 0) {
      ctx.drawImage(
        skinImg,
        p.x - p.radius,
        p.y - p.radius,
        p.radius * 2,
        p.radius * 2
      );
    }
    ctx.restore();

    ctx.lineWidth = p.id === myId ? 3 : 2;
    ctx.strokeStyle = p.id === myId ? '#00f5d4' : 'rgba(255,255,255,0.6)';
    ctx.stroke();

    ctx.shadowBlur = 0;

    const fontSize = Math.max(12, Math.min(18, p.radius * 0.4));
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillStyle = '#ffffff';

    ctx.strokeText(p.nickname, p.x, p.y - p.radius - 10);
    ctx.fillText(p.nickname, p.x, p.y - p.radius - 10);

    ctx.font = `bold ${Math.max(11, fontSize * 0.85)}px Arial`;
    ctx.strokeText(p.score, p.x, p.y + p.radius + 11);
    ctx.fillText(p.score, p.x, p.y + p.radius + 11);

    ctx.restore();
  }

  requestAnimationFrame(draw);
}

requestAnimationFrame(draw);