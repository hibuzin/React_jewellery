// Footer.jsx  — create this new file

import { useEffect, useRef } from "react";

const links = {
  Collections: ["Necklaces", "Earrings", "Bangles", "Rings", "Bracelets"],
  Support: [ "Returns",  "FAQ"],
  Company: ["About Us", "Careers", "Press", "Contact"],
};

export default function Footer() {
  const lineRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          lineRef.current.style.width = "100%";
        }
      },
      { threshold: 0.3 }
    );
    if (lineRef.current) observer.observe(lineRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <footer style={styles.footer}>
      {/* TOP GOLD LINE ANIMATION */}
      <div style={styles.lineTrack}>
        <div ref={lineRef} style={styles.animatedLine} />
      </div>

      {/* BRAND */}
      <div style={styles.brand}>
        <h1 style={styles.logo}>LUXE</h1>
        <p style={styles.tagline}>Crafted for the timeless soul</p>
      </div>

      {/* LINKS GRID */}
      <div style={styles.linksGrid}>
        {Object.entries(links).map(([category, items]) => (
          <div key={category}>
            <h4 style={styles.category}>{category}</h4>
            <ul style={styles.ul}>
              {items.map((item) => (
                <li key={item} style={styles.li}>
                  <a href="#" style={styles.link}>{item}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* NEWSLETTER */}
        <div>
          <h4 style={styles.category}>Newsletter</h4>
          <p style={styles.newsletterText}>
            Get exclusive offers & new arrivals.
          </p>
          <div style={styles.inputRow}>
            <input
              type="email"
              placeholder="your@email.com"
              style={styles.input}
            />
            <button style={styles.btn}>→</button>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div style={styles.bottom}>
        <p style={styles.copy}>© 2025 LUXE. All rights reserved.</p>
        <div style={styles.socials}>
          {["Instagram", "Pinterest", "WhatsApp"].map((s) => (
            <a key={s} href="#" style={styles.social}>{s}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    background: "#0e0c0a",
    color: "#e8dcc8",
    padding: "60px 40px 30px",
    fontFamily: "'Georgia', serif",
  },
  lineTrack: {
    width: "100%",
    height: "1px",
    background: "#2a2420",
    marginBottom: "50px",
  },
  animatedLine: {
    height: "1px",
    width: "0%",
    background: "linear-gradient(90deg, #c9a84c, #f0d080, #c9a84c)",
    transition: "width 1.2s ease",
  },
  brand: {
    textAlign: "center",
    marginBottom: "50px",
  },
  logo: {
    fontSize: "clamp(36px, 6vw, 64px)",
    letterSpacing: "0.3em",
    color: "#c9a84c",
    margin: 0,
    fontWeight: 400,
  },
  tagline: {
    fontSize: "13px",
    letterSpacing: "0.2em",
    color: "#7a6a55",
    marginTop: "8px",
    textTransform: "uppercase",
  },
  linksGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "40px",
    marginBottom: "50px",
  },
  category: {
    fontSize: "11px",
    letterSpacing: "0.25em",
    textTransform: "uppercase",
    color: "#c9a84c",
    marginBottom: "16px",
    fontWeight: 400,
  },
  ul: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  li: {
    marginBottom: "10px",
  },
  link: {
    color: "#a09080",
    textDecoration: "none",
    fontSize: "13px",
    letterSpacing: "0.05em",
    transition: "color 0.3s ease",
  },
  newsletterText: {
    fontSize: "12px",
    color: "#7a6a55",
    marginBottom: "14px",
    lineHeight: 1.6,
  },
  inputRow: {
    display: "flex",
    gap: "0",
  },
  input: {
    flex: 1,
    padding: "10px 12px",
    background: "#1a1612",
    border: "1px solid #3a3028",
    borderRight: "none",
    color: "#e8dcc8",
    fontSize: "12px",
    outline: "none",
    fontFamily: "Georgia, serif",
  },
  btn: {
    padding: "10px 16px",
    background: "#c9a84c",
    border: "none",
    color: "#0e0c0a",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },
  bottom: {
    borderTop: "1px solid #2a2420",
    paddingTop: "24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
  },
  copy: {
    fontSize: "11px",
    color: "#4a3f33",
    letterSpacing: "0.1em",
  },
  socials: {
    display: "flex",
    gap: "24px",
  },
  social: {
    fontSize: "11px",
    color: "#7a6a55",
    textDecoration: "none",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
  },
};