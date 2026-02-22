import { useState } from "react";
import { Button } from "@/components/ui/button";
import "./App.css";
function App() {
  const [message, setMessage] = useState("");

  const handleAnalyze = () => {
    // Placeholder for analysis logic
    console.log("Analyzing message:", message);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
    >
      <div className="w-full max-w-2xl flex flex-col items-center gap-8 bg-[var(--scamshield-dark)] rounded-3xl shadow-2xl p-10 border border-[var(--scamshield-accent)]/30">
        {/* Title */}
        <h1
          className="text-5xl font-extrabold text-center tracking-tight"
          style={{ color: "var(--scamshield-light)", letterSpacing: "-0.03em" }}
        >
          <span style={{ color: "var(--scamshield-accent)" }}>Scam</span>
          <span style={{ color: "var(--scamshield-light)" }}>Shield</span>
        </h1>

        {/* Description */}
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

        {/* Input Section */}
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

        {/* Analyze Button */}
        <Button
          onClick={handleAnalyze}
          disabled={!message.trim()}
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
          Analyze
        </Button>
      </div>
    </div>
  );
}

export default App;
