const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const img = new Image()
img.src = './img/rato.gif';

canvas.width = 800;
canvas.height = 400;

// Player
const player = {
  x: 100,
  y: 0,
  width: 40,
  height: 40,
  raio: 30,
  velX: 0,
  velY: 0,
  speed: 4,
  jumpForce: 10.5,
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

//Obstaculo
const obstaculo = {
  x: canvas.width + 50,
  y: canvas.height - ground.height*2,
  height: 50,
  width: 35,
  velx: 0,
  speed: 2
};

// Controles
const keys = {};

document.addEventListener("keydown", (e) => {
  keys[e.key.toLowerCase()] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.key.toLowerCase()] = false;
});

let i = 0;
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
    player.velY = -player.jumpForce;
    player.grounded = false;
  }

  // Gravidade
  player.velY += gravity;

  // Atualiza posição
  player.x += player.velX;
  player.y += player.velY;

  if(i % 10 == 0)
    obstaculo.velx += obstaculo.speed;
  obstaculo.x -= obstaculo.velx;
  
  if(obstaculo.x + obstaculo.width + 10 < 0){
    obstaculo.x = canvas.width + 50;
    obstaculo.velx = 0;
  }

  // Colisão com chão
  if (
    player.y + player.raio >= ground.y &&
    player.x + player.raio > ground.x &&
    player.x < ground.x + ground.width
  ) {
    player.y = ground.y - player.raio;
    player.velY = 0;
    player.grounded = true;
  }

  // Colisão com Obstaculo

  if (
    player.x + player.raio >= obstaculo.x &&
    player.x + player.raio <= obstaculo.x + obstaculo.width
  )
  alert("Pão");

  // Limite lateral
  if (player.x - player.raio < 0) player.x = player.raio;
  if (player.x + player.raio > canvas.width)
    player.x = canvas.width - player.raio;

  i++;
}

// Renderização
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Chão
  ctx.fillStyle = "green";
  ctx.fillRect(ground.x, ground.y, ground.width, ground.height);

  // Player
  ctx.fillStyle = "red";
  // ctx.fillRect(player.x, player.y, player.width, player.height); Quadrado
  //Bola
  // ctx.beginPath();
  // ctx.arc(player.x, player.y, player.raio, 0, 2 * Math.PI);
  // ctx.fill();
  //rato
  ctx.drawImage(img, player.x - player.raio * 3, player.y - player.raio * 3);

  ctx.fillStyle = "black";
  ctx.fillRect(obstaculo.x, obstaculo.y, obstaculo.width, obstaculo.height);
}

// Loop principal
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();