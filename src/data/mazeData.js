/**
 * @typedef {Object} Cell
 * @property {string} id
 * @property {number} x
 * @property {number} y
 * @property {string} question
 * @property {number} correctAnswerNumber
 * @property {number[]} answerOptions
 * @property {boolean} solved
 * @property {boolean} visited
 * @property {boolean} isExit
 * @property {boolean} isDeadEnd
 */

/**
 * @typedef {Object} Path
 * @property {string} fromCellId
 * @property {string} toCellId
 * @property {number} answerNumber
 * @property {boolean} isDiagonal
 * @property {boolean} isCorrectEdge
 */

import { generateQuestions, getGrade } from "./questionGenerator.js";

const gridSize = 5;

const cellId = (x, y) => `c-${x}-${y}`;
const startCellId = cellId(0, 2);
let lastExitCellId = null;
let lastPathPrefix = null;
const PATH_PREFIX_LENGTH = 8;
const orthogonalDirections = [
  { dx: 1, dy: 0 },
  { dx: 0, dy: 1 },
  { dx: -1, dy: 0 },
  { dx: 0, dy: -1 },
];
const diagonalDirections = [
  { dx: 1, dy: 1 },
  { dx: -1, dy: 1 },
  { dx: 1, dy: -1 },
  { dx: -1, dy: -1 },
];
const allDirections = [...orthogonalDirections, ...diagonalDirections];

const buildAnswerOptions = (correctAnswerNumber, count, seed) => {
  const offsets = [0, 3, -2, 6, -4, 9, -7];
  const options = new Set([correctAnswerNumber]);
  let offsetIndex = 0;

  while (options.size < count && offsetIndex < offsets.length) {
    const offset = offsets[(offsetIndex + seed) % offsets.length];
    options.add(correctAnswerNumber + offset);
    offsetIndex += 1;
  }

  return Array.from(options).slice(0, count);
};

const buildUniqueOptions = ({ count, exclude, base, seed }) => {
  const offsets = [3, -2, 6, -4, 9, -7, 12, -9, 15, -11, 18, -14];
  const options = new Set();
  let offsetIndex = 0;

  while (options.size < count && offsetIndex < offsets.length) {
    const offset = offsets[(offsetIndex + seed) % offsets.length];
    const candidate = base + offset;
    if (!exclude.has(candidate)) {
      options.add(candidate);
    }
    offsetIndex += 1;
  }

  while (options.size < count) {
    const magnitude = randomInt(1, 25);
    const candidate = base + (randomFloat() < 0.5 ? -magnitude : magnitude);
    if (!exclude.has(candidate)) {
      options.add(candidate);
    }
  }

  return Array.from(options);
};

const randomFloat = () => Math.random();
const randomInt = (min, max) => Math.floor(randomFloat() * (max - min + 1)) + min;

const shuffle = (items) => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(randomFloat() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const pickRandomExitCellId = () => {
  const candidates = [];
  for (let y = 0; y < gridSize; y += 1) {
    for (let x = 0; x < gridSize; x += 1) {
      const id = cellId(x, y);
      if (id !== startCellId) {
        candidates.push(id);
      }
    }
  }
  if (candidates.length === 0) {
    return startCellId;
  }
  const selected = candidates[Math.floor(randomFloat() * candidates.length)];
  lastExitCellId = selected;
  return selected;
};

const neighborCandidates = (x, y, directions = allDirections) =>
  directions
    .map(({ dx, dy }) => ({
      x: x + dx,
      y: y + dy,
      dx,
      dy,
    }))
    .filter(
      (candidate) =>
        candidate.x >= 0 &&
        candidate.x < gridSize &&
        candidate.y >= 0 &&
        candidate.y < gridSize
    );

const cellCoords = (id) => {
  const [, x, y] = id.split("-");
  return { x: Number(x), y: Number(y) };
};

const directionFamily = (dx, dy) => {
  if (dx === 0) {
    return "vertical";
  }
  if (dy === 0) {
    return "horizontal";
  }
  return "diagonal";
};
const directionKey = (dx, dy) => `${dx},${dy}`;

const generateSolutionPath = ({ minLength, maxLength, startCellId, exitCellId }) => {
  const start = startCellId;
  const exit = exitCellId;
  const maxAttempts = 200;

  const attempt = () => {
    const visited = new Set([start]);
    const path = [start];

    const dfs = (currentId, lastDirKey, runLength) => {
      if (currentId === exit) {
        const lengthOk = path.length >= minLength && path.length <= maxLength;
        if (!lengthOk) {
          return false;
        }
        const prefix = path.slice(0, PATH_PREFIX_LENGTH).join("|");
        if (lastPathPrefix && prefix === lastPathPrefix) {
          return false;
        }
        return true;
      }
      if (path.length >= maxLength) {
        return false;
      }

      const { x, y } = cellCoords(currentId);
      const neighborList = shuffle(neighborCandidates(x, y, allDirections)).map((candidate) => {
        const id = cellId(candidate.x, candidate.y);
        const key = directionKey(candidate.dx, candidate.dy);
        return {
          id,
          key,
          family: directionFamily(candidate.dx, candidate.dy),
        };
      });
      const lastFamily = lastDirKey ? directionFamily(...lastDirKey.split(",").map(Number)) : null;
      const orderedNeighbors = [...neighborList].sort((a, b) => {
        const penaltyFor = (entry) => {
          let penalty = 0;
          if (lastFamily && entry.family === lastFamily) {
            penalty += runLength >= 2 ? 5 : 2;
          }
          if (lastDirKey && entry.key === lastDirKey) {
            penalty += 1;
          }
          // Random jitter to avoid deterministic ordering on ties.
          return penalty + randomFloat();
        };
        return penaltyFor(a) - penaltyFor(b);
      });

      for (const neighbor of orderedNeighbors) {
        const neighborId = neighbor.id;
        if (visited.has(neighborId)) {
          continue;
        }
        if (neighborId === exit && path.length + 1 < minLength) {
          continue;
        }
        if (lastDirKey && neighbor.key === lastDirKey && runLength >= 3) {
          continue;
        }
        visited.add(neighborId);
        path.push(neighborId);
        const nextRunLength = lastDirKey === neighbor.key ? runLength + 1 : 1;
        if (dfs(neighborId, neighbor.key, nextRunLength)) {
          return true;
        }
        path.pop();
        visited.delete(neighborId);
      }

      return false;
    };

    return dfs(start, null, 0) ? path : null;
  };

  for (let attemptIndex = 0; attemptIndex < maxAttempts; attemptIndex += 1) {
    const result = attempt();
    if (result) {
      lastPathPrefix = result.slice(0, PATH_PREFIX_LENGTH).join("|");
      return result;
    }
  }

  return [
    startCellId,
    cellId(0, 1),
    cellId(0, 0),
    cellId(1, 0),
    cellId(2, 0),
    cellId(2, 1),
    cellId(2, 2),
    cellId(2, 3),
    cellId(3, 3),
    cellId(4, 3),
    exitCellId,
  ];
};

const buildBaseCells = (exitCellId) =>
  Array.from({ length: gridSize * gridSize }, (_, index) => {
    const x = index % gridSize;
    const y = Math.floor(index / gridSize);
    return {
      id: cellId(x, y),
      x,
      y,
      question: "",
      correctAnswerNumber: 0,
      answerOptions: [],
      solved: false,
      visited: false,
      isExit: cellId(x, y) === exitCellId,
      isDeadEnd: false,
    };
  });

const generateMazeOnce = (exitCellId) => {
  const minLength = randomInt(8, 11);
  const maxLength = Math.max(minLength + 2, randomInt(12, 16));
  const solutionPath = generateSolutionPath({
    minLength,
    maxLength,
    startCellId,
    exitCellId,
  });
  const solutionSet = new Set(solutionPath);
  const solutionNextMap = new Map(
    solutionPath.slice(0, -1).map((cellIdAt, index) => [cellIdAt, solutionPath[index + 1]])
  );

  /** @type {Cell[]} */
  const cells = buildBaseCells(exitCellId);
  const cellMap = new Map(cells.map((cell) => [cell.id, cell]));
  /** @type {Path[]} */
  const paths = [];

  const addEdge = ({ fromId, toId, isCorrectEdge }) => {
    const fromCell = cellMap.get(fromId);
    const toCell = cellMap.get(toId);
    if (!fromCell || !toCell) {
      return;
    }
    const isDiagonal =
      Math.abs(toCell.x - fromCell.x) === 1 && Math.abs(toCell.y - fromCell.y) === 1;
    paths.push({
      fromCellId: fromId,
      toCellId: toId,
      answerNumber: 0,
      isDiagonal,
      isCorrectEdge,
    });
  };

  cells.forEach((cell) => {
    const neighbors = neighborCandidates(cell.x, cell.y, allDirections);
    neighbors.forEach((candidate) => {
      const toId = cellId(candidate.x, candidate.y);
      addEdge({
        fromId: cell.id,
        toId,
        isCorrectEdge: solutionNextMap.get(cell.id) === toId,
      });
    });
  });

  const validateMaze = () => {
    const outgoingCounts = new Map();
    const incomingCounts = new Map();
    paths.forEach((edge) => {
      outgoingCounts.set(edge.fromCellId, (outgoingCounts.get(edge.fromCellId) || 0) + 1);
      incomingCounts.set(edge.toCellId, (incomingCounts.get(edge.toCellId) || 0) + 1);
    });

    const pathDirections = [];
    let diagonalCount = 0;
    for (let i = 1; i < solutionPath.length; i += 1) {
      const from = cellCoords(solutionPath[i - 1]);
      const to = cellCoords(solutionPath[i]);
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      pathDirections.push(directionKey(dx, dy));
      if (dx !== 0 && dy !== 0) {
        diagonalCount += 1;
      }
    }
    if (diagonalCount === 0) {
      console.error("Maze violation: no diagonal steps");
      return false;
    }
    let runLength = 1;
    for (let i = 1; i < pathDirections.length; i += 1) {
      if (pathDirections[i] === pathDirections[i - 1]) {
        runLength += 1;
        if (runLength > 3) {
          console.error("Maze violation: straight run", solutionPath[i]);
          return false;
        }
      } else {
        runLength = 1;
      }
    }

    for (const cell of cells) {
      if (cell.isExit || cell.isDeadEnd) {
        continue;
      }
      const isReachable = solutionSet.has(cell.id) || incomingCounts.has(cell.id);
      if (!isReachable) {
        continue;
      }
      const outgoing = outgoingCounts.get(cell.id) || 0;
      const neighborCount = neighborCandidates(cell.x, cell.y, allDirections).length;
      if (neighborCount >= 2 && outgoing < 2) {
        console.error("Maze violation: min options", cell.id);
        return false;
      }
      if (neighborCount >= 3 && outgoing < 3) {
        console.error("Maze violation: 3 options expected", cell.id);
        return false;
      }
      if (solutionSet.has(cell.id) && cell.id !== exitCellId) {
        if (neighborCount >= 3 && outgoing < 3) {
          console.error("Maze violation: solution options", cell.id);
          return false;
        }
        const hasCorrectEdge = paths.some(
          (edge) => edge.fromCellId === cell.id && edge.isCorrectEdge
        );
        if (!hasCorrectEdge) {
          console.error("Maze violation: missing correct edge", cell.id);
          return false;
        }
      }
    }
    return true;
  };

  if (!validateMaze()) {
    return null;
  }

  return { cells, paths, solutionPath };
};

const generateMazeWithRetries = (exitCellId, attempts = 30) => {
  for (let i = 0; i < attempts; i += 1) {
    const result = generateMazeOnce(exitCellId);
    if (result) {
      return result;
    }
  }
  return null;
};

const buildFallbackMaze = (exitCellId) => {
  const cells = buildBaseCells(exitCellId);
  /** @type {Path[]} */
  const paths = [];
  const solutionPath = [startCellId];
  const start = cellCoords(startCellId);
  const exit = cellCoords(exitCellId);
  let x = start.x;
  let y = start.y;

  while (x !== exit.x || y !== exit.y) {
    const dx = exit.x - x;
    const dy = exit.y - y;
    if (dx !== 0 && dy !== 0) {
      x += Math.sign(dx);
      y += Math.sign(dy);
    } else if (dx !== 0) {
      x += Math.sign(dx);
    } else {
      y += Math.sign(dy);
    }
    solutionPath.push(cellId(x, y));
  }

  const addEdge = ({ fromId, toId, isCorrectEdge }) => {
    const fromCell = cellCoords(fromId);
    const toCell = cellCoords(toId);
    const isDiagonal =
      Math.abs(toCell.x - fromCell.x) === 1 && Math.abs(toCell.y - fromCell.y) === 1;
    paths.push({
      fromCellId: fromId,
      toCellId: toId,
      answerNumber: 0,
      isDiagonal,
      isCorrectEdge,
    });
  };

  solutionPath.slice(0, -1).forEach((fromId, index) => {
    addEdge({ fromId, toId: solutionPath[index + 1], isCorrectEdge: true });
  });

  lastPathPrefix = solutionPath.slice(0, PATH_PREFIX_LENGTH).join("|");
  return { cells, paths, solutionPath };
};

const applyQuestionsToCells = (cells, grade) => {
  const generatedQuestions = generateQuestions(gridSize * gridSize, grade);
  cells.forEach((cell, index) => {
    const questionData = generatedQuestions[index];
    cell.question = questionData.question;
    cell.correctAnswerNumber = questionData.answer;
  });
};

const markDeadEnds = (cells, paths) => {
  const outgoingMap = new Map();
  paths.forEach((path) => {
    outgoingMap.set(
      path.fromCellId,
      [...(outgoingMap.get(path.fromCellId) || []), path.toCellId]
    );
  });
  cells.forEach((cell) => {
    if (cell.isExit) {
      cell.isDeadEnd = false;
      return;
    }
    const outgoingCount = (outgoingMap.get(cell.id) || []).length;
    cell.isDeadEnd = outgoingCount === 0;
  });
};

const assignAnswerNumbers = (cells, paths, solutionPath) => {
  const solutionSet = new Set(solutionPath);
  const edgeGroups = new Map();
  paths.forEach((edge) => {
    edgeGroups.set(edge.fromCellId, [...(edgeGroups.get(edge.fromCellId) || []), edge]);
  });

  cells.forEach((cell) => {
    if (cell.isExit || cell.isDeadEnd) {
      cell.answerOptions = [];
      return;
    }
    const edges = edgeGroups.get(cell.id) || [];
    if (edges.length === 0) {
      cell.answerOptions = [];
      return;
    }
    const seed = cell.x + cell.y * gridSize;
    const assignUniqueEdgeNumbers = ({ includeCorrect }) => {
      const used = new Set();
      const edgeValues = new Map();
      const correctEdge = edges.find((edge) => edge.isCorrectEdge);
      if (includeCorrect && correctEdge) {
        used.add(cell.correctAnswerNumber);
        edgeValues.set(correctEdge, cell.correctAnswerNumber);
      }

      const remainingEdges = edges.filter((edge) => edge !== correctEdge);
      const desiredCount = remainingEdges.length;
      let attempt = 0;
      let values = [];
      while (attempt < 10) {
        values = buildUniqueOptions({
          count: desiredCount,
          exclude: used,
          base: cell.correctAnswerNumber,
          seed: seed + attempt * 11,
        });
        if (new Set(values).size === desiredCount) {
          break;
        }
        attempt += 1;
      }
      const finalValues = [...values];
      let cursor = 1;
      while (finalValues.length < desiredCount) {
        const candidate = cell.correctAnswerNumber + cursor;
        if (!used.has(candidate) && !finalValues.includes(candidate)) {
          finalValues.push(candidate);
        }
        cursor += 1;
      }

      remainingEdges.forEach((edge, index) => {
        edgeValues.set(edge, finalValues[index]);
      });

      edges.forEach((edge) => {
        edge.answerNumber = edgeValues.get(edge);
      });

      cell.answerOptions = edges.map((edge) => edge.answerNumber);
    };

    if (solutionSet.has(cell.id)) {
      assignUniqueEdgeNumbers({ includeCorrect: true });
    } else {
      assignUniqueEdgeNumbers({ includeCorrect: false });
    }
    const answerSet = new Set(cell.answerOptions);
    if (answerSet.size !== cell.answerOptions.length) {
      console.warn("Duplicate answers detected for cell", cell.id, cell.answerOptions);
    }
  });
};

export const createMaze = ({ grade = getGrade() } = {}) => {
  const exitCellId = pickRandomExitCellId();
  const maze = generateMazeWithRetries(exitCellId) || buildFallbackMaze(exitCellId);
  applyQuestionsToCells(maze.cells, grade);
  markDeadEnds(maze.cells, maze.paths);
  assignAnswerNumbers(maze.cells, maze.paths, maze.solutionPath);

  return {
    gridSize,
    cells: maze.cells,
    paths: maze.paths,
    startCellId,
    exitCellId,
    solutionPath: maze.solutionPath,
  };
};
