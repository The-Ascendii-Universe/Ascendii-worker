// src/Components/Model.jsx
import { useState, useEffect, useRef } from 'react';

const NAV_ITEMS = ["Home", "Explore", "Web-3", "My Rituals", "Profile"];

export default function Model() {
  const [activeNav, setActiveNav] = useState("Profile");
  const [wheelAngle, setWheelAngle] = useState(0);

  useEffect(() => {
    let start = null;
    const animate = (ts) => {
      if (!start) start = ts;
      setWheelAngle(((ts - start) / 14) % 360);
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, []);

  return (
    <div style={{
      width: "100vw", height: "100vh",
      background: "#060b18",
      color: "#c8f0ff",
      fontFamily: "sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden"
    }}>
      <h1 style={{ color: "#3af0ff", textShadow: "0 0 20px #3af0ff" }}>
        Ascendii Dashboard (Live from Model.jsx)
      </h1>

      {/* Rotating Wheel Test */}
      <svg width="280" height="280" viewBox="-140 -140 280 280">
        <circle r="110" fill="none" stroke="#a8e6ff" strokeWidth="3.5" />
        <g transform={`rotate(${wheelAngle})`}>
          <circle r="36" fill="none" stroke="#a8e6ff" strokeWidth="2.5" />
        </g>
      </svg>

      <p style={{ marginTop: "40px", fontSize: "20px" }}>
        Rituals loading... Waitlist & Hall of Monuments coming soon
      </p>

      <button style={{
        marginTop: "30px",
        padding: "12px 32px",
        background: "linear-gradient(135deg, #3af0ff, #7b4dff)",
        border: "none",
        borderRadius: "8px",
        color: "#060b18",
        fontWeight: "bold"
      }}>
        Join Waitlist
      </button>
    </div>
  );
}
