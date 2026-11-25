const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(express.static(path.join(__dirname, 'public')));

const MAP_WIDTH = 900;
const MAP_HEIGHT = 650;
const START_RADIUS = 20;
const MAX_RADIUS = 160;
const ORB_COUNT = 50;

const COLORS = [
  '#00f5d4', '#ff2a85', '#fee440', '#9b5de5',
  '#00bbf9', '#38b000', '#ff7b00', '#f15bb5'
];

const players = {};
let orbs = [];

function rand(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function randomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function calcRadius(score) {
  return Math.min(MAX_RADIUS, START_RADIUS + Math.sqrt(score) * 3.8);
}

function createOrb(id) {
  return {
    id,
    x: rand(20, MAP_WIDTH - 20),
    y: rand(20, MAP_HEIGHT - 20),
    radius: rand(5, 8),
    color: randomColor()
  };
}

for (let i = 0; i < ORB_COUNT; i++) {
  orbs.push(createOrb(i));
}

io.on('connection', (socket) => {
  players[socket.id] = {
    id: socket.id,
    nickname: 'Célula',
    skin: 'skin1',
    x: rand(60, MAP_WIDTH - 60),
    y: rand(60, MAP_HEIGHT - 60),
    radius: START_RADIUS,
    score: 0,
    color: randomColor(),
    keys: { up: false, down: false, left: false, right: false },
    active: false
  };

  socket.emit('init', { id: socket.id });

  socket.on('joinGame', ({ nickname, skin }) => {
    const p = players[socket.id];
    if (p) {
      p.nickname = String(nickname || '').trim().slice(0, 14) || 'Célula';
      p.skin = String(skin || 'skin1');
      p.active = true;
    }
  });

  socket.on('playerMove', (keys) => {
    if (players[socket.id]) {
      players[socket.id].keys = keys;
    }
  });

  socket.on('disconnect', () => {
    delete players[socket.id];
  });
});

setInterval(() => {
  const ids = Object.keys(players);

  for (const id of ids) {
    const p = players[id];
    if (!p || !p.active) continue;

    const speed = Math.max(2.5, 6.2 - (p.radius - START_RADIUS) * 0.04);

    let dx = 0, dy = 0;
    if (p.keys.up) dy -= 1;
    if (p.keys.down) dy += 1;
    if (p.keys.left) dx -= 1;
    if (p.keys.right) dx += 1;

    if (dx !== 0 && dy !== 0) {
      dx *= 0.7071;
      dy *= 0.7071;
    }

    p.x = Math.max(p.radius, Math.min(MAP_WIDTH - p.radius, p.x + dx * speed));
    p.y = Math.max(p.radius, Math.min(MAP_HEIGHT - p.radius, p.y + dy * speed));

    for (let i = 0; i < orbs.length; i++) {
      const orb = orbs[i];
      const dist = Math.hypot(p.x - orb.x, p.y - orb.y);
      if (dist < p.radius + orb.radius) {
        p.score += 1;
        p.radius = calcRadius(p.score);
        orbs[i] = createOrb(orb.id);
      }
    }
  }

  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const a = players[ids[i]];
      const b = players[ids[j]];
      if (!a || !b || !a.active || !b.active) continue;

      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (a.radius > b.radius * 1.04 && dist < a.radius - b.radius * 0.25) {
        eatPlayer(a, b);
      } else if (b.radius > a.radius * 1.04 && dist < b.radius - a.radius * 0.25) {
        eatPlayer(b, a);
      }
    }
  }

  io.emit('stateUpdate', { players, orbs });
}, 1000 / 30);

function eatPlayer(predator, prey) {
  const stolen = Math.max(1, Math.floor(prey.score / 2));
  predator.score += stolen;
  predator.radius = calcRadius(predator.score);

  prey.score = Math.max(0, prey.score - stolen);
  prey.radius = calcRadius(prey.score);
  prey.x = rand(60, MAP_WIDTH - 60);
  prey.y = rand(60, MAP_HEIGHT - 60);

  io.emit('killFeed', `${predator.nickname} engoliu ${prey.nickname} (+${stolen} pts)!`);
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor Agar.io com Skins rodando na porta ${PORT}`);
});