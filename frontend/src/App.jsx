import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";

function App() {
  const [prediction, setPrediction] = useState("Analyzing...");
  const [isScam, setIsScam] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [explanation, setExplanation] = useState([]);
  const [loading, setLoading] = useState(true);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const tagVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: i => ({
      scale: 1,
      opacity: 1,
      transition: { delay: i * 0.1, type: "spring", stiffness: 300 }
    })
  };

  async function analyzeText(text) {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await response.json();
      
      setPrediction(data.prediction.toUpperCase());
      setIsScam(data.prediction === "scam");
      setConfidence(data.confidence * 100);
      setExplanation(data.explanation || []);
    } catch (error) {
      setPrediction("Error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    chrome.storage?.local.get(["selectedText"], (res) => {
      if (res?.selectedText) analyzeText(res.selectedText);
      else { setPrediction("No Text"); setLoading(false); }
    });
  }, []);

  return (
    <div className={`container ${isScam === true ? 'scam-bg' : isScam === false ? 'legit-bg' : ''}`}>
      <motion.div 
        className="card"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="header">
          <div className="brand-group">
            <motion.span 
              animate={loading ? { scale: [1, 1.2, 1] } : {}}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="shield-icon"
            >
              {isScam ? "🚫" : isScam === false ? "✅" : "🛡️"}
            </motion.span>
            <h2 className="brand-name">ScamShield</h2>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.span 
              key={prediction}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className={`badge ${isScam ? "scam" : isScam === false ? "legit" : "neutral"}`}
            >
              {prediction}
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="confidence-section">
          <div className="label-row">
            <span>Security Confidence</span>
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="percentage-text"
            >
              {loading ? "--" : `${confidence.toFixed(1)}%`}
            </motion.span>
          </div>
          <div className="progress-bar">
            <motion.div
              className={`progress ${isScam ? "scam" : "legit"}`}
              initial={{ width: 0 }}
              animate={{ width: loading ? "30%" : `${confidence}%` }}
              transition={{ duration: 1, ease: "circOut" }}
            />
          </div>
        </div>

        <AnimatePresence>
          {!loading && explanation.length > 0 && (
            <motion.div 
              className="explanation"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
            >
              <p className="explanation-title">Key Indicators Found:</p>
              <div className="tags">
                {explanation.map((word, i) => (
                  <motion.span 
                    key={word}
                    custom={i}
                    variants={tagVariants}
                    initial="hidden"
                    animate="visible"
                    className="tag"
                  >
                    {word}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="action-btn"
          onClick={() => window.close()}
        >
          Dismiss
        </motion.button>
<motion.button 
  whileHover={{ scale: 1.02, backgroundColor: '#f8fafc' }}
  whileTap={{ scale: 0.98 }}
  className="secondary-btn"
  onClick={() => {
    const report = `🛡️ ScamShield Alert!\nStatus: ${prediction}\nConfidence: ${confidence}%\nFlags: ${explanation.join(", ")}`;
    navigator.clipboard.writeText(report);
  }}
>
  Copy Security Report
</motion.button>        
      </motion.div>
    </div>
  );
}

export default App;