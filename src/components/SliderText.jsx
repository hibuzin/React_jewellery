import { useState, useEffect } from "react";

export default function SliderText() {
  const [fontSize, setFontSize] = useState("1.6rem");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 480) {
        setFontSize("1rem");
      } else if (window.innerWidth <= 768) {
        setFontSize("1.2rem");
      } else {
        setFontSize("1.6rem");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "20px", padding: "0 10px" }}>
      
      <h2
        style={{
          color: "black",
          fontSize: fontSize,
          lineHeight: 1.3,
          fontWeight: "500",
          letterSpacing: "1px",
          marginBottom: "6px",
        }}
      >
        DISCOVER OUR PREMIUM COLLECTION
      </h2>

      <p
        style={{
          color: "#555",
          fontSize: "14px",
          fontWeight: "400",
          margin: 0,
        }}
      >
        ELEGANCE CRAFTED FOR EVERY SPECIAL MOMENT
      </p>

    </div>
  );
}