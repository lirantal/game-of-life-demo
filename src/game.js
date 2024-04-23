let gameLoopIterations = 100;

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
      // add a border to the cells
      ctx.strokeStyle = "red";
      ctx.strokeRect(j * cellSize, i * cellSize, cellSize, cellSize);

      // fill the cell with black or white based on the cell value
      ctx.fillStyle = board[i][j] ? "black" : "white";
      ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
    }
  }
}

function updateBoard() {
  let newBoard = board.map((row) => [...row]);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let liveNeighbors = 0;
      for (let shadowRow = -1; shadowRow <= 1; shadowRow++) {
        for (let shadowCol = -1; shadowCol <= 1; shadowCol++) {
          if (shadowRow === 0 && shadowCol === 0) continue;
          let x = r + shadowRow;
          let y = c + shadowCol;
          if (x >= 0 && x < rows && y >= 0 && y < cols) {
            liveNeighbors += board[x][y];
          }
        }
      }
      if (board[r][c] === 1 && (liveNeighbors < 2 || liveNeighbors > 3)) {
        newBoard[r][c] = 0;
      } else if (board[r][c] === 0 && liveNeighbors === 3) {
        newBoard[r][c] = 1;
      }
    }
  }
  board = newBoard;
}

// Main loop
function gameLoop() {
  gameLoopIterations--;
  if (gameLoopIterations <= 0) {
    return;
  }

  setTimeout(() => {
    updateBoard();
    draw();
    requestAnimationFrame(gameLoop);
  }, 10);
}

initializeBoard();
gameLoop();
