const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const startBtn = document.getElementById("startBtn");
const mintBtn = document.getElementById("mintBtn");

canvas.width = 300;
canvas.height = 500;

let player = { x: 140, y: 450, width: 20, height: 40 };
let enemies = [];
let score = 0;
let gameRunning = false;
let gameLoop;

function startGame() {
  enemies = [];
  score = 0;
  gameRunning = true;
  startBtn.disabled = true;
  mintBtn.disabled = true;
  gameLoop = setInterval(updateGame, 50);
}

function updateGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#00ffcc";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  if (Math.random() < 0.05) {
    enemies.push({ x: Math.random() * 280, y: -20, width: 20, height: 20 });
  }

  ctx.fillStyle = "#ff0057";
  enemies.forEach(e => {
    e.y += 5;
    ctx.fillRect(e.x, e.y, e.width, e.height);
  });

  enemies = enemies.filter(e => e.y < 500);

  enemies.forEach(e => {
    if (
      player.x < e.x + e.width &&
      player.x + player.width > e.x &&
      player.y < e.y + e.height &&
      player.y + player.height > e.y
    ) {
      endGame();
    }
  });

  score++;
  scoreDisplay.textContent = "Score: " + score;
}

function endGame() {
  clearInterval(gameLoop);
  gameRunning = false;
  startBtn.disabled = false;
  mintBtn.disabled = false;
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && player.x > 0) player.x -= 20;
  if (e.key === "ArrowRight" && player.x < canvas.width - player.width)
    player.x += 20;
});

startBtn.addEventListener("click", startGame);
mintBtn.addEventListener("click", mintNFT);

async function mintNFT() {
  if (!window.ethereum) return alert("Install MetaMask");

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();

  const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
  const abi = [
    "function mintScoreNFT(address to, uint256 score) public returns (uint256)"
  ];

  const contract = new ethers.Contract(contractAddress, abi, signer);
  try {
    let tx = await contract.mintScoreNFT(await signer.getAddress(), score);
    await tx.wait();
    alert("NFT Minted! Score: " + score);
  } catch (err) {
    console.error(err);
    alert("Mint failed");
  }
}
