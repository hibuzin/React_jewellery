import { FaWhatsapp } from "react-icons/fa";

export default function AppBar() {
  return (
    <header style={styles.appbar}>
      <div style={styles.container}>
        <h1 style={styles.logo}>Royal Jewellery</h1>

        {/* WhatsApp Icon */}
        <a
          href="https://wa.me/8526854562"  // 🔥 replace with your number
          target="_blank"
          rel="noopener noreferrer"
          style={styles.whatsapp}
        >
          <FaWhatsapp size={26} />
        </a>
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
    padding: "0 20px",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "space-between",  // 🔥 important
    alignItems: "center",
    minHeight: "60px",
  },

  logo: {
    color: "black",
    fontSize: "clamp(18px, 4vw, 24px)",
    fontWeight: "bold",
  },

  whatsapp: {
    color: "#25D366",
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
  },
};