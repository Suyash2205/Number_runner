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

import { getRandomMaze } from "./mazes.js";
import { generateQuestions, getGrade } from "./questionGenerator.js";

const gridSize = 5;

const cellId = (x, y) => `c-${x}-${y}`;
const startCellId = cellId(0, 2);
const exitCellId = cellId(4, 2);
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

const randomFloat = () => Math.random();

const shuffle = (items) => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(randomFloat() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
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

const generateSolutionPath = ({ minLength, maxLength }) => {
  const start = startCellId;
  const exit = exitCellId;
  const maxAttempts = 200;

  const attempt = () => {
    const visited = new Set([start]);
    const path = [start];

    const dfs = (currentId, lastDirKey, runLength) => {
      if (currentId === exit) {
        return path.length >= minLength && path.length <= maxLength;
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
          return penalty;
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

const generateMazeOnce = () => {
  const solutionPath = generateSolutionPath({ minLength: 10, maxLength: 14 });
  const solutionSet = new Set(solutionPath);
  const solutionNextMap = new Map(
    solutionPath.slice(0, -1).map((cellIdAt, index) => [cellIdAt, solutionPath[index + 1]])
  );
  const solutionPrevMap = new Map(
    solutionPath.slice(1).map((cellIdAt, index) => [cellIdAt, solutionPath[index]])
  );

  /** @type {Cell[]} */
  const cells = Array.from({ length: gridSize * gridSize }, (_, index) => {
    const x = index % gridSize;
    const y = Math.floor(index / gridSize);
    const [left, right] = questionSeeds[index];
    const correctAnswerNumber = left + right;

    return {
      id: cellId(x, y),
      x,
      y,
      question: `${left} + ${right}`,
      correctAnswerNumber,
      answerOptions: [],
      solved: false,
      visited: false,
      isExit: cellId(x, y) === exitCellId,
      isDeadEnd: false,
    };
  });

  /** @type {Path[]} */
  const paths = [];
  const outgoingMap = new Map();
  const cellMap = new Map(cells.map((cell) => [cell.id, cell]));
  const usedCells = new Set(solutionPath);

  const markDeadEnd = (cellIdToMark) => {
    const cell = cellMap.get(cellIdToMark);
    if (cell) {
      cell.isDeadEnd = true;
    }
  };

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
    outgoingMap.set(fromId, [...(outgoingMap.get(fromId) || []), toId]);
  };

  const getOutgoingCount = (cellIdToCount) =>
    (outgoingMap.get(cellIdToCount) || []).length;

  const availableNeighbors = (cellIdToCheck, excludeIds = new Set()) => {
    const { x, y } = cellCoords(cellIdToCheck);
    return shuffle(
      neighborCandidates(x, y, allDirections).map((candidate) => cellId(candidate.x, candidate.y))
    ).filter(
      (candidateId) =>
        !excludeIds.has(candidateId) && candidateId !== exitCellId
    );
  };

  const addSideDeadEnd = (fromId, excludeIds) => {
    const candidates = availableNeighbors(fromId, excludeIds);
    if (candidates.length === 0) {
      return null;
    }
    const terminalId = candidates[0];
    usedCells.add(terminalId);
    markDeadEnd(terminalId);
    addEdge({ fromId, toId: terminalId, isCorrectEdge: false });
    return terminalId;
  };

  const buildWrongCorridor = (fromId, startId, minLen = 2, maxLen = 3) => {
    if (usedCells.has(startId) || solutionSet.has(startId)) {
      return null;
    }

    addEdge({ fromId, toId: startId, isCorrectEdge: false });
    const corridorNodes = [startId];
    const corridorSteps = minLen + Math.floor(randomFloat() * (maxLen - minLen + 1)) - 1;

    for (let step = 0; step < corridorSteps; step += 1) {
      const currentId = corridorNodes[corridorNodes.length - 1];
      const exclude = new Set([
        fromId,
        exitCellId,
        ...solutionPath,
        ...usedCells,
        ...corridorNodes,
      ]);
      const nextCandidates = availableNeighbors(currentId, exclude);
      if (nextCandidates.length === 0) {
        return null;
      }
      const nextId = nextCandidates[0];
      corridorNodes.push(nextId);
    }

    if (corridorNodes.length < minLen) {
      return null;
    }

    corridorNodes.forEach((nodeId) => usedCells.add(nodeId));
    const terminalId = corridorNodes[corridorNodes.length - 1];
    markDeadEnd(terminalId);

    for (let i = 0; i < corridorNodes.length - 1; i += 1) {
      addEdge({
        fromId: corridorNodes[i],
        toId: corridorNodes[i + 1],
        isCorrectEdge: false,
      });
    }

    for (let i = 0; i < corridorNodes.length - 1; i += 1) {
      const nodeId = corridorNodes[i];
      const neighborCount = neighborCandidates(
        cellCoords(nodeId).x,
        cellCoords(nodeId).y,
        allDirections
      ).length;
      const desiredOptions = neighborCount >= 3 ? 3 : 2;
      while (getOutgoingCount(nodeId) < desiredOptions) {
        const exclude = new Set([
          fromId,
          exitCellId,
          ...solutionPath,
          ...usedCells,
          ...corridorNodes,
        ]);
        if (!addSideDeadEnd(nodeId, exclude)) {
          return null;
        }
      }
    }

    return startId;
  };

  let generationFailed = false;
  solutionPath.slice(0, -1).forEach((fromId) => {
    const nextOnSolution = solutionNextMap.get(fromId);
    const prevOnSolution = solutionPrevMap.get(fromId);
    const { x, y } = cellCoords(fromId);
    const candidates = neighborCandidates(x, y, allDirections);
    const neighborCount = candidates.length;
    const minOptions = neighborCount >= 3 ? 3 : 2;
    const wrongNeeded = Math.max(0, minOptions - 1);
    const wrongTargets = [];

    const shuffledCandidates = shuffle(
      candidates.map((candidate) => cellId(candidate.x, candidate.y))
    );
    const candidateWrongNeighbors = shuffledCandidates.filter(
      (candidateId) =>
        !solutionSet.has(candidateId) &&
        candidateId !== nextOnSolution &&
        candidateId !== prevOnSolution &&
        candidateId !== exitCellId
    );

    candidateWrongNeighbors.forEach((candidateId) => {
      if (wrongTargets.length >= wrongNeeded) {
        return;
      }
      if (candidateId === nextOnSolution) {
        return;
      }
      const corridorStartId = buildWrongCorridor(fromId, candidateId, 2, 3);
      if (corridorStartId) {
        wrongTargets.push(corridorStartId);
      }
    });

    if (wrongTargets.length < wrongNeeded) {
      generationFailed = true;
      return;
    }

    addEdge({ fromId, toId: nextOnSolution, isCorrectEdge: true });
    wrongTargets.forEach((toId) => addEdge({ fromId, toId, isCorrectEdge: false }));
  });

  const assignAnswerNumbers = () => {
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
      const options = buildAnswerOptions(
        cell.correctAnswerNumber,
        edges.length,
        cell.x + cell.y * gridSize
      );
      cell.answerOptions = options;

      if (solutionSet.has(cell.id)) {
        const wrongOptions = options.filter(
          (option) => option !== cell.correctAnswerNumber
        );
        let wrongIndex = 0;
        edges.forEach((edge) => {
          edge.answerNumber = edge.isCorrectEdge
            ? cell.correctAnswerNumber
            : wrongOptions[wrongIndex++ % wrongOptions.length];
        });
      } else {
        edges.forEach((edge, index) => {
          edge.answerNumber = options[index % options.length];
        });
      }
    });
  };

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

  assignAnswerNumbers();
  if (generationFailed || !validateMaze()) {
    return null;
  }

  return { cells, paths, solutionPath };
};

const generateMazeWithRetries = (attempts = 30) => {
  for (let i = 0; i < attempts; i += 1) {
    const result = generateMazeOnce();
    if (result) {
      return result;
    }
  }
  return null;
};

const buildFallbackMaze = () => {
  const solutionPath = [
    startCellId,
    cellId(1, 1),
    cellId(1, 0),
    cellId(2, 0),
    cellId(3, 1),
    cellId(3, 2),
    cellId(2, 3),
    cellId(2, 4),
    cellId(3, 4),
    cellId(4, 3),
    exitCellId,
  ];
  const solutionSet = new Set(solutionPath);

  /** @type {Cell[]} */
  const cells = Array.from({ length: gridSize * gridSize }, (_, index) => {
    const x = index % gridSize;
    const y = Math.floor(index / gridSize);
    const [left, right] = questionSeeds[index];
    const correctAnswerNumber = left + right;

    return {
      id: cellId(x, y),
      x,
      y,
      question: `${left} + ${right}`,
      correctAnswerNumber,
      answerOptions: [],
      solved: false,
      visited: false,
      isExit: cellId(x, y) === exitCellId,
      isDeadEnd: false,
    };
  });

  const cellMap = new Map(cells.map((cell) => [cell.id, cell]));
  /** @type {Path[]} */
  const paths = [];

  const addEdge = ({ fromId, toId, isCorrectEdge }) => {
    const fromCell = cellMap.get(fromId);
    const toCell = cellMap.get(toId);
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
    const nextId = solutionPath[index + 1];
    const fromCell = cellMap.get(fromId);
    const { x, y } = cellCoords(fromId);
    const candidates = shuffle(
      neighborCandidates(x, y, allDirections)
        .map((candidate) => cellId(candidate.x, candidate.y))
        .filter((candidateId) => candidateId !== nextId)
    );
    const wrongTargets = [];
    candidates.forEach((candidateId) => {
      if (wrongTargets.length >= 2) {
        return;
      }
      if (!solutionSet.has(candidateId)) {
        wrongTargets.push(candidateId);
      }
    });
    if (wrongTargets.length < 2) {
      candidates.forEach((candidateId) => {
        if (wrongTargets.length >= 2) {
          return;
        }
        if (!wrongTargets.includes(candidateId)) {
          wrongTargets.push(candidateId);
        }
      });
    }

    addEdge({ fromId, toId: nextId, isCorrectEdge: true });
    wrongTargets.forEach((wrongId) => {
      addEdge({ fromId, toId: wrongId, isCorrectEdge: false });
      const wrongCell = cellMap.get(wrongId);
      if (wrongCell) {
        wrongCell.isDeadEnd = true;
        wrongCell.answerOptions = [];
      }
    });

    const outgoing = paths.filter((edge) => edge.fromCellId === fromId);
    const options = buildAnswerOptions(
      fromCell.correctAnswerNumber,
      outgoing.length,
      x + y * gridSize
    );
    fromCell.answerOptions = options;
    const wrongOptions = options.filter((option) => option !== fromCell.correctAnswerNumber);
    let wrongIndex = 0;
    outgoing.forEach((edge) => {
      edge.answerNumber = edge.isCorrectEdge
        ? fromCell.correctAnswerNumber
        : wrongOptions[wrongIndex++ % wrongOptions.length];
    });
  });

  return { cells, paths, solutionPath };
};

// Get random maze preset
const selectedMaze = getRandomMaze();

// Generate questions at runtime for each cell (grade from storage, default 5)
const grade = getGrade();
const generatedQuestions = generateQuestions(gridSize * gridSize, grade);

// Create cells with generated questions
const cells = Array.from({ length: gridSize * gridSize }, (_, index) => {
  const x = index % gridSize;
  const y = Math.floor(index / gridSize);
  const questionData = generatedQuestions[index];
  const cellIdStr = cellId(x, y);

  return {
    id: cellIdStr,
    x,
    y,
    question: questionData.question,
    correctAnswerNumber: questionData.answer,
    answerOptions: [],
    solved: false,
    visited: false,
    isExit: cellIdStr === exitCellId,
    isDeadEnd: false, // Will be set below
  };
});

// Use paths from selected maze, but we need to assign answer numbers
const paths = selectedMaze.paths.map(p => ({ ...p }));
const solutionPath = [...selectedMaze.solutionPath];
const solutionSet = new Set(solutionPath);

// Mark dead ends - cells that are not on solution path and have no outgoing paths
const cellMap = new Map(cells.map((cell) => [cell.id, cell]));
const outgoingMap = new Map();
paths.forEach((path) => {
  outgoingMap.set(path.fromCellId, [...(outgoingMap.get(path.fromCellId) || []), path.toCellId]);
});

cells.forEach((cell) => {
  if (cell.isExit) {
    return;
  }
  // A cell is a dead end if it's not on the solution path and has no outgoing paths
  if (!solutionSet.has(cell.id) && (!outgoingMap.has(cell.id) || outgoingMap.get(cell.id).length === 0)) {
    cell.isDeadEnd = true;
  }
});

// Assign answer numbers to paths (using existing logic)
const assignAnswerNumbers = () => {
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
    const options = buildAnswerOptions(
      cell.correctAnswerNumber,
      edges.length,
      cell.x + cell.y * gridSize
    );
    cell.answerOptions = options;

    if (solutionSet.has(cell.id)) {
      const wrongOptions = options.filter(
        (option) => option !== cell.correctAnswerNumber
      );
      let wrongIndex = 0;
      edges.forEach((edge) => {
        edge.answerNumber = edge.isCorrectEdge
          ? cell.correctAnswerNumber
          : wrongOptions[wrongIndex++ % wrongOptions.length];
      });
    } else {
      edges.forEach((edge, index) => {
        edge.answerNumber = options[index % options.length];
      });
    }
  });
};

assignAnswerNumbers();

export const demoMaze = {
  gridSize,
  cells,
  paths,
  startCellId,
  exitCellId,
  solutionPath,
};
