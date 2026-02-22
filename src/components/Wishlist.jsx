import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";

const SECRET_KEY = "royal_jewellery_secret";
const BASE_URL = "https://jewellery-backend-icja.onrender.com";

const getToken = () => {
  try {
    const encryptedData = localStorage.getItem("auth");
    if (!encryptedData) return null;
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return data.token;
  } catch {
    return null;
  }
};

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const token = getToken();

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchWishlist();
    }
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/wishlist`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        console.log("WISHLIST DATA:", data);
        setWishlistItems(data?.wishlist || []);
      }
    } catch (e) {
      console.error("ERROR:", e);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div style={styles.centered}>
        <div style={styles.spinner} />
        <p style={styles.loadingText}>Loading your wishlist...</p>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div style={styles.centered}>
        <div style={styles.emptyIcon}>♡</div>
        <p style={styles.emptyText}>Your wishlist is empty</p>
        <p style={styles.emptySubText}>Save items you love to your wishlist</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerInner}>
          <p style={styles.headerSub}>CURATED FOR YOU</p>
          <h1 style={styles.headerTitle}>My Wishlist</h1>
          <div style={styles.headerLine} />
          <p style={styles.headerCount}>{wishlistItems.length} pieces saved</p>
        </div>
      </div>

      {/* Grid */}
      <div style={styles.gridWrapper}>
        <div
          style={{
            ...styles.grid,
            gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
          }}
        >
          {wishlistItems.map((product, i) => (
            <WishlistCard key={i} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

function WishlistCard({ product }) {
  const [hovered, setHovered] = useState(false);

  // ✅ Fixed: using mainImage.url from actual API response
  const imageUrl = product?.mainImage?.url || "";

  const title = product?.title || "Untitled";
  const gram = product?.gram || "";
  const price = product?.price || "";
  const originalPrice = product?.originalPrice || "";
  const isAvailable = product?.isAvailable ?? true;

  return (
    <div
      style={{
        ...styles.card,
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 20px 60px rgba(212,175,55,0.18)"
          : "0 4px 24px rgba(0,0,0,0.07)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div style={styles.imageWrapper}>
        <img
          src={imageUrl}
          alt={title}
          style={{
            ...styles.image,
            transform: hovered ? "scale(1.05)" : "scale(1)",
          }}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/200x200?text=No+Image";
          }}
        />

        {/* Overlay on hover */}
        <div style={{ ...styles.imageOverlay, opacity: hovered ? 1 : 0 }} />

        {/* Availability badge */}
        <div
          style={{
            ...styles.badge,
            background: isAvailable
              ? "rgba(46,125,50,0.9)"
              : "rgba(198,40,40,0.9)",
          }}
        >
          {isAvailable ? "Available" : "Out of Stock"}
        </div>
      </div>

      {/* Details */}
      <div style={styles.details}>
        <h3 style={styles.title}>{title}</h3>

        <div style={styles.meta}>
          {gram && <span style={styles.gram}>{gram} g</span>}
        </div>

        {/* Price with original price strikethrough */}
        <div style={styles.priceRow}>
          <span style={styles.price}>₹{price.toLocaleString()}</span>
          {originalPrice && originalPrice !== price && (
            <span style={styles.originalPrice}>
              ₹{originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* Bottom golden line accent */}
      <div
        style={{
          ...styles.cardAccent,
          width: hovered ? "100%" : "0%",
        }}
      />
    </div>
  );
}

const styles = {
  page: {
    background: "#ffffff",
    minHeight: "100vh",
  },

  centered: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#ffffff",
  },

  spinner: {
    width: 36,
    height: 36,
    border: "2px solid #eee",
    borderTop: "2px solid #D4AF37",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },

  loadingText: {
    marginTop: 16,
    color: "#999",
    fontSize: 14,
    letterSpacing: 1,
  },

  emptyIcon: {
    fontSize: 64,
    color: "#D4AF37",
    marginBottom: 16,
    opacity: 0.5,
  },

  emptyText: {
    fontSize: 22,
    color: "#444",
    fontWeight: 300,
    letterSpacing: 1,
  },

  emptySubText: {
    fontSize: 14,
    color: "#aaa",
    marginTop: 8,
  },

  header: {
    background: "#fff",
    borderBottom: "1px solid rgba(212,175,55,0.15)",
    padding: "5px 14px 5px",
    textAlign: "center",
  },

  headerInner: {
    maxWidth: 500,
    margin: "auto",
  },

  headerSub: {
    fontSize: 11,
    letterSpacing: 4,
    color: "#D4AF37",
    marginBottom: 8,
    fontWeight: 500,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: 300,
    color: "#222",
    letterSpacing: 2,
    margin: 0,
  },

  headerLine: {
    width: 48,
    height: 1,
    background: "#D4AF37",
    margin: "8px auto",
  },

  headerCount: {
    fontSize: 13,
    color: "#aaa",
    letterSpacing: 1,
  },

  gridWrapper: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "40px 20px",
  },

  grid: {
    display: "grid",
    gap: 28,
  },

  card: {
    background: "#fff",
    borderRadius: 1,
    overflow: "hidden",
    cursor: "pointer",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    position: "relative",
  },

  imageWrapper: {
    position: "relative",
    overflow: "hidden",
    height: 200,
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.5s ease",
    display: "block",
  },

  imageOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(212,175,55,0.08)",
    transition: "opacity 0.3s ease",
  },

  badge: {
    position: "absolute",
    top: 12,
    right: 12,
    color: "#fff",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: 0.5,
    padding: "4px 10px",
    borderRadius: 1,
  },

  details: {
    padding: "18px 20px 20px",
  },

  title: {
    fontSize: 15,
    fontWeight: 500,
    color: "#222",
    margin: "0 0 10px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    letterSpacing: 0.3,
  },

  meta: {
    display: "flex",
    gap: 8,
    marginBottom: 10,
  },

  gram: {
    background: "rgba(212,175,55,0.1)",
    color: "#D4AF37",
    fontSize: 11,
    padding: "3px 10px",
    borderRadius: 20,
    fontWeight: 600,
    letterSpacing: 0.5,
  },

  priceRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },

  price: {
    fontSize: 20,
    color: "#D4AF37",
    fontWeight: 500,
    letterSpacing: 0.5,
  },

  originalPrice: {
    fontSize: 13,
    color: "#bbb",
    textDecoration: "line-through",
    letterSpacing: 0.3,
  },

  cardAccent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 2,
    background: "linear-gradient(90deg, #D4AF37, #f0d060)",
    transition: "width 0.4s ease",
  },
};