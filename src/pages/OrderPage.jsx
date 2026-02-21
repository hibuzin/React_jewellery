import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CryptoJS from "crypto-js";
import { toast } from "react-toastify";

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

export default function OrderPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = getToken();

  const address = location.state?.address || null;

  // Cart items from location state (passed from CartPage via AddressPage)
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (!address) {
      navigate("/address");
      return;
    }
    fetchCart();
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
    setPageLoading(false);
  };

  const placeOrder = async () => {
    if (!address) return;
    setLoading(true);

    try {
      const res = await fetch(
        "https://jewellery-backend-icja.onrender.com/api/checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            address: {
              name: address.name,
              phone: address.phone,
              street: address.street,
              city: address.city,
              state: address.state,
              pincode: address.pincode,
            },
            paymentMethod: "cod",
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
  toast.success("Order placed successfully ");
  navigate("/");
} else {
  toast.error(data.message || "Failed to place order");
}
    }catch (e) {
  toast.error("Something went wrong");
}finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div style={styles.centered}>
        <div style={styles.spinner} />
      </div>
    );
  }

  const itemCount = cartItems.reduce((acc, i) => acc + (i.quantity || 0), 0);

  return (
    <div style={{ background: "#FAF9F6", minHeight: "100vh" }}>
      {/* AppBar */}
      <div style={styles.appBar}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>←</button>
        <h2 style={styles.appBarTitle}>Confirm Order</h2>
        <div />
      </div>

      {/* Breadcrumb */}
      <div style={styles.breadcrumb}>
        <span style={styles.breadcrumbInactive}>Cart</span>
        <span style={styles.chevron}>›</span>
        <span style={styles.breadcrumbInactive}>Address</span>
        <span style={styles.chevron}>›</span>
        <span style={styles.breadcrumbActive}>Confirm</span>
      </div>

      {/* Content */}
      <div style={styles.content}>
        <div style={styles.grid}>
          {/* Left: Address + Payment */}
          <div style={styles.card}>
            {/* Address Header */}
            <div style={styles.cardHeader}>
              <div style={styles.iconBox}></div>
              <span style={styles.cardTitle}>Delivery Address</span>
            </div>

            {address ? (
              <>
                <div style={styles.addressBox}>
                  <div style={styles.addressName}>{address.name}</div>
                  <div style={styles.addressPhone}> {address.phone}</div>
                  <div style={styles.addressText}>
                    {address.street}, {address.city}, {address.state} - {address.pincode}
                  </div>
                </div>
                <button
                  style={styles.changeBtn}
                  onClick={() => navigate("/address")}
                >
                   Change Address
                </button>
              </>
            ) : (
              <div style={styles.warningBox}>
                 No address selected. Please go back and select an address.
              </div>
            )}

            {/* Payment */}
            <div style={{ marginTop: 24 }} />
            <div style={styles.paymentBox}>
              <div style={{ fontSize: 24 }}></div>
              <div>
                <div style={styles.paymentTitle}>Cash on Delivery</div>
                <div style={styles.paymentSub}>Pay when you receive your order</div>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.iconBox}></div>
              <span style={styles.cardTitle}>Order Summary</span>
            </div>

            {cartItems.length === 0 ? (
              <p style={{ color: "#030303", textAlign: "center", padding: 20 }}>No items in cart</p>
            ) : (
              cartItems.map((item, i) => {
                const p = item.product;
                if (!p) return null;
                return (
                  <div key={i} style={styles.productCard}>
                   <img
  src={
    p?.mainImage?.url ||
    p?.images?.[0]?.url ||
    p?.image?.url ||
    p?.image ||
    "https://via.placeholder.com/100"
  }
  alt={p.title}
  style={styles.productImage}
/>
                    <div style={{ flex: 1 }}>
                      <div style={styles.productName}>{p.title}</div>
                      {p.gram && (
                        <span style={styles.gramBadge}>{p.gram} g</span>
                      )}
                      <div style={styles.productPrice}>₹{p.price}</div>
                      <div style={styles.qtyText}>Qty: {item.quantity}</div>
                    </div>
                  </div>
                );
              })
            )}

            {/* Price Breakdown */}
            <div style={{ marginTop: 24 }}>
              <PriceRow label="Subtotal" value={`₹${totalAmount}`} />
              <PriceRow label="Delivery" value="FREE" green />
              <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "16px 0" }} />
              <div style={styles.totalRow}>
                <span style={styles.totalLabel}>Total Amount</span>
                <span style={styles.totalValue}>₹{totalAmount}</span>
              </div>
            </div>

            {/* Place Order */}
            <button
              style={{
                ...styles.placeOrderBtn,
                opacity: loading || !address ? 0.6 : 1,
                cursor: loading || !address ? "not-allowed" : "pointer",
              }}
              onClick={placeOrder}
              disabled={loading || !address}
            >
              {loading ? "Placing Order..." : "  PLACE ORDER"}
            </button>

            <div style={styles.secureText}> Secure checkout</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PriceRow({ label, value, green }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
      <span style={{ color: "#777", fontSize: 15 }}>{label}</span>
      <span style={{ fontWeight: 600, color: green ? "#2e7d32" : "#444", fontSize: 15 }}>{value}</span>
    </div>
  );
}

const styles = {
  centered: {
    display: "flex", justifyContent: "center",
    alignItems: "center", height: "100vh",
  },
  spinner: {
    width: 36, height: 36,
    border: "3px solid #eee",
    borderTop: "3px solid #D4AF37",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  appBar: {
    background: "#fff",
    padding: "16px 24px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  appBarTitle: {
    fontWeight: 400,
    fontSize: 22,
    color: "#444",
    margin: 0,
  },
  backBtn: {
    background: "none",
    border: "none",
    fontSize: 22,
    color: "#D4AF37",
    cursor: "pointer",
  },
  breadcrumb: {
    background: "#f7f7f5",
    padding: "12px 40px",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  breadcrumbInactive: { color: "#999", fontSize: 14 },
  breadcrumbActive: { color: "#D4AF37", fontSize: 14, fontWeight: 600 },
  chevron: { color: "#ccc", fontSize: 18 },
  content: {
    padding: "28px 20px",
    display: "flex",
    justifyContent: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 28,
    width: "100%",
    maxWidth: 1100,
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    padding: 28,
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  iconBox: {
    background: "rgba(212,175,55,0.1)",
    borderRadius: 10,
    padding: "8px 10px",
    fontSize: 20,
  },
  cardTitle: { fontSize: 18, fontWeight: 600 },
  addressBox: {
    background: "#fafafa",
    border: "1px solid rgba(212,175,55,0.2)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  addressName: {color: "#666", fontWeight: 600, fontSize: 16, marginBottom: 6 },
  addressPhone: { color: "#666", fontSize: 14, marginBottom: 8 },
  addressText: { color: "#888", fontSize: 13, lineHeight: 1.6 },
  changeBtn: {
    border: "1.5px solid #D4AF37",
    background: "transparent",
    color: "#D4AF37",
    padding: "10px 16px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500,
  },
  warningBox: {
    background: "#fff3e0",
    border: "1px solid #ffcc80",
    borderRadius: 12,
    padding: 16,
    color: "#e65100",
    fontSize: 14,
  },
  paymentBox: {
    background: "#e8f5e9",
    border: "1px solid #a5d6a7",
    borderRadius: 12,
    padding: 16,
    display: "flex",
    alignItems: "center",
    gap: 14,
  },
  paymentTitle: { fontWeight: 600, color: "#1b5e20", fontSize: 15 },
  paymentSub: { color: "#388e3c", fontSize: 13, marginTop: 4 },
  productCard: {
    display: "flex",
    gap: 16,
    background: "#fafafa",
    border: "1px solid rgba(212,175,55,0.2)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  productImage: {
    width: 90, height: 90,
    borderRadius: 10,
    objectFit: "cover",
    border: "1px solid rgba(212,175,55,0.3)",
  },
  productName: { fontSize: 15, fontWeight: 500, marginBottom: 6 },
  gramBadge: {
    background: "#eee",
    padding: "3px 8px",
    borderRadius: 6,
    fontSize: 12,
    color: "#666",
  },
  productPrice: { color: "#D4AF37", fontWeight: 600, fontSize: 18, marginTop: 6 },
  qtyText: { color: "#999", fontSize: 13, marginTop: 4 },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: { fontSize: 18, fontWeight: 600 },
  totalValue: { fontSize: 26, fontWeight: 600, color: "#D4AF37" },
  placeOrderBtn: {
    width: "100%",
    padding: "15px 0",
    background: "#D4AF37",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    fontSize: 16,
    fontWeight: 600,
    marginTop: 24,
    letterSpacing: 0.5,
  },
  secureText: {
    textAlign: "center",
    color: "#aaa",
    fontSize: 12,
    marginTop: 12,
  },
};