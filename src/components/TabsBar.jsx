import { useState } from "react";

export default function TabsBar() {
  const tabs = [
    "HOME",
    "GOLD",
    "GEMSTONE",
    "WEDDING",
    "DIAMOND",
    "PLATINUM",
    "ROSE GOLD",
    "RING",
  ];

  const [active, setActive] = useState("HOME");

  return (
    <div style={styles.wrapper}>
      <div style={styles.scrollContainer}>
        <div style={styles.tabs}>
          {tabs.map((tab) => (
            <div
              key={tab}
              onClick={() => setActive(tab)}
              style={{
                ...styles.tab,
                color: active === tab ? "#d4af37" : "black",
              }}
            >
              {tab}
              {active === tab && <div style={styles.indicator}></div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    position: "sticky",
    top: "0",
    zIndex: 999,
    backgroundColor: "#fff",
    width: "100%",           // full width
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)", // optional - separation காட்ட
  },

  scrollContainer: {
    overflowX: "auto",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    WebkitOverflowScrolling: "touch", // smooth scrolling mobile-ல
  },

  tabs: {
    display: "flex",
    justifyContent: window.innerWidth > 768 ? "center" : "flex-start",
    gap: "25px",
    padding: "12px 20px",
    minWidth: "max-content",
  },

  tab: {
    position: "relative",
    cursor: "pointer",
    fontWeight: "600",
    flexShrink: 0,
    fontSize: "14px",
    paddingBottom: "8px",
    transition: "color 0.3s",
    whiteSpace: "nowrap", // text break ஆகாம இருக்கும்
  },
};