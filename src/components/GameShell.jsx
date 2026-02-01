export default function GameShell({ topBar, mainContent }) {
  return (
    <div className="game-shell">
      <header className="game-topbar">{topBar}</header>
      <main className="game-stage">
        <div className="maze-shell">{mainContent}</div>
      </main>
    </div>
  );
}
