import { useState, lazy, Suspense } from "react";
import GradeSelectPage from "./components/GradeSelectPage.jsx";

const GameView = lazy(() => import("./components/GameView.jsx"));

export default function App() {
  const [view, setView] = useState("grade-select");

  if (view === "grade-select") {
    return <GradeSelectPage onStart={() => setView("maze")} />;
  }

  return (
    <Suspense fallback={<div className="grade-select-page">Loading…</div>}>
      <GameView />
    </Suspense>
  );
}
