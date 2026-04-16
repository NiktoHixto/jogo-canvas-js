import { world } from "./world.js";
import "./ui.js";

// ======================
// CONFIGURAÇÃO
// ======================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 400;

const gravity = 0.5;

// ======================
// ASSETS
// ======================
const imgPlayer = new Image();
const imgObstaculo = new Image();

imgPlayer.src = "../img/rato.gif";
imgObstaculo.src = "../img/Espinho.png";

// ======================
// ENTIDADES
// ======================
const player = {
  x: 100,
  y: 0,
  raio: 30,
  velX: 0,
  velY: 0,
  speed: 4,
  jumpForce: 10.5,
  grounded: false
};

const ground = {
  x: 0,
  y: 350,
  width: canvas.width,
  height: 50
};

const obstaculo = {
  x: canvas.width + 50,
  y: canvas.height - ground.height * 2,
  width: 35,
  height: 50,
  velX: 0,
  speed: 2
};

// ======================
// CONTROLES
// ======================
const keys = {};

document.addEventListener("keydown", (e) => {
  keys[e.key.toLowerCase()] = true;

  // Restart com R
  if (e.key.toLowerCase() === "r" && world.lost) {
    resetGame();}
  });

  document.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
});

// ======================
// LÓGICA DO JOGO
// ======================
let frame = 0;

function updatePlayer() {
  if (world.lost) return;

  if (keys["a"] || keys["arrowleft"]) {
    player.velX = -player.speed;
  } else if (keys["d"] || keys["arrowright"]) {
    player.velX = player.speed;
  } else {
    player.velX = 0;
  }

  if ((keys["w"] || keys["arrowup"] || keys[" "]) && player.grounded) {
    player.velY = -player.jumpForce;
    player.grounded = false;
  }

  player.velY += gravity;

  player.x += player.velX;
  player.y += player.velY;

  // Limites
  if (player.x - player.raio < 0) player.x = player.raio;
  if (player.x + player.raio > canvas.width) {
    player.x = canvas.width - player.raio;
  }
}

function updateObstaculo() {
  if (world.lost) return;

  if (frame % 10 === 0) {
    obstaculo.velX += obstaculo.speed;
  }

  obstaculo.x -= obstaculo.velX;

  if (obstaculo.x + obstaculo.width < 0) {
    obstaculo.x = canvas.width + 50;
    obstaculo.velX = 0;
    world.score++;
  }
}

function checkGroundCollision() {
  if (
    player.y + player.raio >= ground.y &&
    player.x + player.raio > ground.x &&
    player.x < ground.x + ground.width
  ) {
    player.y = ground.y - player.raio;
    player.velY = 0;
    player.grounded = true;
}
}

function checkObstacleCollision() {
  if (world.lost) return;

  if (
    player.x + player.raio >= obstaculo.x &&
    player.x - player.raio <= obstaculo.x + obstaculo.width &&
    player.y + player.raio >= obstaculo.y &&
    player.y - player.raio <= obstaculo.y + obstaculo.height
  ) {
    world.lost = true;
}
}

function updateSystem() {
  if (!world.lost) {
  world.time += 1 / 60;
}
}

function update() {
  updatePlayer();
  updateObstaculo();
  updateSystem();
  checkGroundCollision();
  checkObstacleCollision();

  frame++;
}

// ======================
// RENDERIZAÇÃO
// ======================
function drawGround() {
  ctx.fillStyle = "green";
  ctx.fillRect(ground.x, ground.y, ground.width, ground.height);
}

function drawPlayer() {
  ctx.drawImage(
  imgPlayer,
  player.x - player.raio * 3,
  player.y - player.raio * 3
  );
}

function drawObstaculo() {
  ctx.drawImage(
  imgObstaculo,
  obstaculo.x - obstaculo.width * 0.4,
  obstaculo.y - obstaculo.height * 0.4,
  obstaculo.width * 1.8,
  obstaculo.height * 1.5
);
}

function drawGameOver() {
  if (!world.lost) return;

  ctx.fillStyle = "red";
  ctx.font = "40px Arial";
  ctx.fillText("GAME OVER", 260, 200);

  ctx.font = "20px Arial";
  ctx.fillText("Pressione R para reiniciar", 250, 240);
  }

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGround();
  drawPlayer();
  drawObstaculo();
  drawGameOver();
}

// ======================
// RESET
// ======================
function resetGame() {
  world.score = 0;
  world.time = 0;
  world.lost = false;

  player.x = 100;
  player.y = 0;
  player.velX = 0;
  player.velY = 0;

  obstaculo.x = canvas.width + 50;
  obstaculo.velX = 0;

  frame = 0;
}

// ======================
// LOOP PRINCIPAL
// ======================
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();