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
      console.log("CART DATA =", data); // 🔥 debug

      if (res.ok) {
        const items = data.items || [];

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

    {/* LEFT empty space for balance */}
    <div style={{ width: 90 }} />

    {/* CENTER Title */}
    <div style={styles.headerInner}>
      <p style={styles.headerSub}>CURATED FOR YOU</p>
      <h1 style={styles.headerTitle}>My CART</h1>
    </div>

    {/* RIGHT Item Count */}
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
                    <h3 style={{ fontWeight: 400 }}>{product.title}</h3>

                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                        marginTop: 8,
                      }}
                    >
                      {product.gram && (
                        <span style={styles.gram}>{product.gram} g</span>
                      )}

                      <span style={styles.qty}>Qty: {item.quantity}</span>
                    </div>

                    <div style={styles.price}>₹{product.price}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total Bar */}
          <div style={styles.totalBar}>
            <div>
              <div style={{ color: "#777" }}>Total Amount</div>
              <div style={styles.totalPrice}>₹{totalAmount}</div>
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
      
    </div>
    </>
  );
}

const styles = {
  header: {
    background: "#fff",
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

  headerLine: {
    width: 48,
    height: 1,
    background: "#D4AF37",
    margin: "8px auto",
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
  borderRadius: 12,
  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
},

 image: {
  width: "100%",
  height: 160,
  borderRadius: 10,
  objectFit: "cover",
  marginBottom: 10,
},

  gram: {
   background: "rgba(212,175,55,0.1)",
    padding: "4px 10px",
    borderRadius: 6,
    color: "#D4AF37",
    fontSize: 12,
  },

  qty: {
    background: "rgba(212,175,55,0.1)",
    padding: "4px 10px",
    borderRadius: 6,
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
    borderRadius: 10,
    fontSize: 16,
    cursor: "pointer",
  },

  empty: {
    padding: 60,
    textAlign: "center",
  },
};