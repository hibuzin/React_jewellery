export default function AppBar() {
  return (
    <header style={styles.appbar}>
      <div style={styles.container}>
        <h1 style={styles.logo}>
          WEDDING SALE - 20% FLAT SALE ON GOLD RING
        </h1>
      </div>
    </header>
  );
}

const styles = {
  appbar: {
    width: "100%",
    backgroundColor: "#FFC107",
  },

  container: {
    width: "100%",
    height: "30px",   // 🔥 reduced height
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    color: "black",
    fontSize: "clamp(10px, 2vw, 10px)",  // 🔥 smaller font
    fontWeight: "50",
    margin: 0,
    textAlign: "center",
  },
};