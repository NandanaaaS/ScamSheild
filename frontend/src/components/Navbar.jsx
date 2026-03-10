import React from "react";

function Navbar({ activeTab, setActiveTab }) {
  return (
    <nav className="navbar">
      <button
        className={`nav-btn ${activeTab === "text" ? "active" : ""}`}
        onClick={() => setActiveTab("text")}
      >
        Text Analysis
      </button>
      <button
        className={`nav-btn ${activeTab === "qr" ? "active" : ""}`}
        onClick={() => setActiveTab("qr")}
      >
        QR Scan
      </button>
    </nav>
  );
}

export default Navbar;