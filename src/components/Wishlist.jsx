import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import AppBar from "./AppBar";
import MainHeader from "./MainHeader";

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
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
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
        setWishlistItems(data?.wishlist || []);
      }
    } catch (e) {
      console.error("ERROR:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const res = await fetch(`${BASE_URL}/api/wishlist/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setWishlistItems(data?.wishlist || []);
      }
    } catch (err) {
      console.error("Remove error:", err);
    }
  };

  return (
    <div style={styles.page}>
      <AppBar />
      <MainHeader />

      {/* Loading State */}
      {isLoading ? (
        <div style={styles.centered}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>Loading your wishlist...</p>
        </div>
      ) : (
        <>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.headerInner}>
              <p style={styles.headerSub}>CURATED FOR YOU</p>
              <h1 style={styles.headerTitle}>MY WISHLIST</h1>
              <div style={styles.headerLine} />
              <p style={styles.headerCount}>{wishlistItems.length} pieces saved</p>
            </div>
          </div>

          {/* Empty State */}
          {wishlistItems.length === 0 ? (
            <div style={styles.emptyWrapper}>
              <p style={styles.emptyText}>Your wishlist is empty</p>
              <p style={styles.emptySubText}>Save items you love to your wishlist</p>
            </div>
          ) : (
            /* Grid */
            <div style={styles.gridWrapper}>
              <div
                style={{
                  ...styles.grid,
                  gridTemplateColumns: isMobile
                    ? "repeat(2, 1fr)"
                    : "repeat(4, 1fr)",
                }}
              >
                {wishlistItems.map((product, i) => (
                  <WishlistCard
                    key={i}
                    product={product}
                    onRemove={(id) => {
                      setDeleteId(id);
                      setShowConfirm(true);
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Confirm Modal */}
      {showConfirm && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.box}>
            <h3 style={{ marginBottom: 10, color: "#777" }}>
              Remove from Wishlist
            </h3>
            <p style={{ color: "#777", marginBottom: 20 }}>
              Are you sure you want to remove this item?
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button
                style={modalStyles.cancel}
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                style={modalStyles.delete}
                onClick={() => {
                  removeFromWishlist(deleteId);
                  setShowConfirm(false);
                }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function WishlistCard({ product, onRemove }) {
  const [hovered, setHovered] = useState(false);

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
            e.target.src =
              "https://via.placeholder.com/200x200?text=No+Image";
          }}
        />
        <div style={{ ...styles.imageOverlay, opacity: hovered ? 1 : 0 }} />
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

      {/* Remove Button */}
      <div style={styles.removeBtn} onClick={() => onRemove(product._id)}>
        ✕
      </div>

      {/* Details */}
      <div style={styles.details}>
        <h3 style={styles.title}>{title}</h3>
        <div style={styles.meta}>
          {gram && <span style={styles.gram}>{gram} g</span>}
        </div>
        <div style={styles.priceRow}>
          <span style={styles.price}>₹{price.toLocaleString()}</span>
          {originalPrice && originalPrice !== price && (
            <span style={styles.originalPrice}>
              ₹{originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Golden Accent */}
      <div style={{ ...styles.cardAccent, width: hovered ? "100%" : "0%" }} />
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
    height: "60vh",
    background: "#ffffff",
  },
  // ✅ Empty state - page layout-க்குள்ள, AppBar கீழே
  emptyWrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "80px 20px",
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
    marginTop: 0,
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
  removeBtn: {
    position: "absolute",
    top: 12,
    left: 12,
    width: 28,
    height: 28,
    borderRadius: "50%",
    background: "rgba(0,0,0,0.6)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    cursor: "pointer",
    transition: "0.2s",
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
    borderRadius: 1,
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

const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  box: {
    background: "#fff",
    padding: 30,
    borderRadius: 1,
    width: 300,
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
  },
  cancel: {
    padding: "10px 18px",
    border: "1px solid #ccc",
    background: "#d33e3e",
    color: "#fff",
    cursor: "pointer",
    borderRadius: 1,
  },
  delete: {
    padding: "10px 18px",
    border: "none",
    background: "#0e0d0d",
    color: "#fff",
    cursor: "pointer",
    borderRadius: 1,
  },
};