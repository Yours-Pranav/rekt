const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = { x: 130, y: 450, width: 40, height: 40, color: "cyan" };
let obstacles = [];
let score = 0;
let gameOver = false;
let speed = 3;
let spawnTimer = 0;

// Draw player
function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Draw obstacles
function drawObstacles() {
  ctx.fillStyle = "red";
  for (let obs of obstacles) {
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
  }
}

// Move obstacles + check collision
function moveObstacles() {
  for (let obs of obstacles) {
    obs.y += speed;
    if (obs.y > canvas.height) {
      obstacles.splice(obstacles.indexOf(obs), 1);
      score++;
    }
    // Collision detection
    if (
      player.x < obs.x + obs.width &&
      player.x + player.width > obs.x &&
      player.y < obs.y + obs.height &&
      player.y + player.height > obs.y
    ) {
      gameOver = true;
    }
  }
}

// Spawn new obstacle
function spawnObstacle() {
  let obsWidth = 40;
  let obsX = Math.random() * (canvas.width - obsWidth);
  obstacles.push({ x: obsX, y: -40, width: obsWidth, height: 40 });
}

// Draw score
function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  ctx.fillText("Score: " + score, 10, 20);
}

// Main game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (gameOver) {
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over", 80, 250);
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 120, 280);
    return;
  }

  // Spawn obstacles every 80 frames
  spawnTimer++;
  if (spawnTimer > 80) {
    spawnObstacle();
    spawnTimer = 0;
  }

  moveObstacles();
  drawPlayer();
  drawObstacles();
  drawScore();
}

setInterval(gameLoop, 20);

// Keyboard Controls
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && player.x > 0) player.x -= 20;
  if (e.key === "ArrowRight" && player.x < canvas.width - player.width)
    player.x += 20;
});

// Touch Controls
let leftHeld = false;
let rightHeld = false;

document.getElementById("leftBtn").addEventListener("touchstart", () => {
  leftHeld = true;
});
document.getElementById("leftBtn").addEventListener("touchend", () => {
  leftHeld = false;
});

document.getElementById("rightBtn").addEventListener("touchstart", () => {
  rightHeld = true;
});
document.getElementById("rightBtn").addEventListener("touchend", () => {
  rightHeld = false;
});

// Continuous touch movement
setInterval(() => {
  if (leftHeld && player.x > 0) player.x -= 5;
  if (rightHeld && player.x < canvas.width - player.width) player.x += 5;
}, 20);
