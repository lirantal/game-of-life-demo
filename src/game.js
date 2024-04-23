let gameLoopIterations = 1000;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const cellSize = 10;
const rows = canvas.height / cellSize;
const cols = canvas.width / cellSize;
let board = Array.from({ length: rows }, () => Array(cols).fill(0));

// Initialize the board with random cells
function initializeBoard() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      board[i][j] = Math.floor(Math.random() * 2);
    }
  }
}

// Draw the board
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      ctx.fillStyle = board[i][j] ? "black" : "white";
      ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
    }
  }
}

// Update the board based on Game of Life rules
function updateBoard() {
  let newBoard = board.map((arr) => [...arr]);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let liveNeighbors = 0;
      for (let m = -1; m < 2; m++) {
        for (let n = -1; n < 2; n++) {
          if (m === 0 && n === 0) continue;
          let x = i + m;
          let y = j + n;
          if (x >= 0 && x < rows && y >= 0 && y < cols) {
            liveNeighbors += board[x][y];
          }
        }
      }
      if (board[i][j] === 1 && (liveNeighbors < 2 || liveNeighbors > 3)) {
        newBoard[i][j] = 0;
      } else if (board[i][j] === 0 && liveNeighbors === 3) {
        newBoard[i][j] = 1;
      }
    }
  }
  board = newBoard;
}

// Main loop
function gameLoop() {
  updateBoard();
  draw();
  requestAnimationFrame(gameLoop);
}

initializeBoard();
gameLoop();
