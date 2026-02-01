/**
 * Preset Mazes - Multiple complex maze layouts with zig-zags, branches, loops, and misleading turns
 * Same structure as current maze, but with more complex navigation paths
 */

const gridSize = 5;
const cellId = (x, y) => `c-${x}-${y}`;
const startCellId = cellId(0, 2);
const exitCellId = cellId(4, 2);

/**
 * Helper to create a path object
 */
const createPath = (fromId, toId, answerNumber, isCorrectEdge) => {
  const from = { x: Number(fromId.split("-")[1]), y: Number(fromId.split("-")[2]) };
  const to = { x: Number(toId.split("-")[1]), y: Number(toId.split("-")[2]) };
  const isDiagonal = Math.abs(to.x - from.x) === 1 && Math.abs(to.y - from.y) === 1;
  return {
    fromCellId: fromId,
    toCellId: toId,
    answerNumber,
    isDiagonal,
    isCorrectEdge,
  };
};

// Maze 1: Zig-zag with many turns
const maze1 = {
  gridSize,
  startCellId,
  exitCellId,
  solutionPath: [
    cellId(0, 2), // start
    cellId(1, 1),
    cellId(0, 0),
    cellId(1, 0),
    cellId(2, 1),
    cellId(3, 0),
    cellId(4, 1),
    cellId(3, 2),
    cellId(2, 3),
    cellId(3, 4),
    cellId(4, 3),
    cellId(4, 2), // exit
  ],
  paths: [
    // Solution path
    createPath(cellId(0, 2), cellId(1, 1), 0, true),
    createPath(cellId(1, 1), cellId(0, 0), 0, true),
    createPath(cellId(0, 0), cellId(1, 0), 0, true),
    createPath(cellId(1, 0), cellId(2, 1), 0, true),
    createPath(cellId(2, 1), cellId(3, 0), 0, true),
    createPath(cellId(3, 0), cellId(4, 1), 0, true),
    createPath(cellId(4, 1), cellId(3, 2), 0, true),
    createPath(cellId(3, 2), cellId(2, 3), 0, true),
    createPath(cellId(2, 3), cellId(3, 4), 0, true),
    createPath(cellId(3, 4), cellId(4, 3), 0, true),
    createPath(cellId(4, 3), cellId(4, 2), 0, true),
    // Wrong paths
    createPath(cellId(0, 2), cellId(0, 1), 0, false),
    createPath(cellId(0, 2), cellId(0, 3), 0, false),
    createPath(cellId(1, 1), cellId(2, 0), 0, false),
    createPath(cellId(1, 1), cellId(1, 2), 0, false),
    createPath(cellId(0, 0), cellId(0, 1), 0, false),
    createPath(cellId(1, 0), cellId(0, 1), 0, false),
    createPath(cellId(2, 1), cellId(1, 1), 0, false),
    createPath(cellId(2, 1), cellId(3, 1), 0, false),
    createPath(cellId(3, 0), cellId(2, 0), 0, false),
    createPath(cellId(4, 1), cellId(4, 0), 0, false),
    createPath(cellId(3, 2), cellId(3, 1), 0, false),
    createPath(cellId(3, 2), cellId(4, 3), 0, false),
    createPath(cellId(2, 3), cellId(1, 3), 0, false),
    createPath(cellId(2, 3), cellId(3, 3), 0, false),
    createPath(cellId(3, 4), cellId(2, 4), 0, false),
    createPath(cellId(4, 3), cellId(3, 3), 0, false),
  ],
};

// Maze 2: Branching with loops
const maze2 = {
  gridSize,
  startCellId,
  exitCellId,
  solutionPath: [
    cellId(0, 2), // start
    cellId(0, 3),
    cellId(1, 4),
    cellId(2, 3),
    cellId(1, 2),
    cellId(2, 1),
    cellId(3, 0),
    cellId(4, 1),
    cellId(3, 2),
    cellId(2, 2),
    cellId(3, 3),
    cellId(4, 2), // exit
  ],
  paths: [
    // Solution path
    createPath(cellId(0, 2), cellId(0, 3), 0, true),
    createPath(cellId(0, 3), cellId(1, 4), 0, true),
    createPath(cellId(1, 4), cellId(2, 3), 0, true),
    createPath(cellId(2, 3), cellId(1, 2), 0, true),
    createPath(cellId(1, 2), cellId(2, 1), 0, true),
    createPath(cellId(2, 1), cellId(3, 0), 0, true),
    createPath(cellId(3, 0), cellId(4, 1), 0, true),
    createPath(cellId(4, 1), cellId(3, 2), 0, true),
    createPath(cellId(3, 2), cellId(2, 2), 0, true),
    createPath(cellId(2, 2), cellId(3, 3), 0, true),
    createPath(cellId(3, 3), cellId(4, 2), 0, true),
    // Wrong paths
    createPath(cellId(0, 2), cellId(0, 1), 0, false),
    createPath(cellId(0, 2), cellId(1, 2), 0, false),
    createPath(cellId(0, 3), cellId(0, 4), 0, false),
    createPath(cellId(1, 4), cellId(0, 4), 0, false),
    createPath(cellId(2, 3), cellId(1, 3), 0, false),
    createPath(cellId(2, 3), cellId(3, 3), 0, false),
    createPath(cellId(1, 2), cellId(0, 2), 0, false),
    createPath(cellId(1, 2), cellId(2, 2), 0, false),
    createPath(cellId(2, 1), cellId(1, 1), 0, false),
    createPath(cellId(2, 1), cellId(3, 1), 0, false),
    createPath(cellId(3, 0), cellId(2, 0), 0, false),
    createPath(cellId(4, 1), cellId(4, 0), 0, false),
    createPath(cellId(3, 2), cellId(3, 1), 0, false),
    createPath(cellId(3, 2), cellId(4, 3), 0, false),
    createPath(cellId(2, 2), cellId(1, 2), 0, false),
    createPath(cellId(3, 3), cellId(2, 3), 0, false),
  ],
};

// Maze 3: Spiral with misleading turns
const maze3 = {
  gridSize,
  startCellId,
  exitCellId,
  solutionPath: [
    cellId(0, 2), // start
    cellId(1, 1),
    cellId(2, 0),
    cellId(3, 1),
    cellId(4, 0),
    cellId(3, 1), // loop back
    cellId(2, 2),
    cellId(1, 3),
    cellId(0, 4),
    cellId(1, 4),
    cellId(2, 3),
    cellId(3, 4),
    cellId(4, 3),
    cellId(4, 2), // exit
  ],
  paths: [
    // Solution path
    createPath(cellId(0, 2), cellId(1, 1), 0, true),
    createPath(cellId(1, 1), cellId(2, 0), 0, true),
    createPath(cellId(2, 0), cellId(3, 1), 0, true),
    createPath(cellId(3, 1), cellId(4, 0), 0, true),
    createPath(cellId(4, 0), cellId(3, 1), 0, true),
    createPath(cellId(3, 1), cellId(2, 2), 0, true),
    createPath(cellId(2, 2), cellId(1, 3), 0, true),
    createPath(cellId(1, 3), cellId(0, 4), 0, true),
    createPath(cellId(0, 4), cellId(1, 4), 0, true),
    createPath(cellId(1, 4), cellId(2, 3), 0, true),
    createPath(cellId(2, 3), cellId(3, 4), 0, true),
    createPath(cellId(3, 4), cellId(4, 3), 0, true),
    createPath(cellId(4, 3), cellId(4, 2), 0, true),
    // Wrong paths
    createPath(cellId(0, 2), cellId(0, 1), 0, false),
    createPath(cellId(0, 2), cellId(1, 2), 0, false),
    createPath(cellId(1, 1), cellId(0, 0), 0, false),
    createPath(cellId(1, 1), cellId(2, 1), 0, false),
    createPath(cellId(2, 0), cellId(1, 0), 0, false),
    createPath(cellId(3, 1), cellId(4, 1), 0, false),
    createPath(cellId(3, 1), cellId(3, 2), 0, false),
    createPath(cellId(4, 0), cellId(4, 1), 0, false),
    createPath(cellId(2, 2), cellId(1, 2), 0, false),
    createPath(cellId(2, 2), cellId(3, 2), 0, false),
    createPath(cellId(1, 3), cellId(0, 3), 0, false),
    createPath(cellId(1, 3), cellId(2, 3), 0, false),
    createPath(cellId(0, 4), cellId(0, 3), 0, false),
    createPath(cellId(1, 4), cellId(0, 4), 0, false),
    createPath(cellId(2, 3), cellId(1, 3), 0, false),
    createPath(cellId(3, 4), cellId(2, 4), 0, false),
    createPath(cellId(4, 3), cellId(3, 3), 0, false),
  ],
};

// Maze 4: Complex branching with many dead ends
const maze4 = {
  gridSize,
  startCellId,
  exitCellId,
  solutionPath: [
    cellId(0, 2), // start
    cellId(0, 1),
    cellId(1, 0),
    cellId(2, 1),
    cellId(1, 2),
    cellId(0, 3),
    cellId(1, 4),
    cellId(2, 3),
    cellId(3, 4),
    cellId(4, 3),
    cellId(3, 2),
    cellId(4, 2), // exit
  ],
  paths: [
    // Solution path
    createPath(cellId(0, 2), cellId(0, 1), 0, true),
    createPath(cellId(0, 1), cellId(1, 0), 0, true),
    createPath(cellId(1, 0), cellId(2, 1), 0, true),
    createPath(cellId(2, 1), cellId(1, 2), 0, true),
    createPath(cellId(1, 2), cellId(0, 3), 0, true),
    createPath(cellId(0, 3), cellId(1, 4), 0, true),
    createPath(cellId(1, 4), cellId(2, 3), 0, true),
    createPath(cellId(2, 3), cellId(3, 4), 0, true),
    createPath(cellId(3, 4), cellId(4, 3), 0, true),
    createPath(cellId(4, 3), cellId(3, 2), 0, true),
    createPath(cellId(3, 2), cellId(4, 2), 0, true),
    // Wrong paths
    createPath(cellId(0, 2), cellId(1, 2), 0, false),
    createPath(cellId(0, 2), cellId(0, 3), 0, false),
    createPath(cellId(0, 1), cellId(0, 0), 0, false),
    createPath(cellId(1, 0), cellId(0, 0), 0, false),
    createPath(cellId(1, 0), cellId(2, 0), 0, false),
    createPath(cellId(2, 1), cellId(1, 1), 0, false),
    createPath(cellId(2, 1), cellId(3, 1), 0, false),
    createPath(cellId(1, 2), cellId(0, 2), 0, false),
    createPath(cellId(1, 2), cellId(2, 2), 0, false),
    createPath(cellId(0, 3), cellId(0, 4), 0, false),
    createPath(cellId(1, 4), cellId(0, 4), 0, false),
    createPath(cellId(2, 3), cellId(1, 3), 0, false),
    createPath(cellId(3, 4), cellId(2, 4), 0, false),
    createPath(cellId(4, 3), cellId(3, 3), 0, false),
    createPath(cellId(3, 2), cellId(3, 1), 0, false),
  ],
};

// Maze 5: Twisting path with loops
const maze5 = {
  gridSize,
  startCellId,
  exitCellId,
  solutionPath: [
    cellId(0, 2), // start
    cellId(1, 3),
    cellId(2, 4),
    cellId(3, 3),
    cellId(2, 2),
    cellId(1, 1),
    cellId(2, 0),
    cellId(3, 1),
    cellId(2, 2), // loop back
    cellId(3, 3),
    cellId(4, 2), // exit
  ],
  paths: [
    // Solution path
    createPath(cellId(0, 2), cellId(1, 3), 0, true),
    createPath(cellId(1, 3), cellId(2, 4), 0, true),
    createPath(cellId(2, 4), cellId(3, 3), 0, true),
    createPath(cellId(3, 3), cellId(2, 2), 0, true),
    createPath(cellId(2, 2), cellId(1, 1), 0, true),
    createPath(cellId(1, 1), cellId(2, 0), 0, true),
    createPath(cellId(2, 0), cellId(3, 1), 0, true),
    createPath(cellId(3, 1), cellId(2, 2), 0, true),
    createPath(cellId(2, 2), cellId(3, 3), 0, true),
    createPath(cellId(3, 3), cellId(4, 2), 0, true),
    // Wrong paths
    createPath(cellId(0, 2), cellId(0, 1), 0, false),
    createPath(cellId(0, 2), cellId(1, 2), 0, false),
    createPath(cellId(1, 3), cellId(0, 3), 0, false),
    createPath(cellId(1, 3), cellId(1, 4), 0, false),
    createPath(cellId(2, 4), cellId(1, 4), 0, false),
    createPath(cellId(2, 4), cellId(3, 4), 0, false),
    createPath(cellId(3, 3), cellId(4, 3), 0, false),
    createPath(cellId(3, 3), cellId(4, 4), 0, false),
    createPath(cellId(2, 2), cellId(1, 2), 0, false),
    createPath(cellId(2, 2), cellId(3, 2), 0, false),
    createPath(cellId(1, 1), cellId(0, 0), 0, false),
    createPath(cellId(1, 1), cellId(2, 1), 0, false),
    createPath(cellId(2, 0), cellId(1, 0), 0, false),
    createPath(cellId(3, 1), cellId(3, 0), 0, false),
    createPath(cellId(3, 1), cellId(4, 1), 0, false),
  ],
};

// Maze 6: Long winding path
const maze6 = {
  gridSize,
  startCellId,
  exitCellId,
  solutionPath: [
    cellId(0, 2), // start
    cellId(0, 1),
    cellId(1, 0),
    cellId(2, 0),
    cellId(3, 1),
    cellId(4, 0),
    cellId(3, 1), // back
    cellId(2, 2),
    cellId(1, 3),
    cellId(0, 4),
    cellId(1, 4),
    cellId(2, 3),
    cellId(3, 4),
    cellId(4, 3),
    cellId(4, 2), // exit
  ],
  paths: [
    // Solution path
    createPath(cellId(0, 2), cellId(0, 1), 0, true),
    createPath(cellId(0, 1), cellId(1, 0), 0, true),
    createPath(cellId(1, 0), cellId(2, 0), 0, true),
    createPath(cellId(2, 0), cellId(3, 1), 0, true),
    createPath(cellId(3, 1), cellId(4, 0), 0, true),
    createPath(cellId(4, 0), cellId(3, 1), 0, true),
    createPath(cellId(3, 1), cellId(2, 2), 0, true),
    createPath(cellId(2, 2), cellId(1, 3), 0, true),
    createPath(cellId(1, 3), cellId(0, 4), 0, true),
    createPath(cellId(0, 4), cellId(1, 4), 0, true),
    createPath(cellId(1, 4), cellId(2, 3), 0, true),
    createPath(cellId(2, 3), cellId(3, 4), 0, true),
    createPath(cellId(3, 4), cellId(4, 3), 0, true),
    createPath(cellId(4, 3), cellId(4, 2), 0, true),
    // Wrong paths
    createPath(cellId(0, 2), cellId(1, 2), 0, false),
    createPath(cellId(0, 2), cellId(0, 3), 0, false),
    createPath(cellId(0, 1), cellId(0, 0), 0, false),
    createPath(cellId(1, 0), cellId(0, 0), 0, false),
    createPath(cellId(2, 0), cellId(2, 1), 0, false),
    createPath(cellId(3, 1), cellId(3, 0), 0, false),
    createPath(cellId(3, 1), cellId(4, 1), 0, false),
    createPath(cellId(4, 0), cellId(4, 1), 0, false),
    createPath(cellId(2, 2), cellId(1, 2), 0, false),
    createPath(cellId(2, 2), cellId(3, 2), 0, false),
    createPath(cellId(1, 3), cellId(0, 3), 0, false),
    createPath(cellId(1, 3), cellId(2, 3), 0, false),
    createPath(cellId(0, 4), cellId(0, 3), 0, false),
    createPath(cellId(1, 4), cellId(0, 4), 0, false),
    createPath(cellId(2, 3), cellId(1, 3), 0, false),
    createPath(cellId(3, 4), cellId(2, 4), 0, false),
    createPath(cellId(4, 3), cellId(3, 3), 0, false),
  ],
};

// Maze 7: S-curve with branches
const maze7 = {
  gridSize,
  startCellId,
  exitCellId,
  solutionPath: [
    cellId(0, 2), // start
    cellId(1, 1),
    cellId(2, 0),
    cellId(3, 1),
    cellId(2, 2),
    cellId(1, 3),
    cellId(0, 4),
    cellId(1, 4),
    cellId(2, 3),
    cellId(3, 4),
    cellId(4, 3),
    cellId(4, 2), // exit
  ],
  paths: [
    // Solution path
    createPath(cellId(0, 2), cellId(1, 1), 0, true),
    createPath(cellId(1, 1), cellId(2, 0), 0, true),
    createPath(cellId(2, 0), cellId(3, 1), 0, true),
    createPath(cellId(3, 1), cellId(2, 2), 0, true),
    createPath(cellId(2, 2), cellId(1, 3), 0, true),
    createPath(cellId(1, 3), cellId(0, 4), 0, true),
    createPath(cellId(0, 4), cellId(1, 4), 0, true),
    createPath(cellId(1, 4), cellId(2, 3), 0, true),
    createPath(cellId(2, 3), cellId(3, 4), 0, true),
    createPath(cellId(3, 4), cellId(4, 3), 0, true),
    createPath(cellId(4, 3), cellId(4, 2), 0, true),
    // Wrong paths
    createPath(cellId(0, 2), cellId(0, 1), 0, false),
    createPath(cellId(0, 2), cellId(1, 2), 0, false),
    createPath(cellId(1, 1), cellId(0, 0), 0, false),
    createPath(cellId(1, 1), cellId(2, 1), 0, false),
    createPath(cellId(2, 0), cellId(1, 0), 0, false),
    createPath(cellId(3, 1), cellId(3, 0), 0, false),
    createPath(cellId(3, 1), cellId(4, 1), 0, false),
    createPath(cellId(2, 2), cellId(1, 2), 0, false),
    createPath(cellId(2, 2), cellId(3, 2), 0, false),
    createPath(cellId(1, 3), cellId(0, 3), 0, false),
    createPath(cellId(1, 3), cellId(2, 3), 0, false),
    createPath(cellId(0, 4), cellId(0, 3), 0, false),
    createPath(cellId(1, 4), cellId(0, 4), 0, false),
    createPath(cellId(2, 3), cellId(1, 3), 0, false),
    createPath(cellId(3, 4), cellId(2, 4), 0, false),
    createPath(cellId(4, 3), cellId(3, 3), 0, false),
  ],
};

// Maze 8: Complex with many misleading branches
const maze8 = {
  gridSize,
  startCellId,
  exitCellId,
  solutionPath: [
    cellId(0, 2), // start
    cellId(0, 3),
    cellId(1, 4),
    cellId(2, 3),
    cellId(1, 2),
    cellId(0, 1),
    cellId(1, 0),
    cellId(2, 1),
    cellId(3, 0),
    cellId(4, 1),
    cellId(3, 2),
    cellId(4, 2), // exit
  ],
  paths: [
    // Solution path
    createPath(cellId(0, 2), cellId(0, 3), 0, true),
    createPath(cellId(0, 3), cellId(1, 4), 0, true),
    createPath(cellId(1, 4), cellId(2, 3), 0, true),
    createPath(cellId(2, 3), cellId(1, 2), 0, true),
    createPath(cellId(1, 2), cellId(0, 1), 0, true),
    createPath(cellId(0, 1), cellId(1, 0), 0, true),
    createPath(cellId(1, 0), cellId(2, 1), 0, true),
    createPath(cellId(2, 1), cellId(3, 0), 0, true),
    createPath(cellId(3, 0), cellId(4, 1), 0, true),
    createPath(cellId(4, 1), cellId(3, 2), 0, true),
    createPath(cellId(3, 2), cellId(4, 2), 0, true),
    // Wrong paths
    createPath(cellId(0, 2), cellId(0, 1), 0, false),
    createPath(cellId(0, 2), cellId(1, 2), 0, false),
    createPath(cellId(0, 3), cellId(0, 4), 0, false),
    createPath(cellId(1, 4), cellId(0, 4), 0, false),
    createPath(cellId(2, 3), cellId(1, 3), 0, false),
    createPath(cellId(2, 3), cellId(3, 3), 0, false),
    createPath(cellId(1, 2), cellId(0, 2), 0, false),
    createPath(cellId(1, 2), cellId(2, 2), 0, false),
    createPath(cellId(0, 1), cellId(0, 0), 0, false),
    createPath(cellId(1, 0), cellId(0, 0), 0, false),
    createPath(cellId(2, 1), cellId(1, 1), 0, false),
    createPath(cellId(2, 1), cellId(3, 1), 0, false),
    createPath(cellId(3, 0), cellId(2, 0), 0, false),
    createPath(cellId(4, 1), cellId(4, 0), 0, false),
    createPath(cellId(3, 2), cellId(3, 1), 0, false),
  ],
};

// Maze 9: Diagonal-heavy with turns
const maze9 = {
  gridSize,
  startCellId,
  exitCellId,
  solutionPath: [
    cellId(0, 2), // start
    cellId(1, 1),
    cellId(2, 0),
    cellId(3, 1),
    cellId(4, 0),
    cellId(3, 1), // back
    cellId(2, 2),
    cellId(1, 3),
    cellId(2, 4),
    cellId(3, 3),
    cellId(4, 2), // exit
  ],
  paths: [
    // Solution path
    createPath(cellId(0, 2), cellId(1, 1), 0, true),
    createPath(cellId(1, 1), cellId(2, 0), 0, true),
    createPath(cellId(2, 0), cellId(3, 1), 0, true),
    createPath(cellId(3, 1), cellId(4, 0), 0, true),
    createPath(cellId(4, 0), cellId(3, 1), 0, true),
    createPath(cellId(3, 1), cellId(2, 2), 0, true),
    createPath(cellId(2, 2), cellId(1, 3), 0, true),
    createPath(cellId(1, 3), cellId(2, 4), 0, true),
    createPath(cellId(2, 4), cellId(3, 3), 0, true),
    createPath(cellId(3, 3), cellId(4, 2), 0, true),
    // Wrong paths
    createPath(cellId(0, 2), cellId(0, 1), 0, false),
    createPath(cellId(0, 2), cellId(1, 2), 0, false),
    createPath(cellId(1, 1), cellId(0, 0), 0, false),
    createPath(cellId(1, 1), cellId(2, 1), 0, false),
    createPath(cellId(2, 0), cellId(1, 0), 0, false),
    createPath(cellId(3, 1), cellId(3, 0), 0, false),
    createPath(cellId(3, 1), cellId(4, 1), 0, false),
    createPath(cellId(4, 0), cellId(4, 1), 0, false),
    createPath(cellId(2, 2), cellId(1, 2), 0, false),
    createPath(cellId(2, 2), cellId(3, 2), 0, false),
    createPath(cellId(1, 3), cellId(0, 3), 0, false),
    createPath(cellId(1, 3), cellId(2, 3), 0, false),
    createPath(cellId(2, 4), cellId(1, 4), 0, false),
    createPath(cellId(3, 3), cellId(2, 3), 0, false),
    createPath(cellId(3, 3), cellId(4, 3), 0, false),
  ],
};

// Maze 10: Maximum complexity with loops and branches
const maze10 = {
  gridSize,
  startCellId,
  exitCellId,
  solutionPath: [
    cellId(0, 2), // start
    cellId(1, 3),
    cellId(2, 4),
    cellId(3, 3),
    cellId(2, 2),
    cellId(1, 1),
    cellId(0, 0),
    cellId(1, 0),
    cellId(2, 1),
    cellId(3, 0),
    cellId(4, 1),
    cellId(3, 2),
    cellId(4, 2), // exit
  ],
  paths: [
    // Solution path
    createPath(cellId(0, 2), cellId(1, 3), 0, true),
    createPath(cellId(1, 3), cellId(2, 4), 0, true),
    createPath(cellId(2, 4), cellId(3, 3), 0, true),
    createPath(cellId(3, 3), cellId(2, 2), 0, true),
    createPath(cellId(2, 2), cellId(1, 1), 0, true),
    createPath(cellId(1, 1), cellId(0, 0), 0, true),
    createPath(cellId(0, 0), cellId(1, 0), 0, true),
    createPath(cellId(1, 0), cellId(2, 1), 0, true),
    createPath(cellId(2, 1), cellId(3, 0), 0, true),
    createPath(cellId(3, 0), cellId(4, 1), 0, true),
    createPath(cellId(4, 1), cellId(3, 2), 0, true),
    createPath(cellId(3, 2), cellId(4, 2), 0, true),
    // Wrong paths
    createPath(cellId(0, 2), cellId(0, 1), 0, false),
    createPath(cellId(0, 2), cellId(1, 2), 0, false),
    createPath(cellId(1, 3), cellId(0, 3), 0, false),
    createPath(cellId(1, 3), cellId(1, 4), 0, false),
    createPath(cellId(2, 4), cellId(1, 4), 0, false),
    createPath(cellId(2, 4), cellId(3, 4), 0, false),
    createPath(cellId(3, 3), cellId(4, 3), 0, false),
    createPath(cellId(3, 3), cellId(4, 4), 0, false),
    createPath(cellId(2, 2), cellId(1, 2), 0, false),
    createPath(cellId(2, 2), cellId(3, 2), 0, false),
    createPath(cellId(1, 1), cellId(0, 1), 0, false),
    createPath(cellId(1, 1), cellId(2, 1), 0, false),
    createPath(cellId(0, 0), cellId(0, 1), 0, false),
    createPath(cellId(1, 0), cellId(0, 0), 0, false),
    createPath(cellId(2, 1), cellId(1, 1), 0, false),
    createPath(cellId(2, 1), cellId(3, 1), 0, false),
    createPath(cellId(3, 0), cellId(2, 0), 0, false),
    createPath(cellId(4, 1), cellId(4, 0), 0, false),
    createPath(cellId(3, 2), cellId(3, 1), 0, false),
  ],
};

// Maze 11: Extended zig-zag with many branches
const maze11 = {
  gridSize,
  startCellId,
  exitCellId,
  solutionPath: [
    cellId(0, 2), // start
    cellId(0, 1),
    cellId(1, 0),
    cellId(2, 1),
    cellId(1, 2),
    cellId(0, 3),
    cellId(1, 4),
    cellId(2, 3),
    cellId(3, 4),
    cellId(4, 3),
    cellId(3, 2),
    cellId(2, 2),
    cellId(3, 1),
    cellId(4, 2), // exit
  ],
  paths: [
    createPath(cellId(0, 2), cellId(0, 1), 0, true),
    createPath(cellId(0, 1), cellId(1, 0), 0, true),
    createPath(cellId(1, 0), cellId(2, 1), 0, true),
    createPath(cellId(2, 1), cellId(1, 2), 0, true),
    createPath(cellId(1, 2), cellId(0, 3), 0, true),
    createPath(cellId(0, 3), cellId(1, 4), 0, true),
    createPath(cellId(1, 4), cellId(2, 3), 0, true),
    createPath(cellId(2, 3), cellId(3, 4), 0, true),
    createPath(cellId(3, 4), cellId(4, 3), 0, true),
    createPath(cellId(4, 3), cellId(3, 2), 0, true),
    createPath(cellId(3, 2), cellId(2, 2), 0, true),
    createPath(cellId(2, 2), cellId(3, 1), 0, true),
    createPath(cellId(3, 1), cellId(4, 2), 0, true),
    createPath(cellId(0, 2), cellId(1, 2), 0, false),
    createPath(cellId(0, 1), cellId(0, 0), 0, false),
    createPath(cellId(1, 0), cellId(0, 0), 0, false),
    createPath(cellId(2, 1), cellId(1, 1), 0, false),
    createPath(cellId(1, 2), cellId(0, 2), 0, false),
    createPath(cellId(0, 3), cellId(0, 4), 0, false),
    createPath(cellId(1, 4), cellId(0, 4), 0, false),
    createPath(cellId(2, 3), cellId(1, 3), 0, false),
    createPath(cellId(3, 4), cellId(2, 4), 0, false),
    createPath(cellId(4, 3), cellId(3, 3), 0, false),
    createPath(cellId(3, 2), cellId(3, 1), 0, false),
    createPath(cellId(2, 2), cellId(1, 2), 0, false),
    createPath(cellId(3, 1), cellId(3, 0), 0, false),
  ],
};

// Maze 12: Long spiral with many turns
const maze12 = {
  gridSize,
  startCellId,
  exitCellId,
  solutionPath: [
    cellId(0, 2), // start
    cellId(1, 3),
    cellId(2, 4),
    cellId(3, 3),
    cellId(4, 4),
    cellId(3, 3), // back
    cellId(2, 2),
    cellId(1, 1),
    cellId(0, 0),
    cellId(1, 0),
    cellId(2, 1),
    cellId(3, 0),
    cellId(4, 1),
    cellId(3, 2),
    cellId(4, 2), // exit
  ],
  paths: [
    createPath(cellId(0, 2), cellId(1, 3), 0, true),
    createPath(cellId(1, 3), cellId(2, 4), 0, true),
    createPath(cellId(2, 4), cellId(3, 3), 0, true),
    createPath(cellId(3, 3), cellId(4, 4), 0, true),
    createPath(cellId(4, 4), cellId(3, 3), 0, true),
    createPath(cellId(3, 3), cellId(2, 2), 0, true),
    createPath(cellId(2, 2), cellId(1, 1), 0, true),
    createPath(cellId(1, 1), cellId(0, 0), 0, true),
    createPath(cellId(0, 0), cellId(1, 0), 0, true),
    createPath(cellId(1, 0), cellId(2, 1), 0, true),
    createPath(cellId(2, 1), cellId(3, 0), 0, true),
    createPath(cellId(3, 0), cellId(4, 1), 0, true),
    createPath(cellId(4, 1), cellId(3, 2), 0, true),
    createPath(cellId(3, 2), cellId(4, 2), 0, true),
    createPath(cellId(0, 2), cellId(0, 1), 0, false),
    createPath(cellId(1, 3), cellId(0, 3), 0, false),
    createPath(cellId(2, 4), cellId(1, 4), 0, false),
    createPath(cellId(3, 3), cellId(4, 3), 0, false),
    createPath(cellId(2, 2), cellId(1, 2), 0, false),
    createPath(cellId(1, 1), cellId(0, 1), 0, false),
    createPath(cellId(1, 0), cellId(0, 0), 0, false),
    createPath(cellId(2, 1), cellId(1, 1), 0, false),
    createPath(cellId(3, 0), cellId(2, 0), 0, false),
    createPath(cellId(4, 1), cellId(4, 0), 0, false),
    createPath(cellId(3, 2), cellId(3, 1), 0, false),
  ],
};

// Maze 13: Complex branching with loops
const maze13 = {
  gridSize,
  startCellId,
  exitCellId,
  solutionPath: [
    cellId(0, 2), // start
    cellId(1, 1),
    cellId(2, 0),
    cellId(1, 1), // back
    cellId(0, 0),
    cellId(1, 0),
    cellId(2, 1),
    cellId(3, 0),
    cellId(4, 1),
    cellId(3, 2),
    cellId(2, 3),
    cellId(3, 4),
    cellId(4, 3),
    cellId(4, 2), // exit
  ],
  paths: [
    createPath(cellId(0, 2), cellId(1, 1), 0, true),
    createPath(cellId(1, 1), cellId(2, 0), 0, true),
    createPath(cellId(2, 0), cellId(1, 1), 0, true),
    createPath(cellId(1, 1), cellId(0, 0), 0, true),
    createPath(cellId(0, 0), cellId(1, 0), 0, true),
    createPath(cellId(1, 0), cellId(2, 1), 0, true),
    createPath(cellId(2, 1), cellId(3, 0), 0, true),
    createPath(cellId(3, 0), cellId(4, 1), 0, true),
    createPath(cellId(4, 1), cellId(3, 2), 0, true),
    createPath(cellId(3, 2), cellId(2, 3), 0, true),
    createPath(cellId(2, 3), cellId(3, 4), 0, true),
    createPath(cellId(3, 4), cellId(4, 3), 0, true),
    createPath(cellId(4, 3), cellId(4, 2), 0, true),
    createPath(cellId(0, 2), cellId(0, 1), 0, false),
    createPath(cellId(1, 1), cellId(0, 1), 0, false),
    createPath(cellId(1, 1), cellId(2, 1), 0, false),
    createPath(cellId(2, 0), cellId(1, 0), 0, false),
    createPath(cellId(0, 0), cellId(0, 1), 0, false),
    createPath(cellId(1, 0), cellId(0, 0), 0, false),
    createPath(cellId(2, 1), cellId(1, 1), 0, false),
    createPath(cellId(3, 0), cellId(2, 0), 0, false),
    createPath(cellId(4, 1), cellId(4, 0), 0, false),
    createPath(cellId(3, 2), cellId(3, 1), 0, false),
    createPath(cellId(2, 3), cellId(1, 3), 0, false),
    createPath(cellId(3, 4), cellId(2, 4), 0, false),
    createPath(cellId(4, 3), cellId(3, 3), 0, false),
  ],
};

// Maze 14: Twisted path with many dead ends
const maze14 = {
  gridSize,
  startCellId,
  exitCellId,
  solutionPath: [
    cellId(0, 2), // start
    cellId(0, 3),
    cellId(1, 4),
    cellId(0, 3), // back
    cellId(1, 2),
    cellId(2, 1),
    cellId(3, 0),
    cellId(4, 1),
    cellId(3, 2),
    cellId(2, 3),
    cellId(1, 4), // back again
    cellId(2, 3),
    cellId(3, 4),
    cellId(4, 3),
    cellId(4, 2), // exit
  ],
  paths: [
    createPath(cellId(0, 2), cellId(0, 3), 0, true),
    createPath(cellId(0, 3), cellId(1, 4), 0, true),
    createPath(cellId(1, 4), cellId(0, 3), 0, true),
    createPath(cellId(0, 3), cellId(1, 2), 0, true),
    createPath(cellId(1, 2), cellId(2, 1), 0, true),
    createPath(cellId(2, 1), cellId(3, 0), 0, true),
    createPath(cellId(3, 0), cellId(4, 1), 0, true),
    createPath(cellId(4, 1), cellId(3, 2), 0, true),
    createPath(cellId(3, 2), cellId(2, 3), 0, true),
    createPath(cellId(2, 3), cellId(1, 4), 0, true),
    createPath(cellId(1, 4), cellId(2, 3), 0, true),
    createPath(cellId(2, 3), cellId(3, 4), 0, true),
    createPath(cellId(3, 4), cellId(4, 3), 0, true),
    createPath(cellId(4, 3), cellId(4, 2), 0, true),
    createPath(cellId(0, 2), cellId(0, 1), 0, false),
    createPath(cellId(0, 2), cellId(1, 2), 0, false),
    createPath(cellId(0, 3), cellId(0, 4), 0, false),
    createPath(cellId(1, 4), cellId(0, 4), 0, false),
    createPath(cellId(1, 2), cellId(0, 2), 0, false),
    createPath(cellId(2, 1), cellId(1, 1), 0, false),
    createPath(cellId(3, 0), cellId(2, 0), 0, false),
    createPath(cellId(4, 1), cellId(4, 0), 0, false),
    createPath(cellId(3, 2), cellId(3, 1), 0, false),
    createPath(cellId(2, 3), cellId(1, 3), 0, false),
    createPath(cellId(3, 4), cellId(2, 4), 0, false),
    createPath(cellId(4, 3), cellId(3, 3), 0, false),
  ],
};

// Maze 15: Maximum complexity with many loops
const maze15 = {
  gridSize,
  startCellId,
  exitCellId,
  solutionPath: [
    cellId(0, 2), // start
    cellId(1, 1),
    cellId(2, 0),
    cellId(3, 1),
    cellId(2, 2),
    cellId(1, 3),
    cellId(0, 4),
    cellId(1, 4),
    cellId(2, 3),
    cellId(1, 2),
    cellId(2, 1),
    cellId(3, 2),
    cellId(4, 1),
    cellId(3, 2), // back
    cellId(4, 2), // exit
  ],
  paths: [
    createPath(cellId(0, 2), cellId(1, 1), 0, true),
    createPath(cellId(1, 1), cellId(2, 0), 0, true),
    createPath(cellId(2, 0), cellId(3, 1), 0, true),
    createPath(cellId(3, 1), cellId(2, 2), 0, true),
    createPath(cellId(2, 2), cellId(1, 3), 0, true),
    createPath(cellId(1, 3), cellId(0, 4), 0, true),
    createPath(cellId(0, 4), cellId(1, 4), 0, true),
    createPath(cellId(1, 4), cellId(2, 3), 0, true),
    createPath(cellId(2, 3), cellId(1, 2), 0, true),
    createPath(cellId(1, 2), cellId(2, 1), 0, true),
    createPath(cellId(2, 1), cellId(3, 2), 0, true),
    createPath(cellId(3, 2), cellId(4, 1), 0, true),
    createPath(cellId(4, 1), cellId(3, 2), 0, true),
    createPath(cellId(3, 2), cellId(4, 2), 0, true),
    createPath(cellId(0, 2), cellId(0, 1), 0, false),
    createPath(cellId(1, 1), cellId(0, 0), 0, false),
    createPath(cellId(2, 0), cellId(1, 0), 0, false),
    createPath(cellId(3, 1), cellId(3, 0), 0, false),
    createPath(cellId(2, 2), cellId(1, 2), 0, false),
    createPath(cellId(1, 3), cellId(0, 3), 0, false),
    createPath(cellId(1, 4), cellId(0, 4), 0, false),
    createPath(cellId(2, 3), cellId(1, 3), 0, false),
    createPath(cellId(1, 2), cellId(0, 2), 0, false),
    createPath(cellId(2, 1), cellId(1, 1), 0, false),
    createPath(cellId(3, 2), cellId(3, 1), 0, false),
    createPath(cellId(4, 1), cellId(4, 0), 0, false),
  ],
};

// Maze 16: Long winding route
const maze16 = {
  gridSize,
  startCellId,
  exitCellId,
  solutionPath: [
    cellId(0, 2), // start
    cellId(0, 1),
    cellId(1, 0),
    cellId(2, 0),
    cellId(3, 1),
    cellId(4, 0),
    cellId(3, 1), // back
    cellId(2, 2),
    cellId(1, 3),
    cellId(0, 4),
    cellId(1, 4),
    cellId(2, 3),
    cellId(3, 4),
    cellId(4, 3),
    cellId(3, 2),
    cellId(4, 2), // exit
  ],
  paths: [
    createPath(cellId(0, 2), cellId(0, 1), 0, true),
    createPath(cellId(0, 1), cellId(1, 0), 0, true),
    createPath(cellId(1, 0), cellId(2, 0), 0, true),
    createPath(cellId(2, 0), cellId(3, 1), 0, true),
    createPath(cellId(3, 1), cellId(4, 0), 0, true),
    createPath(cellId(4, 0), cellId(3, 1), 0, true),
    createPath(cellId(3, 1), cellId(2, 2), 0, true),
    createPath(cellId(2, 2), cellId(1, 3), 0, true),
    createPath(cellId(1, 3), cellId(0, 4), 0, true),
    createPath(cellId(0, 4), cellId(1, 4), 0, true),
    createPath(cellId(1, 4), cellId(2, 3), 0, true),
    createPath(cellId(2, 3), cellId(3, 4), 0, true),
    createPath(cellId(3, 4), cellId(4, 3), 0, true),
    createPath(cellId(4, 3), cellId(3, 2), 0, true),
    createPath(cellId(3, 2), cellId(4, 2), 0, true),
    createPath(cellId(0, 2), cellId(1, 2), 0, false),
    createPath(cellId(0, 1), cellId(0, 0), 0, false),
    createPath(cellId(1, 0), cellId(0, 0), 0, false),
    createPath(cellId(2, 0), cellId(2, 1), 0, false),
    createPath(cellId(3, 1), cellId(3, 0), 0, false),
    createPath(cellId(4, 0), cellId(4, 1), 0, false),
    createPath(cellId(2, 2), cellId(1, 2), 0, false),
    createPath(cellId(1, 3), cellId(0, 3), 0, false),
    createPath(cellId(1, 4), cellId(0, 4), 0, false),
    createPath(cellId(2, 3), cellId(1, 3), 0, false),
    createPath(cellId(3, 4), cellId(2, 4), 0, false),
    createPath(cellId(4, 3), cellId(3, 3), 0, false),
    createPath(cellId(3, 2), cellId(3, 1), 0, false),
  ],
};

// Maze 17: Complex branching pattern
const maze17 = {
  gridSize,
  startCellId,
  exitCellId,
  solutionPath: [
    cellId(0, 2), // start
    cellId(1, 3),
    cellId(2, 4),
    cellId(3, 3),
    cellId(2, 2),
    cellId(1, 1),
    cellId(0, 0),
    cellId(1, 0),
    cellId(2, 1),
    cellId(3, 0),
    cellId(4, 1),
    cellId(3, 2),
    cellId(4, 2), // exit
  ],
  paths: [
    createPath(cellId(0, 2), cellId(1, 3), 0, true),
    createPath(cellId(1, 3), cellId(2, 4), 0, true),
    createPath(cellId(2, 4), cellId(3, 3), 0, true),
    createPath(cellId(3, 3), cellId(2, 2), 0, true),
    createPath(cellId(2, 2), cellId(1, 1), 0, true),
    createPath(cellId(1, 1), cellId(0, 0), 0, true),
    createPath(cellId(0, 0), cellId(1, 0), 0, true),
    createPath(cellId(1, 0), cellId(2, 1), 0, true),
    createPath(cellId(2, 1), cellId(3, 0), 0, true),
    createPath(cellId(3, 0), cellId(4, 1), 0, true),
    createPath(cellId(4, 1), cellId(3, 2), 0, true),
    createPath(cellId(3, 2), cellId(4, 2), 0, true),
    createPath(cellId(0, 2), cellId(0, 1), 0, false),
    createPath(cellId(1, 3), cellId(0, 3), 0, false),
    createPath(cellId(2, 4), cellId(1, 4), 0, false),
    createPath(cellId(3, 3), cellId(4, 3), 0, false),
    createPath(cellId(2, 2), cellId(1, 2), 0, false),
    createPath(cellId(1, 1), cellId(0, 1), 0, false),
    createPath(cellId(1, 0), cellId(0, 0), 0, false),
    createPath(cellId(2, 1), cellId(1, 1), 0, false),
    createPath(cellId(3, 0), cellId(2, 0), 0, false),
    createPath(cellId(4, 1), cellId(4, 0), 0, false),
    createPath(cellId(3, 2), cellId(3, 1), 0, false),
  ],
};

// Maze 18: Twisted S-curve
const maze18 = {
  gridSize,
  startCellId,
  exitCellId,
  solutionPath: [
    cellId(0, 2), // start
    cellId(1, 1),
    cellId(2, 0),
    cellId(3, 1),
    cellId(2, 2),
    cellId(1, 3),
    cellId(0, 4),
    cellId(1, 4),
    cellId(2, 3),
    cellId(3, 4),
    cellId(4, 3),
    cellId(3, 2),
    cellId(4, 2), // exit
  ],
  paths: [
    createPath(cellId(0, 2), cellId(1, 1), 0, true),
    createPath(cellId(1, 1), cellId(2, 0), 0, true),
    createPath(cellId(2, 0), cellId(3, 1), 0, true),
    createPath(cellId(3, 1), cellId(2, 2), 0, true),
    createPath(cellId(2, 2), cellId(1, 3), 0, true),
    createPath(cellId(1, 3), cellId(0, 4), 0, true),
    createPath(cellId(0, 4), cellId(1, 4), 0, true),
    createPath(cellId(1, 4), cellId(2, 3), 0, true),
    createPath(cellId(2, 3), cellId(3, 4), 0, true),
    createPath(cellId(3, 4), cellId(4, 3), 0, true),
    createPath(cellId(4, 3), cellId(3, 2), 0, true),
    createPath(cellId(3, 2), cellId(4, 2), 0, true),
    createPath(cellId(0, 2), cellId(0, 1), 0, false),
    createPath(cellId(1, 1), cellId(0, 0), 0, false),
    createPath(cellId(2, 0), cellId(1, 0), 0, false),
    createPath(cellId(3, 1), cellId(3, 0), 0, false),
    createPath(cellId(2, 2), cellId(1, 2), 0, false),
    createPath(cellId(1, 3), cellId(0, 3), 0, false),
    createPath(cellId(1, 4), cellId(0, 4), 0, false),
    createPath(cellId(2, 3), cellId(1, 3), 0, false),
    createPath(cellId(3, 4), cellId(2, 4), 0, false),
    createPath(cellId(4, 3), cellId(3, 3), 0, false),
    createPath(cellId(3, 2), cellId(3, 1), 0, false),
  ],
};

// Maze 19: Extended path with loops
const maze19 = {
  gridSize,
  startCellId,
  exitCellId,
  solutionPath: [
    cellId(0, 2), // start
    cellId(0, 3),
    cellId(1, 4),
    cellId(2, 3),
    cellId(1, 2),
    cellId(0, 1),
    cellId(1, 0),
    cellId(2, 1),
    cellId(3, 0),
    cellId(4, 1),
    cellId(3, 2),
    cellId(2, 2),
    cellId(3, 3),
    cellId(4, 2), // exit
  ],
  paths: [
    createPath(cellId(0, 2), cellId(0, 3), 0, true),
    createPath(cellId(0, 3), cellId(1, 4), 0, true),
    createPath(cellId(1, 4), cellId(2, 3), 0, true),
    createPath(cellId(2, 3), cellId(1, 2), 0, true),
    createPath(cellId(1, 2), cellId(0, 1), 0, true),
    createPath(cellId(0, 1), cellId(1, 0), 0, true),
    createPath(cellId(1, 0), cellId(2, 1), 0, true),
    createPath(cellId(2, 1), cellId(3, 0), 0, true),
    createPath(cellId(3, 0), cellId(4, 1), 0, true),
    createPath(cellId(4, 1), cellId(3, 2), 0, true),
    createPath(cellId(3, 2), cellId(2, 2), 0, true),
    createPath(cellId(2, 2), cellId(3, 3), 0, true),
    createPath(cellId(3, 3), cellId(4, 2), 0, true),
    createPath(cellId(0, 2), cellId(0, 1), 0, false),
    createPath(cellId(0, 2), cellId(1, 2), 0, false),
    createPath(cellId(0, 3), cellId(0, 4), 0, false),
    createPath(cellId(1, 4), cellId(0, 4), 0, false),
    createPath(cellId(2, 3), cellId(1, 3), 0, false),
    createPath(cellId(1, 2), cellId(0, 2), 0, false),
    createPath(cellId(0, 1), cellId(0, 0), 0, false),
    createPath(cellId(1, 0), cellId(0, 0), 0, false),
    createPath(cellId(2, 1), cellId(1, 1), 0, false),
    createPath(cellId(3, 0), cellId(2, 0), 0, false),
    createPath(cellId(4, 1), cellId(4, 0), 0, false),
    createPath(cellId(3, 2), cellId(3, 1), 0, false),
    createPath(cellId(2, 2), cellId(1, 2), 0, false),
    createPath(cellId(3, 3), cellId(2, 3), 0, false),
  ],
};

// Maze 20: Maximum complexity
const maze20 = {
  gridSize,
  startCellId,
  exitCellId,
  solutionPath: [
    cellId(0, 2), // start
    cellId(1, 1),
    cellId(2, 0),
    cellId(3, 1),
    cellId(4, 0),
    cellId(3, 1), // back
    cellId(2, 2),
    cellId(1, 3),
    cellId(0, 4),
    cellId(1, 4),
    cellId(2, 3),
    cellId(1, 2),
    cellId(2, 1),
    cellId(3, 2),
    cellId(4, 2), // exit
  ],
  paths: [
    createPath(cellId(0, 2), cellId(1, 1), 0, true),
    createPath(cellId(1, 1), cellId(2, 0), 0, true),
    createPath(cellId(2, 0), cellId(3, 1), 0, true),
    createPath(cellId(3, 1), cellId(4, 0), 0, true),
    createPath(cellId(4, 0), cellId(3, 1), 0, true),
    createPath(cellId(3, 1), cellId(2, 2), 0, true),
    createPath(cellId(2, 2), cellId(1, 3), 0, true),
    createPath(cellId(1, 3), cellId(0, 4), 0, true),
    createPath(cellId(0, 4), cellId(1, 4), 0, true),
    createPath(cellId(1, 4), cellId(2, 3), 0, true),
    createPath(cellId(2, 3), cellId(1, 2), 0, true),
    createPath(cellId(1, 2), cellId(2, 1), 0, true),
    createPath(cellId(2, 1), cellId(3, 2), 0, true),
    createPath(cellId(3, 2), cellId(4, 2), 0, true),
    createPath(cellId(0, 2), cellId(0, 1), 0, false),
    createPath(cellId(1, 1), cellId(0, 0), 0, false),
    createPath(cellId(2, 0), cellId(1, 0), 0, false),
    createPath(cellId(3, 1), cellId(3, 0), 0, false),
    createPath(cellId(4, 0), cellId(4, 1), 0, false),
    createPath(cellId(2, 2), cellId(1, 2), 0, false),
    createPath(cellId(1, 3), cellId(0, 3), 0, false),
    createPath(cellId(1, 4), cellId(0, 4), 0, false),
    createPath(cellId(2, 3), cellId(1, 3), 0, false),
    createPath(cellId(1, 2), cellId(0, 2), 0, false),
    createPath(cellId(2, 1), cellId(1, 1), 0, false),
    createPath(cellId(3, 2), cellId(3, 1), 0, false),
  ],
};

// All mazes in an array for random selection
export const allMazes = [
  maze1,
  maze2,
  maze3,
  maze4,
  maze5,
  maze6,
  maze7,
  maze8,
  maze9,
  maze10,
  maze11,
  maze12,
  maze13,
  maze14,
  maze15,
  maze16,
  maze17,
  maze18,
  maze19,
  maze20,
];

/**
 * Get a random maze
 * @returns {Object} A maze object
 */
export function getRandomMaze() {
  const randomIndex = Math.floor(Math.random() * allMazes.length);
  return allMazes[randomIndex];
}
