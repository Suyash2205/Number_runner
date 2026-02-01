import { useMemo, useRef, useState, useEffect } from "react";
import { demoMaze } from "../data/mazeData.js";

const percent = (value, max) => `${(value / max) * 100}%`;

const getCenter = (cell, gridSize) => ({
  x: cell.x + 0.5,
  y: cell.y + 0.5,
  left: percent(cell.x + 0.5, gridSize),
  top: percent(cell.y + 0.5, gridSize),
});

const buildPathStyle = (fromCell, toCell, gridSize) => {
  const from = getCenter(fromCell, gridSize);
  const to = getCenter(toCell, gridSize);
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

  return {
    lineStyle: {
      left: from.left,
      top: from.top,
      width: percent(length, gridSize),
      transform: `translateY(-50%) rotate(${angle}deg)`,
    },
    labelStyle: {
      left: percent((from.x + to.x) / 2, gridSize),
      top: percent((from.y + to.y) / 2, gridSize),
      "--label-offset-x": `${(-dy / length) * 12}px`,
      "--label-offset-y": `${(dx / length) * 12}px`,
    },
  };
};

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

const MOVE_DURATION_MS = 260;
const directionFromDelta = (dx, dy) => {
  const key = `${dx},${dy}`;
  switch (key) {
    case "0,-1":
      return "N";
    case "0,1":
      return "S";
    case "1,0":
      return "E";
    case "-1,0":
      return "W";
    case "1,-1":
      return "NE";
    case "-1,-1":
      return "NW";
    case "1,1":
      return "SE";
    case "-1,1":
      return "SW";
    default:
      return "UNK";
  }
};

const labelPositionClass = (direction) => {
  switch (direction) {
    case "N":
      return "pos-n";
    case "S":
      return "pos-s";
    case "E":
      return "pos-e";
    case "W":
      return "pos-w";
    case "NE":
      return "pos-ne";
    case "NW":
      return "pos-nw";
    case "SE":
      return "pos-se";
    case "SW":
      return "pos-sw";
    default:
      return "pos-n";
  }
};

export default function MazeViewport({
  onDebugChange = () => {},
  onReachExit = () => {},
  elapsedSeconds = 0,
  timeDisplay = "00:00",
  finishTimeFormatted = null,
  finishIsNewRecord = false,
}) {
  const { gridSize, cells, paths, startCellId, solutionPath, exitCellId } = demoMaze;
  const cellMap = new Map(cells.map((cell) => [cell.id, cell]));
  const sortedCells = [...cells].sort((a, b) =>
    a.y === b.y ? a.x - b.x : a.y - b.y
  );
  const startCell = cellMap.get(startCellId);
  const [currentCellId, setCurrentCellId] = useState(startCellId);
  const [visitedCells, setVisitedCells] = useState(() => new Set([startCellId]));
  const [solvedCells, setSolvedCells] = useState(() => new Set());
  const [attemptsByCell, setAttemptsByCell] = useState(() => new Map());
  const [chosenAnswerByCell, setChosenAnswerByCell] = useState(() => new Map());
  const [isMoving, setIsMoving] = useState(false);
  const [lastMoveType, setLastMoveType] = useState("none");
  const [revealAll, setRevealAll] = useState(false);
  const [hasEscaped, setHasEscaped] = useState(false);
  const moveTimeoutRef = useRef(null);
  const boardRef = useRef(null);
  const [boardSize, setBoardSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!boardRef.current) {
      return;
    }
    const node = boardRef.current;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setBoardSize({ width, height });
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    onDebugChange({ currentCellId, isMoving, lastMoveType });
  }, [currentCellId, isMoving, lastMoveType, onDebugChange]);

  useEffect(() => {
    if (currentCellId === exitCellId && !hasEscaped) {
      setHasEscaped(true);
      setRevealAll(true);
      setIsMoving(false);
      onReachExit();
    }
  }, [currentCellId, exitCellId, hasEscaped, onReachExit]);

  useEffect(() => {
    return () => {
      if (moveTimeoutRef.current) {
        clearTimeout(moveTimeoutRef.current);
      }
    };
  }, []);

  const solutionNextMap = useMemo(() => {
    const map = new Map();
    for (let index = 0; index < solutionPath.length - 1; index += 1) {
      map.set(solutionPath[index], solutionPath[index + 1]);
    }
    return map;
  }, [solutionPath]);

  const solutionSet = useMemo(() => new Set(solutionPath), [solutionPath]);

  const { pathRenderData, pathMap, adjacencyMap, outgoingMap } = useMemo(() => {
    const map = new Map();
    const adjacency = new Map();
    const outgoing = new Map();

    const renderData = paths.map((path) => {
      const fromCell = cellMap.get(path.fromCellId);
      const toCell = cellMap.get(path.toCellId);
      const key = `${path.fromCellId}-${path.toCellId}`;

      map.set(key, path);
      outgoing.set(
        path.fromCellId,
        [...(outgoing.get(path.fromCellId) || []), key]
      );
      adjacency.set(
        path.fromCellId,
        new Set([...(adjacency.get(path.fromCellId) || []), path.toCellId])
      );
      adjacency.set(
        path.toCellId,
        new Set([...(adjacency.get(path.toCellId) || []), path.fromCellId])
      );

      return {
        key,
        fromCellId: path.fromCellId,
        toCellId: path.toCellId,
        answerNumber: path.answerNumber,
        isCorrectEdge: path.isCorrectEdge,
        ...buildPathStyle(fromCell, toCell, gridSize),
      };
    });

    return {
      pathRenderData: renderData,
      pathMap: map,
      adjacencyMap: adjacency,
      outgoingMap: outgoing,
    };
  }, [cells, paths, gridSize]);

  const currentNeighbors = adjacencyMap.get(currentCellId) || new Set();
  const isVisited = (cellId) => visitedCells.has(cellId);
  const isSolved = (cellId) => solvedCells.has(cellId);
  const markSolved = (cellId) => {
    setSolvedCells((prev) => new Set([...prev, cellId]));
  };
  const markVisited = (cellId) => {
    setVisitedCells((prev) => new Set([...prev, cellId]));
  };
  const visibleSet = useMemo(
    () => new Set([currentCellId, ...currentNeighbors]),
    [currentCellId, currentNeighbors]
  );
  const isVisible = (cellId) => revealAll || visibleSet.has(cellId);
  const isRevealed = (cellId) => isVisible(cellId);
  const getOutgoingEdges = (cellId) =>
    (outgoingMap.get(cellId) || []).map((key) => pathMap.get(key));
  const isTerminalDeadEnd = (cellId) => {
    const cell = cellMap.get(cellId);
    if (!cell || cell.isExit) {
      return false;
    }
    return Boolean(cell.isDeadEnd) && getOutgoingEdges(cellId).length === 0;
  };
  const canBacktrackTo = (cellId) =>
    cellId !== currentCellId && isVisited(cellId) && currentNeighbors.has(cellId);

  const currentOutgoingEdges = getOutgoingEdges(currentCellId);
  const fallbackEdges = useMemo(() => {
    if (currentOutgoingEdges.length > 0) {
      return [];
    }
    const cell = cellMap.get(currentCellId);
    if (!cell || cell.isDeadEnd) {
      return [];
    }
    const neighborIds = Array.from(currentNeighbors);
    if (neighborIds.length === 0) {
      return [];
    }
    const targetCount = Math.min(4, Math.max(2, neighborIds.length));
    const answerOptions = buildAnswerOptions(
      cell.correctAnswerNumber,
      targetCount,
      cell.x + cell.y * gridSize
    );
    return neighborIds.slice(0, targetCount).map((neighborId, index) => {
      const toCell = cellMap.get(neighborId);
      return {
        key: `fallback:${currentCellId}->${neighborId}`,
        fromCellId: currentCellId,
        toCellId: neighborId,
        answerNumber: answerOptions[index],
        isCorrectEdge: false,
        ...buildPathStyle(cell, toCell, gridSize),
      };
    });
  }, [cellMap, currentCellId, currentNeighbors, currentOutgoingEdges.length, gridSize]);
  const labelEdges =
    currentOutgoingEdges.length > 0 ? currentOutgoingEdges : fallbackEdges;
  const isGameOver = false;
  const clickableEdgeIds = labelEdges.map((edge) => edge.toCellId);
  const isDeadEndNow = isTerminalDeadEnd(currentCellId);
  const showEdges = hasEscaped;

  useEffect(() => {
    console.log(
      "currentCell",
      currentCellId,
      "revealed?",
      isRevealed(currentCellId),
      "outgoing",
      labelEdges
    );
  }, [currentCellId, isRevealed, labelEdges]);

  const handleAdvance = (edge) => {
    console.log("[CLICK]", {
      chosen: edge,
      currentCellId,
      timeDisplay,
      elapsedSeconds,
      isMoving,
      hasEscaped,
      isGameOver,
    });
    if (isMoving || hasEscaped) {
      if (isMoving) {
        console.log("blocked: isMoving");
      }
      if (hasEscaped) {
        console.log("blocked: hasEscaped");
      }
      return;
    }
    if (!edge || edge.fromCellId !== currentCellId) {
      console.log("blocked: invalid path");
      return;
    }
    const expectedNext = solutionNextMap.get(edge.fromCellId);
    const fromCell = cellMap.get(edge.fromCellId);
    const toCell = cellMap.get(edge.toCellId);
    const isCorrectMove =
      expectedNext === edge.toCellId &&
      edge.answerNumber === fromCell.correctAnswerNumber;
    const moveDirection = toCell
      ? directionFromDelta(toCell.x - fromCell.x, toCell.y - fromCell.y)
      : "UNK";
    console.log("[MOVE]", {
      from: edge.fromCellId,
      to: edge.toCellId,
      dir: moveDirection,
    });
    console.log(
      "[move]",
      edge.fromCellId,
      edge.answerNumber,
      edge.toCellId,
      isCorrectMove,
      moveDirection
    );
    setIsMoving(true);
    setLastMoveType("forward");
    markSolved(currentCellId);
    markVisited(currentCellId);
    markVisited(edge.toCellId);
    setAttemptsByCell((prev) => {
      const next = new Map(prev);
      next.set(currentCellId, (next.get(currentCellId) || 0) + 1);
      return next;
    });
    setChosenAnswerByCell((prev) => {
      const next = new Map(prev);
      next.set(currentCellId, edge.answerNumber);
      return next;
    });
    setCurrentCellId(edge.toCellId);
    if (moveTimeoutRef.current) {
      clearTimeout(moveTimeoutRef.current);
    }
    moveTimeoutRef.current = setTimeout(() => {
      setIsMoving(false);
    }, MOVE_DURATION_MS);
  };

  const handleBacktrack = (cellId) => {
    if (isMoving || hasEscaped || !canBacktrackTo(cellId)) {
      if (isMoving) {
        console.log("blocked: isMoving");
      }
      if (hasEscaped) {
        console.log("blocked: hasEscaped");
      }
      if (!canBacktrackTo(cellId)) {
        console.log("blocked: not adjacent/visited");
      }
      return;
    }
    const fromCell = cellMap.get(currentCellId);
    const toCell = cellMap.get(cellId);
    const moveDirection = toCell
      ? directionFromDelta(toCell.x - fromCell.x, toCell.y - fromCell.y)
      : "UNK";
    console.log("[move]", currentCellId, null, cellId, false, moveDirection);
    setIsMoving(true);
    setLastMoveType("back");
    setCurrentCellId(cellId);
    if (moveTimeoutRef.current) {
      clearTimeout(moveTimeoutRef.current);
    }
    moveTimeoutRef.current = setTimeout(() => {
      setIsMoving(false);
    }, MOVE_DURATION_MS);
  };

  const currentCell = cellMap.get(currentCellId);
  const cellWidth = boardSize.width / gridSize;
  const cellHeight = boardSize.height / gridSize;
  const spriteLeft = currentCell ? (currentCell.x + 0.5) * cellWidth : 0;
  const spriteTop = currentCell ? (currentCell.y + 0.5) * cellHeight : 0;
  const canShowLabels =
    !cellMap.get(currentCellId)?.isDeadEnd && labelEdges.length > 0;

  return (
    <section className="maze-viewport" aria-label="Maze viewport">
      <div className="maze-frame">
        <div className={`maze-board${isMoving ? " is-moving" : ""}`} ref={boardRef}>
          <div
            className="maze-grid"
            style={{
              gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
              gridTemplateRows: `repeat(${gridSize}, 1fr)`,
            }}
          >
            {sortedCells.map((cell) => {
              const isCurrent = cell.id === currentCellId;
              return (
                <div
                  key={cell.id}
                  className={`maze-cell${cell.isExit ? " is-exit" : ""}${
                    isCurrent ? " is-current" : ""
                  }${isVisited(cell.id) ? " is-visited" : ""}${
                    isSolved(cell.id) ? " is-solved" : ""
                  }${cell.isDeadEnd ? " is-dead-end" : ""}${
                    canBacktrackTo(cell.id) ? " is-clickable" : ""
                  }${!isVisible(cell.id) ? " is-hidden" : ""}${
                    revealAll && solutionSet.has(cell.id) ? " is-solution" : ""
                  }${revealAll ? " is-revealed" : ""}
                  }`}
                  onClick={() => handleBacktrack(cell.id)}
                >
                  <span className="maze-question">{cell.question}</span>
                  {cell.isExit ? <span className="maze-exit-gap" aria-hidden="true" /> : null}
                  {cell.isDeadEnd ? (
                    <span className="maze-deadend-marker" aria-hidden="true" />
                  ) : null}
                  {isCurrent ? (
                    <div className="maze-cell-labels">
                      {canShowLabels
                        ? labelEdges.map((edge) => {
                            const toCell = cellMap.get(edge.toCellId);
                            const dir = toCell
                              ? directionFromDelta(toCell.x - cell.x, toCell.y - cell.y)
                              : "N";
                            return (
                              <button
                                className={`maze-cell-label ${labelPositionClass(dir)}`}
                                key={edge.key}
                                type="button"
                                onClick={() => handleAdvance(edge)}
                              >
                                {edge.answerNumber}
                              </button>
                            );
                          })
                        : null}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          {showEdges ? (
            <div className="maze-paths">
              {pathRenderData.map((path) => (
                <div
                  className={`maze-path-line${
                    revealAll && path.isCorrectEdge ? " is-solution" : ""
                  }`}
                  style={path.lineStyle}
                  key={path.key}
                />
              ))}
            </div>
          ) : null}

          <div className="maze-avatars">
            {startCell && currentCell ? (
              <div
                className="maze-avatar"
                style={{
                  left: `${spriteLeft}px`,
                  top: `${spriteTop}px`,
                  "--sprite-offset-x": "-4px",
                  "--sprite-offset-y": "14px",
                  "--move-duration": `${MOVE_DURATION_MS}ms`,
                }}
                aria-label="Runner"
              />
            ) : null}
          </div>

          {isDeadEndNow && !hasEscaped ? (
            <div className="maze-deadend-overlay" role="status">
              <div className="maze-deadend-title">Dead End</div>
              <div className="maze-deadend-subtitle">Choose a previous cell</div>
            </div>
          ) : null}

          {hasEscaped ? (
            <div className="maze-overlay" role="status">
              <div className="maze-overlay-card">
                <div className="maze-overlay-title">Escaped!</div>
                <div className="maze-overlay-subtitle">
                  Your time: {finishTimeFormatted ?? timeDisplay}
                </div>
                {finishIsNewRecord ? (
                  <div className="maze-overlay-record">New record!</div>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
