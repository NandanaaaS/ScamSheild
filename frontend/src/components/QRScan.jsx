import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

function QRScan({ qrModalOpen, setQrModalOpen, qrFile, setQrFile, loading, analyzeQr }) {
  const fileInputRef = useRef(null);

  return (
    <div className="input-section">
      <button className="btn btn-primary" onClick={() => setQrModalOpen(true)}>
        Upload QR Image
      </button>

      <AnimatePresence>
        {qrModalOpen && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <motion.div
              className="modal"
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <p className="modal-title">Scan QR Code</p>

              <div
                className="file-input-area"
                onClick={() => fileInputRef.current?.click()}
              >
                <label className="file-input-label">
                  <span className="upload-icon">📷</span>
                  {qrFile
                    ? <span className="file-name">{qrFile.name}</span>
                    : <span>Click to choose a QR image</span>
                  }
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => setQrFile(e.target.files[0])}
                  />
                </label>
              </div>

              <button
                className="btn btn-primary"
                disabled={!qrFile || loading}
                onClick={() => qrFile && analyzeQr(qrFile)}
              >
                {loading ? "Scanning…" : "Scan & Analyze"}
              </button>

              <button
                className="btn btn-ghost"
                onClick={() => { setQrModalOpen(false); setQrFile(null); }}
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default QRScan;