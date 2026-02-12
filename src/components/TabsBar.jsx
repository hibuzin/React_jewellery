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

  return (
    <div style={styles.scrollContainer}>
      <div style={styles.tabs}>
        {tabs.map((tab) => (
          <a key={tab} href="#" style={styles.tab}>
            {tab}
          </a>
        ))}
      </div>
    </div>
  );
}

const styles = {
  scrollContainer: {
    overflowX: "auto",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  },

  tabs: {
    display: "flex",
    justifyContent: "center", // ✅ now safe
    gap: "20px",
    padding: "10px 15px",
    minWidth: "max-content", // ⭐ IMPORTANT
  },

  tab: {
    color: "black",
    textDecoration: "none",
    fontWeight: "600",
    flexShrink: 0,
    fontSize: "14px",
  },
};