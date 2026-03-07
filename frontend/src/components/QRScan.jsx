import React from "react";

function QRScan({
  qrModalOpen,
  setQrModalOpen,
  qrFile,
  setQrFile,
  loading,
  analyzeQr,
}) {
  return (
    <div className="input-section" style={{ marginBottom: 24 }}>
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
        onClick={() => setQrModalOpen(true)}
      >
        Upload QR Image
      </button>
      {qrModalOpen && (
        <div
          className="modal-bg"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
          }}
        >
          <div
            className="modal"
            style={{
              background: "#fff",
              borderRadius: 24,
              boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
              padding: 32,
              minWidth: 320,
              maxWidth: 400,
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            <h3
              style={{
                fontWeight: 700,
                fontSize: 18,
                color: "#1d1d1f",
                marginBottom: 12,
              }}
            >
              Scan QR Code
            </h3>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setQrFile(e.target.files[0])}
              style={{ marginBottom: 16 }}
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
              disabled={!qrFile || loading}
              onClick={() => qrFile && analyzeQr(qrFile)}
            >
              Scan & Analyze
            </button>
            <button
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
                setQrModalOpen(false);
                setQrFile(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default QRScan;
