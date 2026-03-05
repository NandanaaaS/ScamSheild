import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [result, setResult] = useState("Analyzing...");
  const [isScam, setIsScam] = useState(null);
  const [explanation, setExplanation] = useState([]);
  
  async function analyzeText(text) {
    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();

      setIsScam(data.prediction === "scam");

      setResult(
        `${data.prediction.toUpperCase()} (${(data.confidence * 100).toFixed(
          2
        )}%)`
      );
      setExplanation(data.explanation || []);
    } catch (error) {
      setResult("Error connecting to backend");
    }
  }

  useEffect(() => {
    chrome.storage.local.get(["selectedText"], (res) => {
      if (res.selectedText) {
        analyzeText(res.selectedText);
      } else {
        setResult("No text selected");
      }
    });
  }, []);

  return (
    <div className="container">
      <h2>🛡 ScamShield</h2>

      <div className={`result-card ${isScam ? "scam" : "legit"}`}>
        {result}
      </div>
       {explanation.length > 0 && (
      <div className="explanation">
        <strong>Key indicators:</strong>
        <ul>
          {explanation.map((word, index) => (
            <li key={index}>{word}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
  );
}

export default App;