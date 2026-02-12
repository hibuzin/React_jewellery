export default function AppBar() {
  return (
    <header style={styles.appbar}>
      <div style={styles.container}>
        <h1 style={styles.logo}>Royal Jewellery</h1>

      </div>
    </header>
  );
}

const styles = {
  appbar: {
    top: 0,
    left: 0,
    width: "100%",
    backgroundColor: "#FFC107",
  },

  container: {
    width: "100%",
    padding: "0 20px", // ✅ reduced padding (mobile friendly)
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "center", // ✅ now safe
    alignItems: "center",
    flexWrap: "wrap", // ⭐ IMPORTANT for mobile
    minHeight: "60px",
  },

  logo: {
    color: "black",
    fontSize: "clamp(18px, 4vw, 24px)", // ✅ responsive font
    fontWeight: "bold",
  },

  nav: {
    display: "flex",
    gap: "15px",
    flexWrap: "wrap", // ✅ prevents overflow
  },

  link: {
    color: "black",
    textDecoration: "none",
    fontSize: "clamp(14px, 3vw, 16px)", // responsive
  },
};