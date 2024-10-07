const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 320;
canvas.height = 480;

// Game variables
let birdX = 50;
let birdY = 150;
let birdWidth = 30;
let birdHeight = 30;
let gravity = 0.6;
let lift = -10;
let velocity = 0;
let score = 0;

// Pipe variables
let pipeWidth = 40;
let pipeGap = 120;
let pipes = [];
let pipeFrequency = 100; // frames

// Load images (optional)
const birdImage = new Image();
birdImage.src = 'https://i.imgur.com/aJzkcML.png'; // Bird image

// Create initial pipes
function createPipe() {
  const pipeHeight = Math.random() * (canvas.height / 2) + 50;
  pipes.push({
    x: canvas.width,
    y: pipeHeight,
    gap: pipeGap
  });
}

// Handle bird jump
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    velocity = lift;
  }
});

// Game loop
function gameLoop() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw bird
  ctx.drawImage(birdImage, birdX, birdY, birdWidth, birdHeight);

  // Bird physics
  velocity += gravity;
  birdY += velocity;

  // Pipe creation and movement
  if (score % pipeFrequency === 0) {
    createPipe();
  }

  pipes.forEach((pipe, index) => {
    // Move pipes
    pipe.x -= 2;

    // Draw pipes
    ctx.fillStyle = '#333';
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.y);
    ctx.fillRect(pipe.x, pipe.y + pipe.gap, pipeWidth, canvas.height);

    // Check for collisions
    if (
      birdX < pipe.x + pipeWidth &&
      birdX + birdWidth > pipe.x &&
      (birdY < pipe.y || birdY + birdHeight > pipe.y + pipe.gap)
    ) {
      resetGame();
    }

    // Remove off-screen pipes
    if (pipe.x + pipeWidth < 0) {
      pipes.splice(index, 1);
      score++;
    }
  });

  // Prevent bird from going off-screen
  if (birdY + birdHeight > canvas.height || birdY < 0) {
    resetGame();
  }

  // Score and frame counter
  score++;

  // Update the game again
  requestAnimationFrame(gameLoop);
}

// Reset game
function resetGame() {
  birdY = 150;
  velocity = 0;
  pipes = [];
  score = 0;
}

// Start game
gameLoop();
