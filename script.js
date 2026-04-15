const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 400;

// Player
const player = {
  x: 100,
  y: 0,
  width: 40,
  height: 40,
  velX: 0,
  velY: 0,
  speed: 4,
  jumpForce: -10,
  grounded: false
};

// Física
const gravity = 0.5;

// Chão (plataforma)
const ground = {
  x: 0,
  y: 350,
  width: canvas.width,
  height: 50
};

// Controles
const keys = {};

document.addEventListener("keydown", (e) => {
  keys[e.key.toLowerCase()] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.key.toLowerCase()] = false;
});

// Loop do jogo
function update() {
  // Movimento horizontal
  if (keys["a"] || keys["arrowleft"]) {
    player.velX = -player.speed;
  } else if (keys["d"] || keys["arrowright"]) {
    player.velX = player.speed;
  } else {
    player.velX = 0;
  }

  // Pulo
  if ((keys["w"] || keys["arrowup"] || keys[" "]) && player.grounded) {
    player.velY = player.jumpForce;
    player.grounded = false;
  }

  // Gravidade
  player.velY += gravity;

  // Atualiza posição
  player.x += player.velX;
  player.y += player.velY;

  // Colisão com chão
  if (
    player.y + player.height >= ground.y &&
    player.x + player.width > ground.x &&
    player.x < ground.x + ground.width
  ) {
    player.y = ground.y - player.height;
    player.velY = 0;
    player.grounded = true;
  }

  // Limite lateral
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width)
    player.x = canvas.width - player.width;
}

// Renderização
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Chão
  ctx.fillStyle = "green";
  ctx.fillRect(ground.x, ground.y, ground.width, ground.height);

  // Player
  ctx.fillStyle = "red";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Loop principal
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();