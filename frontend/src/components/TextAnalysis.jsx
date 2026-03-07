import React from "react";

function TextAnalysis({ inputText, setInputText, loading, analyzeText }) {
  return (
    <div className="input-section" style={{ marginBottom: 24 }}>
      <textarea
        className="input-box"
        placeholder="Paste or type text to analyze..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        rows={4}
        style={{
          width: "100%",
          borderRadius: 16,
          border: "1px solid #e5e5e7",
          padding: 16,
          fontSize: 15,
          fontFamily: "inherit",
          marginBottom: 12,
          background: "#f9f9fb",
          color: "#1d1d1f",
          resize: "vertical",
          boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
        }}
      />
      <button
        className="action-btn"
        style={{
          width: "100%",
          padding: 14,
          borderRadius: 16,
          fontWeight: 700,
          fontSize: 15,
          background: "#1d1d1f",
          color: "#fff",
          border: "none",
          marginTop: 4,
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
        disabled={loading || !inputText.trim()}
        onClick={() => analyzeText(inputText)}
      >
        Analyze Text
      </button>
    </div>
  );
}

export default TextAnalysis;
