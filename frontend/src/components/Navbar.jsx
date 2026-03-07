import React from "react";

function Navbar({ activeTab, setActiveTab }) {
  return (
    <nav
      className="navbar"
      style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}
    >
      <button
        className={`nav-btn ${activeTab === "text" ? "active" : ""}`}
        style={{
          padding: "10px 32px",
          borderRadius: "16px 0 0 16px",
          border: "none",
          background: activeTab === "text" ? "#fff" : "#f2f2f7",
          color: activeTab === "text" ? "#1d1d1f" : "#86868b",
          fontWeight: "700",
          fontSize: "16px",
          boxShadow:
            activeTab === "text" ? "0 2px 8px rgba(0,0,0,0.04)" : "none",
          transition: "background 0.2s, color 0.2s",
        }}
        onClick={() => setActiveTab("text")}
      >
        Text Analysis
      </button>
      <button
        className={`nav-btn ${activeTab === "qr" ? "active" : ""}`}
        style={{
          padding: "10px 32px",
          borderRadius: "0 16px 16px 0",
          border: "none",
          background: activeTab === "qr" ? "#fff" : "#f2f2f7",
          color: activeTab === "qr" ? "#1d1d1f" : "#86868b",
          fontWeight: "700",
          fontSize: "16px",
          boxShadow: activeTab === "qr" ? "0 2px 8px rgba(0,0,0,0.04)" : "none",
          transition: "background 0.2s, color 0.2s",
        }}
        onClick={() => setActiveTab("qr")}
      >
        QR Scan
      </button>
    </nav>
  );
}

export default Navbar;
