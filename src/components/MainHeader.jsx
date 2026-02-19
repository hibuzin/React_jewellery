import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  IoLocationOutline,
  IoPersonOutline,
  IoHeartOutline,
  IoCartOutline,
  IoHelpCircleOutline,
} from "react-icons/io5";

export default function MainHeader() {
  const navigate = useNavigate();
  const [currency, setCurrency] = useState("INR");

  return (
    <>
      {/* ✅ STYLE MOVED HERE */}
      <style>{`
        .main-header {
          margin-top: 10px;
          padding: 0 16px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
        }
          
        .header-left {
          position: absolute;
          left: 16px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .header-title {
          color: #141413;
          font-size: clamp(13px, 4vw, 20px);
          font-weight: 600;
          margin: 0;
          text-align: center;
          letter-spacing: 2px;
          white-space: nowrap;
        }

        .header-icons {
          position: absolute;
          right: 16px;
          display: flex;
          gap: 10px;
          font-size: clamp(18px, 4vw, 22px);
          color: #333;
          align-items: center;
          cursor: pointer;
        }

        .header-icons svg {
          cursor: pointer;
          transition: color 0.2s;
        }

        .header-icons svg:hover {
          color: #D4AF37;
        }

        .currency-select {
          padding: 4px 6px;
          background: #fff;
          color: #373731;
          font-weight: 300;
          cursor: pointer;
          outline: none;
          font-size: clamp(10px, 2.5vw, 12px);
          border: none;
        }

        .help-wrapper {
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
        }

        .help-text {
          font-size: clamp(10px, 2.5vw, 12px);
          color: #333;
          font-weight: 500;
          white-space: nowrap;
        }

        @media (max-width: 480px) {
          .help-text {
            display: none;
          }

          .header-left {
            gap: 6px;
          }

          .header-icons {
            gap: 8px;
          }
        }

        @media (max-width: 360px) {
          .currency-select {
            display: none;
          }
        }
      `}</style>

      <div className="main-header">
        {/* LEFT */}
        <div className="header-left">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="currency-select"
          >
            <option value="INR">₹ INR</option>
            <option value="USD">$ USD</option>
            <option value="EUR">€ EUR</option>
          </select>

          <div className="help-wrapper" onClick={() => navigate("/help")}>
            <IoHelpCircleOutline
              style={{ fontSize: "clamp(16px, 3vw, 20px)", color: "#333" }}
            />
            <span className="help-text">NEED HELP</span>
          </div>
        </div>

        {/* CENTER */}
        <h2 className="header-title">LUXURY GOLDS</h2>

        {/* RIGHT */}
        <div className="header-icons">
          <IoLocationOutline />
          <IoPersonOutline onClick={() => navigate("/login")} />
          <IoHeartOutline onClick={() => navigate("/wishlist")} />
          <IoCartOutline onClick={() => navigate("/cart")} />
        </div>
      </div>
    </>
  );
}