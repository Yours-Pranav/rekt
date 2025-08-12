const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Car properties
let car = { x: 130, y: 400, width: 40, height: 70, speed: 5 };

// Obstacles
let obstacles = [];
let score = 0;

// Keys pressed
let keys = { left: false, right: false };

// Spawn obstacles
function spawnObstacle() {
  let width = 40;
  let x = Math.random() * (canvas.width - width);
  obstacles.push({ x, y: -50, width, height: 50, speed: 3 });
}

// Draw car
function drawCar() {
  ctx.fillStyle = "red";
  ctx.fillRect(car.x, car.y, car.width, car.height);
}

// Draw obstacles
function drawObstacles() {
  ctx.fillStyle = "gray";
  obstacles.forEach(obs => {
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
  });
}

// Update game
function update() {
  if (keys.left && car.x > 0) car.x -= car.speed;
  if (keys.right && car.x + car.width < canvas.width) car.x += car.speed;

  // Move obstacles
  obstacles.forEach(obs => obs.y += obs.speed);

  // Remove off-screen
  obstacles = obstacles.filter(obs => {
    if (obs.y > canvas.height) {
      score++;
      return false;
    }
    return true;
  });

  // Collision detection
  obstacles.forEach(obs => {
    if (
      car.x < obs.x + obs.width &&
      car.x + car.width > obs.x &&
      car.y < obs.y + obs.height &&
      car.y + car.height > obs.y
    ) {
      alert(`Game Over! Score: ${score}`);
      resetGame();
    }
  });
}

// Reset game
function resetGame() {
  car.x = 130;
  obstacles = [];
  score = 0;
}

// Main loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCar();
  drawObstacles();
  update();
  requestAnimationFrame(gameLoop);
}

// Key events
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") keys.left = true;
  if (e.key === "ArrowRight") keys.right = true;
});
document.addEventListener("keyup", e => {
  if (e.key === "ArrowLeft") keys.left = false;
  if (e.key === "ArrowRight") keys.right = false;
});

// Touch controls
document.getElementById("leftBtn").addEventListener("touchstart", () => keys.left = true);
document.getElementById("leftBtn").addEventListener("touchend", () => keys.left = false);
document.getElementById("rightBtn").addEventListener("touchstart", () => keys.right = true);
document.getElementById("rightBtn").addEventListener("touchend", () => keys.right = false);

// Spawn obstacles every 1.2 sec
setInterval(spawnObstacle, 1200);

// Start game
gameLoop();
