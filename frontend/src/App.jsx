import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Auto-fill selected text from extension storage
  useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.get(["selectedText"], (res) => {
        if (res.selectedText) {
          setMessage(res.selectedText);
          chrome.storage.local.remove("selectedText");
        }
      });
    }
  }, []);

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setResult({ error: "Failed to connect to backend." });
    }
    setLoading(false);
  };

  return (
    <div className="w-[400px] min-h-[550px] bg-[var(--scamshield-dark)] p-6">
      <div className="w-full max-w-2xl flex flex-col items-center gap-8 bg-[var(--scamshield-dark)] rounded-3xl shadow-2xl p-10 border border-[var(--scamshield-accent)]/30">
        
        <h1
          className="text-5xl font-extrabold text-center tracking-tight"
          style={{ color: "var(--scamshield-light)", letterSpacing: "-0.03em" }}
        >
          <span style={{ color: "var(--scamshield-accent)" }}>Scam</span>
          <span style={{ color: "var(--scamshield-light)" }}>Shield</span>
        </h1>

        <p
          className="text-center max-w-xl leading-relaxed text-lg font-medium"
          style={{ color: "var(--scamshield-accent)" }}
        >
          ScamShield is an{" "}
          <span
            className="font-bold"
            style={{ color: "var(--scamshield-light)" }}
          >
            AI-powered
          </span>{" "}
          message analysis tool that detects scam messages and provides
          explainable predictions to help users stay safe.
        </p>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Paste your message here…"
          className="w-full max-w-xl h-48 p-4 rounded-2xl border resize-none focus:outline-none focus:ring-2 focus:border-transparent placeholder:opacity-60 text-base shadow-lg"
          style={{
            backgroundColor: "var(--scamshield-bg)",
            borderColor: "var(--scamshield-accent)",
            color: "var(--scamshield-light)",
            "--tw-ring-color": "var(--scamshield-accent)",
            fontFamily: "inherit",
          }}
        />

        <Button
          onClick={handleAnalyze}
          disabled={!message.trim() || loading}
          className="px-10 py-3 rounded-xl font-semibold text-lg transition-colors duration-200 shadow-md disabled:cursor-not-allowed"
          style={{
            backgroundColor: !message.trim()
              ? "var(--scamshield-dark)"
              : "var(--scamshield-accent)",
            color: !message.trim()
              ? "var(--scamshield-accent)"
              : "var(--scamshield-bg)",
            opacity: !message.trim() ? 0.5 : 1,
            border: "none",
          }}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </Button>

        {/* Show Result */}
        {result && (
          <div
            className="w-full max-w-xl p-4 rounded-xl mt-4 text-center"
            style={{
              backgroundColor: "var(--scamshield-bg)",
              color: "var(--scamshield-light)",
              border: "1px solid var(--scamshield-accent)",
            }}
          >
            {result.error ? (
              <p>{result.error}</p>
            ) : (
              <>
                <p className="font-bold text-lg">
                  Prediction: {result.label}
                </p>
                <p className="mt-2 text-sm opacity-80">
                  Confidence: {result.confidence}
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;