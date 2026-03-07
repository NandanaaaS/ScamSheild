import React from "react";
import { motion, AnimatePresence } from "framer-motion";

function ResultCard({
  isScam,
  prediction,
  confidence,
  explanation,
  loading,
  tagVariants,
}) {
  return (
    <>
      <div
        className="confidence-section"
        style={{
          background: "#fbfbfd",
          padding: 18,
          borderRadius: 16,
          border: "1px solid #f2f2f7",
          marginBottom: 18,
        }}
      >
        <div
          className="label-row"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 10,
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 600, color: "#86868b" }}>
            Security Confidence
          </span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="percentage-text"
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: "#1d1d1f",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {loading ? "--" : `${confidence.toFixed(1)}%`}
          </motion.span>
        </div>
        <div
          className="progress-bar"
          style={{
            height: 8,
            background: "#e5e5ea",
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          <motion.div
            className={`progress ${isScam ? "scam" : "legit"}`}
            initial={{ width: 0 }}
            animate={{ width: loading ? "30%" : `${confidence}%` }}
            transition={{ duration: 1, ease: "circOut" }}
            style={{
              height: "100%",
              borderRadius: 10,
              background: isScam ? "#ff3b30" : "#34c759",
              boxShadow: isScam
                ? "0 0 10px rgba(255,59,48,0.3)"
                : "0 0 10px rgba(52,199,89,0.3)",
            }}
          />
        </div>
      </div>
      <AnimatePresence>
        {!loading && explanation.length > 0 && (
          <motion.div
            className="explanation"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            style={{ marginBottom: 18 }}
          >
            <p
              className="explanation-title"
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#86868b",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Key Indicators Found:
            </p>
            <div
              className="tags"
              style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
            >
              {explanation.map((word, i) => (
                <motion.span
                  key={word}
                  custom={i}
                  variants={tagVariants}
                  initial="hidden"
                  animate="visible"
                  className="tag"
                  style={{
                    background: "#fff",
                    border: "1px solid #e5e5e7",
                    padding: "7px 14px",
                    borderRadius: 12,
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#48484a",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default ResultCard;
