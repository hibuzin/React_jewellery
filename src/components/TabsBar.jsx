export default function TabsBar() {
  return (
    <div style={styles.tabs}>
      {["HOME","GOLD","GEMSTONE","WEDDING","DIAMOND","PLATINUM","ROSE GOLD","RING"].map((tab) => (
        <a key={tab} href="#" style={styles.tab}>{tab}</a>
      ))}
    </div>
  );
}

const styles = {
  tabs: {
    display: "flex",
     justifyContent: "center", // ✅ center tabs if they fit
    overflowX: "auto",    
    gap: "40px",
    padding: "10px",
    overflowX: "auto",   // ✅ allows horizontal scrolling
    WebkitOverflowScrolling: "touch", // smooth scroll on iOS
  },
  tab: {
    color: "black",
    textDecoration: "none",
    fontWeight: "600",
    cursor: "pointer",
    flexShrink: 0,       // ✅ prevents tab from shrinking
  },
};