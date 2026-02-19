import { NavLink } from "react-router-dom";

export default function TabsBar() {
  const tabs = [
    { name: "HOME", path: "/" },
    { name: "GOLD", path: "/gold" },
    { name: "GEMSTONE", path: "/gemstone" },
    { name: "WEDDING", path: "/wedding" },
    { name: "DIAMOND", path: "/diamond" },
    { name: "PLATINUM", path: "/platinum" },
    { name: "ROSE GOLD", path: "/rosegold" },
    { name: "RING", path: "/ring" },
  ];

  return (
    <div style={styles.wrapper}>
      <div style={styles.scrollContainer}>
        <div style={styles.tabs}>
          {tabs.map((tab) => (
            <NavLink
              key={tab.name}
              to={tab.path}
              style={({ isActive }) => ({
                ...styles.tab,
                color: isActive ? "#d4af37" : "black",
                textDecoration: "none",
              })}
            >
              {({ isActive }) => (
                <>
                  {tab.name}
                  {isActive && <div style={styles.indicator}></div>}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    position: "sticky",
    top: 0,
    zIndex: 999,
    backgroundColor: "#fff",
    width: "100%",
  },
  scrollContainer: {
    overflowX: "auto",
    scrollbarWidth: "none",
  },
  tabs: {
    display: "flex",
    justifyContent: "center",
    gap: "25px",
    padding: "12px 20px",
    minWidth: "max-content",
  },
  tab: {
    position: "relative",
    cursor: "pointer",
    fontWeight: "300",
    fontSize: "14px",
    paddingBottom: "3px",
    whiteSpace: "nowrap",
  },
 
};