import { useEffect, useRef, useState } from "react";
import GameShell from "./GameShell.jsx";
import TopBar from "./TopBar.jsx";
import MazeViewport from "./MazeViewport.jsx";
const RECORD_STORAGE_KEY = "number-path-runner-best-time";

const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

const loadRecord = () => {
  try {
    const stored = localStorage.getItem(RECORD_STORAGE_KEY);
    return stored != null ? parseInt(stored, 10) : null;
  } catch {
    return null;
  }
};

export default function GameView() {
  const [debugInfo, setDebugInfo] = useState({
    currentCellId: "—",
    isMoving: false,
    lastMoveType: "none",
  });
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [recordSeconds, setRecordSeconds] = useState(loadRecord);
  const [finishTime, setFinishTime] = useState(null);
  const [finishIsNewRecord, setFinishIsNewRecord] = useState(false);
  const elapsedRef = useRef(0);
  elapsedRef.current = elapsedSeconds;

  useEffect(() => {
    if (!isTimerRunning) return undefined;
    const timer = setInterval(() => setElapsedSeconds((p) => p + 1), 1000);
    return () => clearInterval(timer);
  }, [isTimerRunning]);

  const handleReachExit = () => {
    const finishedAt = elapsedRef.current;
    setIsTimerRunning(false);
    setFinishTime(finishedAt);
    const currentBest = recordSeconds != null ? recordSeconds : loadRecord();
    const isNewRecord = currentBest == null || finishedAt < currentBest;
    setFinishIsNewRecord(isNewRecord);
    if (isNewRecord) {
      setRecordSeconds(finishedAt);
      try {
        localStorage.setItem(RECORD_STORAGE_KEY, String(finishedAt));
      } catch {
        /* ignore */
      }
    }
  };

  const timeDisplay = formatTime(elapsedSeconds);
  const recordDisplay = recordSeconds != null ? formatTime(recordSeconds) : null;

  return (
    <GameShell
      topBar={
        <TopBar
          debugInfo={debugInfo}
          timeDisplay={timeDisplay}
          recordDisplay={recordDisplay}
        />
      }
      mainContent={
        <MazeViewport
          onDebugChange={setDebugInfo}
          onReachExit={handleReachExit}
          elapsedSeconds={elapsedSeconds}
          timeDisplay={timeDisplay}
          finishTimeFormatted={finishTime != null ? formatTime(finishTime) : null}
          finishIsNewRecord={finishIsNewRecord}
        />
      }
    />
  );
}
