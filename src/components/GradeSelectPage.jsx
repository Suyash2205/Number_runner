import { useState, useCallback } from "react";
import { generateQuestion, setGrade, getGrade } from "../data/questionGenerator.js";

export default function GradeSelectPage({ onStart }) {
  const [selectedGrade, setSelectedGrade] = useState(getGrade);
  const [preview, setPreview] = useState(() => generateQuestion(getGrade()));

  const handleSelect = useCallback((grade) => {
    setGrade(grade);
    setSelectedGrade(grade);
    setPreview(generateQuestion(grade));
  }, []);

  const handleStart = useCallback(() => {
    setGrade(selectedGrade);
    onStart();
  }, [selectedGrade, onStart]);

  const refreshPreview = useCallback(() => {
    setPreview(generateQuestion(selectedGrade));
  }, [selectedGrade]);

  return (
    <div className="grade-select-page">
      <div className="grade-select-card">
        <h1 className="grade-select-title">Number Path Runner</h1>
        <p className="grade-select-subtitle">Choose your grade</p>
        <div className="grade-select-buttons">
          {[3, 4, 5, 6, 7].map((g) => (
            <button
              key={g}
              type="button"
              className={`grade-select-btn${selectedGrade === g ? " selected" : ""}`}
              onClick={() => handleSelect(g)}
            >
              Grade {g}
            </button>
          ))}
        </div>
        <div className="grade-select-preview">
          <span className="grade-select-preview-label">Sample question:</span>
          <span className="grade-select-preview-question">{preview.question}</span>
          <button type="button" className="grade-select-refresh" onClick={refreshPreview}>
            New
          </button>
        </div>
        <button type="button" className="grade-select-start" onClick={handleStart}>
          Start Game
        </button>
      </div>
    </div>
  );
}
