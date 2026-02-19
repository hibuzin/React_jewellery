import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import asset1 from "../assets/image.png";
import asset2 from "../assets/image1.png";
import asset3 from "../assets/image2.png";
import asset4 from "../assets/image3.png";

export default function Product() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState(null);
 const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  /* ================= FETCH PRODUCTS ================= */

  useEffect(() => {
    fetch("https://jewellery-backend-icja.onrender.com/api/products/")
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  /* ================= RESPONSIVE ================= */

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ================= ANIMATION ================= */

  const assetRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.transform = "translateX(0)";
            entry.target.style.opacity = "1";
          }
        });
      },
      { threshold: 0.15 }
    );

    assetRefs.forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => {
      assetRefs.forEach((ref) => {
        if (ref.current) observer.unobserve(ref.current);
      });
    };
  }, []);

  /* ================= UI ================= */

  return (
    <div style={styles.container}>
      {/* PRODUCTS GRID */}

      <div
        style={{
          ...styles.grid,
          gridTemplateColumns: isMobile
            ? "repeat(2, 1fr)"
            : "repeat(4, 1fr)",
        }}
      >
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={styles.skeletonCard} />
            ))
          : items.map((item) => {
              const isHovered = hovered === item._id;

              return (
                <div
                  key={item._id}
                  style={styles.card}
                  onClick={() => navigate(`/product/${item._id}`)}
                  onMouseEnter={() => setHovered(item._id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div
                    style={{
                      ...styles.imageWrapper,
                      height: isMobile ? "200px" : "280px",
                    }}
                  >
                   <img
  src={
    item.mainImage?.url || item.image?.url || item.images?.[0]?.url 
  }
  alt={item.title}
  style={{
    ...styles.image,
    transform: isHovered ? "scale(1.08)" : "scale(1)",
  }}
/>
                  </div>

                  <div style={styles.overlay}>
                    <h4 style={styles.title}>{item.title}</h4>
                    <p style={styles.price}>₹{item.price}</p>
                  </div>
                </div>
              );
            })}
      </div>

      {/* EXTRA SECTION */}

      <div style={styles.extraSection}>
        <h2 style={styles.heading}>
          Discover our premium collections
        </h2>

        <div style={styles.assetGrid}>
          {[asset1, asset2, asset3, asset4].map((img, index) => (
            <img
              key={index}
              ref={assetRefs[index]}
              src={img}
              alt="collection"
              style={{
                ...styles.assetImage,
                transform:
                  index < 2
                    ? "translateX(-60px)"
                    : "translateX(60px)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  container: {
    padding: "20px",
  },

  grid: {
    display: "grid",
    gap: "40px",
  },

  card: {
    position: "relative",
    borderRadius: "1px",
    overflow: "hidden",
    cursor: "pointer",
    background: "#fdfcfb",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },

  imageWrapper: {
    width: "100%",
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.4s ease",
  },

  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    padding: "12px",
    color: "#fff",
    background:
      "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0))",
  },

  title: {
    margin: 0,
    fontSize: "14px",
  },

  price: {
    margin: "5px 0 0 0",
    fontWeight: "bold",
  },

  skeletonCard: {
    height: "280px",
    borderRadius: "1px",
    background:
      "linear-gradient(90deg,#eee 25%,#f5f5f5 37%,#eee 63%)",
    backgroundSize: "400% 100%",
    animation: "shine 1.2s ease infinite",
  },

  extraSection: {
    marginTop: "50px",
    textAlign: "center",
  },

  heading: {
    fontSize: "22px",
    marginBottom: "20px",
  },

  assetGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px",
  },

  assetImage: {
    width: "100%",
    borderRadius: "1px",
    opacity: 0,
    transition: "all 0.8s ease",
  },
};