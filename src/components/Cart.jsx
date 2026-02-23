import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import AppBar from "./AppBar";
import MainHeader from "./MainHeader";

const SECRET_KEY = "royal_jewellery_secret";

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

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);


  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

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
      fetchCart();
    }
  }, []);

  const fetchCart = async () => {
    try {
      const res = await fetch(
        "https://jewellery-backend-icja.onrender.com/api/cart/",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      console.log("CART DATA =", data);

      if (res.ok) {
        const items = data.cart || data.items || [];
        setCartItems(items);

        const total =
          data.totalAmount ||
          items.reduce(
            (sum, item) =>
              sum + (item.product?.price || 0) * (item.quantity || 0),
            0
          );

        setTotalAmount(total);
      }
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const removeFromCart = async (id) => {
    try {
      const res = await fetch(
        `https://jewellery-backend-icja.onrender.com/api/cart/remove/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      console.log("REMOVE RESPONSE =", data);

      if (res.ok) {
        await fetchCart();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const itemCount = cartItems.reduce(
    (acc, item) => acc + (item.quantity || 0),
    0
  );

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;

  return (
    <>
      <AppBar />
      <MainHeader />

      <div style={{ background: "#FAF9F6", minHeight: "100vh" }}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerRow}>
            <div style={{ width: 90 }} />

            <div style={styles.headerInner}>
              <p style={styles.headerSub}>CURATED FOR YOU</p>
              <h1 style={styles.headerTitle}>MY CART</h1>
            </div>

            <div style={styles.itemBadge}>{itemCount} Items</div>
          </div>
        </div>

        {/* Empty */}
        {cartItems.length === 0 ? (
          <div style={{ color: "#333", textAlign: "center", padding: 60 }}>
            <h3>Your cart is empty</h3>
          </div>
        ) : (
          <>
            {/* Items */}
            <div
              style={{
                ...styles.list,
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "repeat(2, 1fr)"
                  : "repeat(4, 1fr)",
                gap: 20,
              }}
            >
              {cartItems.map((item, i) => {
                const product = item.product;
                if (!product) return null;

                return (
                  <div key={i} style={styles.card}>
                    <img
                      src={
                        product.mainImage?.url ||
                        product.image?.url ||
                        product.images?.[0]?.url ||
                        product.image ||
                        "https://via.placeholder.com/120"
                      }
                      alt={product.title}
                      style={styles.image}
                    />

                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontWeight: 400,color: "#666", }}>
                        {product.title}
                      </h3>

                      <div
                        style={{
                          display: "flex",
                          gap: 10,
                          marginTop: 8,
                        }}
                      >
                        {product.gram && (
                          <span style={styles.gram}>
                            {product.gram} g
                          </span>
                        )}

                        <span style={styles.qty}>
                          Qty: {item.quantity}
                        </span>
                      </div>

                      <div style={styles.price}>
                        ₹{product.price}
                      </div>

                      <button
                        style={{
                          marginTop: 12,
                          background: "transparent",
                          border: "1px solid #D4AF37",
                          color: "#D4AF37",
                          outline: "none",
                          padding: "8px 16px",
                          cursor: "pointer",
                          borderRadius: 1,
                          fontSize: 13,
                          fontWeight: 500,
                          letterSpacing: 0.5,
                          transition: "0.3s",
                        }}
                        onClick={() => {
                          setDeleteId(product._id);
                          setShowConfirm(true);
                        }}
                        onMouseOver={(e) => {
                          e.target.style.background = "#D4AF37";
                          e.target.style.color = "#fff";
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background =
                            "transparent";
                          e.target.style.color = "#D4AF37";
                        }}
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total Bar */}
            <div style={styles.totalBar}>
              <div>
                <div style={{ color: "#777" }}>
                  Total Amount
                </div>
                <div style={styles.totalPrice}>
                  ₹{totalAmount}
                </div>
              </div>

              <button
                style={styles.checkout}
                onClick={() => navigate("/address")}
              >
                CHECKOUT
              </button>
            </div>
          </>
        )}

        {/* ✅ Confirm Modal */}
        {showConfirm && (
          <div style={modalStyles.overlay}>
            <div style={modalStyles.box}>
              <h3 style={{ marginBottom: 10,color: "#666", }}>
                Remove Item
              </h3>

              <p
                style={{
                  color: "#666",
                  marginBottom: 20,
                }}
              >
                Are you sure you want to remove this item?
              </p>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  justifyContent: "center",
                }}
              >
                <button
                  style={modalStyles.cancel}
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </button>

                <button
                  style={modalStyles.delete}
                  onClick={() => {
                    removeFromCart(deleteId);
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
    </>
  );
}

const styles = {
  header: {
    background:"#FAF9F6",
    borderBottom: "1px solid rgba(212,175,55,0.15)",
    padding: "5px 14px 5px",
    textAlign: "center",
  },

  headerInner: {
    maxWidth: 500,
    margin: "auto",
    textAlign: "center",
  },

  headerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    maxWidth: 900,
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

  itemBadge: {
    background: "rgba(212,175,55,0.1)",
    color: "#D4AF37",
    padding: "8px 16px",
    borderRadius: 1,
    fontWeight: 500,
    alignSelf: "center",
    textAlign: "center",
  },

  list: {
    maxWidth: 1200,
    margin: "auto",
    padding: 20,
  },

  card: {
    background: "#fff",
    padding: 16,
    borderRadius: 1,
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  image: {
    width: "100%",
    height: 160,
    borderRadius: 1,
    objectFit: "cover",
    marginBottom: 10,
  },

  gram: {
    background: "rgba(212,175,55,0.1)",
    padding: "4px 10px",
    borderRadius: 1,
    color: "#D4AF37",
    fontSize: 12,
  },

  qty: {
    background: "rgba(212,175,55,0.1)",
    padding: "4px 10px",
    borderRadius: 1,
    fontSize: 12,
    color: "#D4AF37",
    fontWeight: 600,
  },

  price: {
    marginTop: 10,
    fontSize: 22,
    color: "#D4AF37",
    fontWeight: 500,
  },

  totalBar: {
    background: "#fff",
    padding: "20px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
  },

  totalPrice: {
    fontSize: 28,
    color: "#D4AF37",
  },

  checkout: {
    background: "#D4AF37",
    color: "#fff",
    border: "none",
    padding: "14px 32px",
    borderRadius: 1,
    fontSize: 16,
    cursor: "pointer",
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
    border: "none",
    background: "#e24646",
    cursor: "pointer",
    borderRadius: 1,
  },
  delete: {
    padding: "10px 18px",
    border: "none",
    background: "#D4AF37",
    color: "#fff",
    cursor: "pointer",
    borderRadius: 1,
  },
};