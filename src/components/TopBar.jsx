export default function TopBar({ debugInfo, timeDisplay, recordDisplay }) {
  return (
    <div className="topbar-content">
      <div className="game-title">
        Number Path Runner
        <span className="game-mode">Maze Mode</span>
      </div>
      <div className="timer-stack">
        <div className="timer-chip" aria-label="Time">
          {timeDisplay}
        </div>
        {recordDisplay != null ? (
          <div className="timer-chip record-chip" aria-label="Best record">
            Best: {recordDisplay}
          </div>
        ) : null}
        <div className="debug-line" aria-live="polite">
          {debugInfo.currentCellId} · moving: {String(debugInfo.isMoving)} · last:{" "}
          {debugInfo.lastMoveType}
        </div>
      </div>
    </div>
  );
}
