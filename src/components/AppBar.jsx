export default function AppBar() {
  return (
    <header style={styles.appbar}>
      <div style={styles.container}>
        <h1 style={styles.logo}> Royal Jewellery</h1>

        <nav>
          <a href="#" style={styles.link}>Home</a>
          <a href="#" style={styles.link}>Collections</a>
          <a href="#" style={styles.link}>About</a>
        </nav>
      </div>
    </header>
  );
}

const styles = {
  appbar: {
    top: 0,
    left: 0,
    width: "100%",
    backgroundColor: "#FFC107", // golden
    zIndex: 1000,
  },
  container: {
    width: "100%",
    padding: "0 40px",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "70px",
  },
  logo: {
    color: "black",       // ✅ changed from white to black
    fontSize: "24px",
    fontWeight: "bold",
  },
  link: {
    color: "black",       // ✅ changed from white to black
    textDecoration: "none",
    marginLeft: "25px",
    fontSize: "16px",
  },
};