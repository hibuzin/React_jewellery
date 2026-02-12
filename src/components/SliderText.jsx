// components/SliderText.jsx
import { useState, useEffect } from "react";

export default function SliderText() {
  const [fontSize, setFontSize] = useState("2rem"); // default for desktop

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 480) {
        setFontSize("1.2rem"); // small screen
      } else if (window.innerWidth <= 768) {
        setFontSize("1.5rem"); // tablet
      } else {
        setFontSize("2rem"); // desktop
      }
    };

    handleResize(); // set initial size
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "20px", padding: "0 10px" }}>
      <h2 style={{ color: "black", fontSize, lineHeight: 1.3 }}>
        Discover our premium collections
      </h2>
    </div>
  );
}