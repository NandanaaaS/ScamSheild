import React from "react";

function TextAnalysis({ inputText, setInputText, loading, analyzeText }) {
  return (
    <div className="input-section">
      <textarea
        className="input-box"
        placeholder="Paste a message, email, or link to scan for scams…"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        rows={4}
      />
      <button
        className="btn btn-primary"
        disabled={loading || !inputText.trim()}
        onClick={() => analyzeText(inputText)}
      >
        {loading ? "Analyzing…" : "Analyze Text"}
      </button>
    </div>
  );
}

export default TextAnalysis;