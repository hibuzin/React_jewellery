import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";

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
    <div style={{ background: "#FAF9F6", minHeight: "100vh" }}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={{ fontWeight: 300, letterSpacing: 1.5 ,color: "#333"}}>
          Shopping Cart
        </h2>

        <div style={styles.itemBadge}>{itemCount} Items</div>
      </div>

      {/* Empty */}
      {cartItems.length === 0 ? (
        <div style={styles.empty}>
          <h3>Your cart is empty</h3>
        </div>
      ) : (
        <>
          {/* Items */}
          <div style={styles.list}>
            {cartItems.map((item, i) => {
              const product = item.product;
              if (!product) return null;

              return (
                <div key={i} style={styles.card}>
                  <img
                    src={
                      product.image?.url ||
                      product.image ||
                      "https://via.placeholder.com/120"
                    }
                    alt=""
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
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  header: {
    background: "#fff",
    padding: "20px 30px",
    display: "flex",
    justifyContent: "space-between",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },

  itemBadge: {
    background: "rgba(212,175,55,0.1)",
    color: "#D4AF37",
    padding: "8px 16px",
    borderRadius: 20,
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
    display: "flex",
    gap: 20,
    background: "#fff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
  },

  image: {
    width: 120,
    height: 120,
    borderRadius: 12,
    objectFit: "cover",
    border: "1px solid rgba(212,175,55,0.3)",
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