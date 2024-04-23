/**
 * Conway's Game of Life
 *
 * Guidelines for 2 players:
 * - Cell types: Three types of cells will be present: Dead (0), Team A (1), Team B (2)
 * - Birth of cells: A dead cell becomes a live cell of a particular team if the majority of its three contributing neighbors are from one team. If there is a tie, the cell remains dead.
 * - Survival of cells: A cell remains alive if it has 2 or 3 live neighbors (similar to the standard Game of Life). If a live cell is surrounded by more cells from the opposing team than its own (and still within the 2 or 3 live neighbors rule), it converts to the opposing team's type in the next generation.
 * - Death of cells: A cell dies if it has fewer than 2 or more than 3 live neighbors, due to underpopulation or overpopulation.
 *
 */

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
