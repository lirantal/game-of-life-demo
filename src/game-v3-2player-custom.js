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

const GAME_LOOP_ITERATIONS = 1000;
const GAME_SPEED = 5;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const cellSize = 10;
const rows = canvas.height / cellSize;
const cols = canvas.width / cellSize;
let board = Array.from({ length: rows }, () => Array(cols).fill(0));

// Initialize the board with random cells so that the rows / cols grid
// is split between team A and team B horizontally (rows) and random
// generation of cells for each team is limited to their respective half
function initializeBoard() {
  // Statistics to keep track of
  let cellsCountPerEachTeam = {};

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (r < rows / 2 - 1) {
        // Team A's half
        let deadOrAlive = Math.floor(Math.random() * 2);
        board[r][c] = deadOrAlive === 0 ? 1 : 0;
        cellsCountPerEachTeam.teamA =
          (cellsCountPerEachTeam.teamA || 0) + deadOrAlive;
      }

      if (r > rows / 2 + 1) {
        // Team B's half
        let deadOrAlive = Math.floor(Math.random() * 2);
        board[r][c] = deadOrAlive === 0 ? 2 : 0;
        cellsCountPerEachTeam.teamB =
          (cellsCountPerEachTeam.teamB || 0) + deadOrAlive;
      }
    }
  }

  console.log("Initial cells count per each team: ", cellsCountPerEachTeam);
}

// Draw the board
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Add a border to the cells
      ctx.strokeStyle = "black";
      ctx.strokeRect(c * cellSize, r * cellSize, cellSize, cellSize);

      // Fill the board with cells based on each team's color of the cell's value
      ctx.fillStyle =
        board[r][c] === 1 ? "blue" : board[r][c] === 2 ? "red" : "white";
      ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
    }
  }
}

function updateBoard() {
  let newBoard = board.map((row) => [...row]);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Calculate the number of live neighbors for each team across all 8 directions of a given cell in r,c
      let liveNeighbors = { total: 0, teamA: 0, teamB: 0 };
      for (let shadowRow = -1; shadowRow <= 1; shadowRow++) {
        for (let shadowCol = -1; shadowCol <= 1; shadowCol++) {
          if (shadowRow === 0 && shadowCol === 0) continue;
          let x = r + shadowRow;
          let y = c + shadowCol;

          if (x >= 0 && x < rows && y >= 0 && y < cols) {
            if (board[x][y] !== 0) {
              liveNeighbors.total++;

              if (board[x][y] === 1) {
                liveNeighbors.teamA++;
              } else {
                liveNeighbors.teamB++;
              }
            }
          }
        }
      }

      // Next, we update the board based on the rules of the game
      let currentCell = board[r][c];
      if (currentCell === 0) {
        // A dead cell becomes a live cell of a particular team if the majority of its three contributing neighbors are from one team:
        if (liveNeighbors.teamA === 3 && liveNeighbors.teamB < 3) {
          newBoard[r][c] = 1;
        } else if (liveNeighbors.teamB === 3 && liveNeighbors.teamA < 3) {
          newBoard[r][c] = 2;
        }
        // Otherwise, there's a tie between the teams, so the cell remains dead
      } else {
        // Now we're dealing with living cells, and so;
        // The cell dies from under/overpopulation, regardless of team
        if (liveNeighbors.total < 2 || liveNeighbors.total > 3) {
          newBoard[r][c] = 0;
        } else {
          // Check which team has the majority of live neighbors and they win the cell
          if (currentCell === 1 && liveNeighbors.teamB > liveNeighbors.teamA) {
            newBoard[r][c] = 2;
          } else if (
            currentCell === 2 &&
            liveNeighbors.teamA > liveNeighbors.teamB
          ) {
            newBoard[r][c] = 1;
          }
        }
      }
    }
  }
  board = newBoard;
}

let gameLoopIterationsCounter = 0;

// Main loop
function gameLoop() {
  if (gameLoopIterationsCounter >= GAME_LOOP_ITERATIONS) {
    return;
  }

  gameLoopIterationsCounter++;

  setTimeout(() => {
    updateBoard();
    draw();
    requestAnimationFrame(gameLoop);
  }, GAME_SPEED);
}

initializeBoard();
gameLoop();
