import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import TextAnalysis from "./components/TextAnalysis";
import QRScan from "./components/QRScan";
import ResultCard from "./components/ResultCard";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("text"); // 'text' or 'qr'
  const [inputText, setInputText] = useState("");
  const [qrFile, setQrFile] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [isScam, setIsScam] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [explanation, setExplanation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const tagVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: (i) => ({
      scale: 1,
      opacity: 1,
      transition: { delay: i * 0.1, type: "spring", stiffness: 300 },
    }),
  };

  async function analyzeText(text) {
    if (!text) {
      setPrediction("");
      setLoading(false);
      return;
    }
    setLoading(true);
    setPrediction("Analyzing...");
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
      setIsScam(null);
      setConfidence(0);
      setExplanation([]);
    } finally {
      setLoading(false);
    }
  }

  async function analyzeQr(file) {
    if (!file) {
      setPrediction("");
      setLoading(false);
      return;
    }
    setLoading(true);
    setPrediction("Analyzing...");
    setIsScam(null);
    setConfidence(0);
    setExplanation([]);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("http://127.0.0.1:8000/predict-qr", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      // If prediction is present, use ML result (plain text QR)
      if (data.prediction) {
        setPrediction(data.prediction.toUpperCase());
        setIsScam(data.prediction === "scam");
        setConfidence(data.confidence ? data.confidence * 100 : 0);
        setExplanation(data.explanation || []);
      } else if (data.url_risks && data.url_risks.length > 0) {
        // For QR with URL, only show verdict (safe or not)
        setPrediction(data.url_risks[0]);
        setIsScam(null);
        setConfidence(0);
        setExplanation([]);
      } else if (data.detail && data.detail.includes("No QR code found")) {
        setPrediction("No QR code found in image");
        setIsScam(null);
        setConfidence(0);
        setExplanation([]);
      } else {
        setPrediction("No Result");
        setIsScam(null);
        setConfidence(0);
        setExplanation([]);
      }
    } catch (error) {
      setPrediction("Error");
      setIsScam(null);
      setConfidence(0);
      setExplanation([]);
    } finally {
      setLoading(false);
      setQrModalOpen(false);
      setQrFile(null);
    }
  }

  useEffect(() => {
    // Always clear prediction/loading before checking for input
    setPrediction("");
    setLoading(false);
    // Check for QR image scan intent
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("qrImage")) {
      chrome.storage?.local.get(["qrImageUrl"], (res) => {
        if (res?.qrImageUrl) {
          // Fetch the image, convert to blob/file, and analyze
          setLoading(true);
          setPrediction("Analyzing...");
          fetch(res.qrImageUrl)
            .then((r) => r.blob())
            .then((blob) => {
              const file = new File([blob], "qr-image.png", {
                type: blob.type,
              });
              analyzeQr(file);
            })
            .catch(() => {
              setPrediction("Error loading image");
              setLoading(false);
            });
        } else {
          setPrediction("");
          setLoading(false);
        }
      });
    } else {
      chrome.storage?.local.get(["selectedText"], (res) => {
        if (res?.selectedText) {
          setInputText(res.selectedText);
          setLoading(true);
          setPrediction("Analyzing...");
          analyzeText(res.selectedText);
        } else {
          setPrediction("");
          setLoading(false);
        }
      });
    }
  }, []);

  return (
    <div
      className={`container ${isScam === true ? "scam-bg" : isScam === false ? "legit-bg" : ""}`}
      style={{
        minHeight: "100vh",
        background: "#f6f7fb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: 480 }}>
        {/* Navbar */}
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        <motion.div
          className={`card ${isScam ? "scam-detected" : ""}`}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          style={{
            borderRadius: 24,
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            border: "1px solid #e5e5e7",
            background: "#fff",
            padding: 32,
          }}
        >
          <div
            className="header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <div
              className="brand-group"
              style={{ display: "flex", alignItems: "center", gap: 12 }}
            >
              <motion.span
                animate={loading ? { scale: [1, 1.2, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="shield-icon"
                style={{ fontSize: 28 }}
              >
                {isScam ? "🚫" : isScam === false ? "✅" : "🛡️"}
              </motion.span>
              <span
                className="brand-name"
                style={{ fontWeight: 700, fontSize: 20, color: "#1d1d1f" }}
              >
                ScamShield
              </span>
            </div>
            <AnimatePresence mode="wait">
              <motion.span
                key={prediction}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className={`badge ${isScam ? "scam" : isScam === false ? "legit" : "neutral"}`}
                style={{
                  padding: "6px 16px",
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                  background: isScam
                    ? "#ffebeb"
                    : isScam === false
                      ? "#e8f9ee"
                      : "#f2f2f7",
                  color: isScam
                    ? "#ff3b30"
                    : isScam === false
                      ? "#34c759"
                      : "#86868b",
                }}
              >
                {prediction}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Text Analysis Tab */}
          {activeTab === "text" && (
            <TextAnalysis
              inputText={inputText}
              setInputText={setInputText}
              loading={loading}
              analyzeText={analyzeText}
            />
          )}

          {/* QR Scan Tab */}
          {activeTab === "qr" && (
            <QRScan
              qrModalOpen={qrModalOpen}
              setQrModalOpen={setQrModalOpen}
              qrFile={qrFile}
              setQrFile={setQrFile}
              loading={loading}
              analyzeQr={analyzeQr}
            />
          )}

          {/* Show full result card for text, only verdict for QR */}
          {activeTab === "text" ? (
            <ResultCard
              isScam={isScam}
              prediction={prediction}
              confidence={confidence}
              explanation={explanation}
              loading={loading}
              tagVariants={tagVariants}
            />
          ) : (
            <ResultCard
              isScam={null}
              prediction={prediction}
              confidence={0}
              explanation={[]}
              loading={loading}
              tagVariants={tagVariants}
            />
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
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
            onClick={() => window.close()}
          >
            Dismiss
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: "#f8fafc" }}
            whileTap={{ scale: 0.98 }}
            className="secondary-btn"
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 16,
              fontWeight: 600,
              fontSize: 14,
              background: "#fff",
              color: "#86868b",
              border: "1px solid #e5e5e7",
              marginTop: 8,
            }}
            onClick={() => {
              const report = `🛡️ ScamShield Alert!\nStatus: ${prediction}\nConfidence: ${confidence}%\nFlags: ${explanation.join(", ")}`;
              navigator.clipboard.writeText(report);
            }}
          >
            Copy Security Report
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

export default App;
