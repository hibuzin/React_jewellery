// pages/ProductDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaHeart, FaTruck, FaLock, FaGift } from "react-icons/fa";
import { MdOutlineAutorenew } from "react-icons/md";
import CryptoJS from "crypto-js";
import AppBar from "../components/AppBar";
import MainHeader from "../components/MainHeader";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import socket from "../socket"; // ⚡ ADD THIS

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showQty, setShowQty] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);
  const mainImgUrl = product?.mainImage?.url || product?.image?.url || "https://via.placeholder.com/600";

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  useEffect(() => {
    if (!id) return;
    fetch(`https://jewellery-backend-icja.onrender.com/api/products/${id}/similar`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch similar");
        return res.json();
      })
      .then((data) => {
        console.log("SIMILAR:", data);
        setSimilarProducts(data);
      })
      .catch((err) => console.error(err));
  }, [id]);

  useEffect(() => {
    fetch(`https://jewellery-backend-icja.onrender.com/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => setProduct(data))
      .catch((err) => {
        console.error(err);
        setProduct(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // ⚡ ADD THIS — Real-time socket listeners
  useEffect(() => {
    // Admin updated stock
    socket.on("stockUpdated", ({ productId, quantity: newQty, isAvailable }) => {
      if (productId === id) {
        setProduct((prev) => ({
          ...prev,
          quantity: newQty,
          isAvailable,
        }));
        toast.info(
          isAvailable
            ? `Stock updated: ${newQty} items available`
            : "This product is now Out of Stock"
        );
      }
    });

    // Admin updated product details (price, title, image etc)
    socket.on("productUpdated", (updated) => {
      if (updated.productId === id) {
        setProduct((prev) => ({
          ...prev,
          title: updated.title ?? prev.title,
          price: updated.price ?? prev.price,
          quantity: updated.quantity ?? prev.quantity,
          isAvailable: updated.isAvailable ?? prev.isAvailable,
          mainImage: updated.mainImage ?? prev.mainImage,
        }));
      }
    });

    // Admin deleted this product
    socket.on("productDeleted", ({ productId }) => {
      if (productId === id) {
        toast.error("This product has been removed.");
        setTimeout(() => navigate("/"), 2000); // redirect to home after 2s
      }
    });

    // Cleanup on unmount or id change
    return () => {
      socket.off("stockUpdated");
      socket.off("productUpdated");
      socket.off("productDeleted");
    };
  }, [id]); // ⚡ END of socket useEffect

  if (loading)
    return <p style={{ textAlign: "center", padding: "50px" }}>Loading...</p>;

  if (!product)
    return (
      <p style={{ textAlign: "center", padding: "50px" }}>
        Product not found.
      </p>
    );

  const maxQty = Math.min(product.quantity || 0, 10);
  const imagesArray = [
    ...(product?.mainImage ? [product.mainImage] : []),
    ...(product?.images || []),
  ];

  const SECRET_KEY = "royal_jewellery_secret";

  const handleAddToCart = async () => {
  if (!product.isAvailable) {
    toast.error("This product is out of stock");
    return;
  }

  try {
    const encrypted = localStorage.getItem("auth");
    if (!encrypted) {
      toast.error("Please login first");
      return;
    }

    const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
    const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    const token = decrypted.token;

    const res = await fetch(
      "https://jewellery-backend-icja.onrender.com/api/cart/add",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product._id,
          quantity,
        }),
      }
    );

    if (!res.ok) throw new Error();

    toast.success("Added to cart successfully");
  } catch (err) {
    toast.error("Failed to add to cart");
  }
};

  const handleAddToWishlist = async () => {
    try {
      const encrypted = localStorage.getItem("auth");
      if (!encrypted) {
        showToast("Please login first", "error");
        return;
      }

      const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
      const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      const token = decrypted.token;

      const res = await fetch(
        "https://jewellery-backend-icja.onrender.com/api/wishlist",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: product._id,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Added to wishlist ");
      } else if (data?.message?.toLowerCase().includes("already")) {
        toast.info("Already saved in wishlist");
      } else {
        toast.error("Failed to add wishlist");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  const handleBuyNow = async () => {

  if (!product.isAvailable) {
    toast.error("This product is out of stock");
    return;
  }

  try {
    const encrypted = localStorage.getItem("auth");
    if (!encrypted) {
      toast.error("Please login first");
      return;
    }

    const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
    const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    const token = decrypted.token;

    const res = await fetch(
      "https://jewellery-backend-icja.onrender.com/api/orders/buy-now",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          address: {
            name: "Arshath",
            phone: "9876543210",
            street: "sornapuram",
            city: "Tenkasi",
            state: "Tamil Nadu",
            pincode: "627811",
          },
          productId: product._id,
          quantity: quantity,
          paymentMethod: "cod",
        }),
      }
    );

    if (!res.ok) throw new Error();

    toast.success("Order placed successfully ");
  } catch (err) {
    console.error(err);
    toast.error("Failed to place order");
  }
};

  return (
    <>
      {toast.show && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background:
              toast.type === "success"
                ? "linear-gradient(135deg,#1abc9c,#16a085)"
                : "linear-gradient(135deg,#ff4d4d,#c0392b)",
            color: "#fff",
            padding: "14px 28px",
            borderRadius: "8px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            fontWeight: "600",
            zIndex: 9999,
            animation: "slideDown 0.4s ease",
            letterSpacing: "0.5px",
          }}
        >
          {toast.message}
        </div>
      )}
      <AppBar />
      <MainHeader />
      <div
        style={{
          padding: "40px",
          background: "#ffffff",
          minHeight: "100vh",
        }}
      >
        <style>{`
          .thumbnail-wrapper::-webkit-scrollbar { display: none; }
          .thumbnail-wrapper { -ms-overflow-style: none; scrollbar-width: none; }

          @keyframes slideDown {
            from { opacity: 0; transform: translate(-50%, -30px); }
            to { opacity: 1; transform: translate(-50%, 0); }
          }

          .product-container { display: flex; gap: 40px; flex-wrap: wrap; align-items: flex-start; }
          .image-section { display: flex; gap: 10px; flex: 1; min-width: 600px; }
          .thumbnail-wrapper { display: flex; flex-direction: column; gap: 10px; }
          .thumbnail-item { width: 90px; height: 90px; }
          .details-section { flex: 1; min-width: 400px; }
          .button-group { display: flex; gap: 20px; margin-bottom: 30px; }
          .features-grid { display: flex; flex-wrap: wrap; gap: 20px; justify-content: space-between; }

          @media (max-width: 1024px) {
            .product-container { flex-direction: column; gap: 20px; }
            .image-section { flex-direction: column-reverse; gap: 15px; width: 100%; }
            .thumbnail-wrapper { flex-direction: row; gap: 10px; overflow-x: auto; padding-bottom: 5px; }
            .thumbnail-item { min-width: 70px; width: 70px; height: 70px; flex-shrink: 0; }
            .main-image-wrapper { width: 100%; }
            .details-section { width: 100%; }
            .button-group { flex-direction: column; }
            .button-group button { width: 100%; }
            .features-grid { display: grid; grid-template-columns: repeat(2, 1fr); }
          }

          @media (max-width: 480px) {
            .features-grid { grid-template-columns: repeat(2, 1fr); }
          }

          /* ⚡ Stock badge pulse animation when stock changes */
          @keyframes stockPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.08); }
            100% { transform: scale(1); }
          }
          .stock-badge { animation: stockPulse 0.5s ease; }
        `}</style>

        <div className="product-container">
          {/* LEFT — IMAGE + THUMBNAILS */}
          <div className="image-section">
            <div className="thumbnail-wrapper">
              {imagesArray.map((img, i) => (
                <div
                  key={i}
                  className="thumbnail-item"
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => setActiveIndex(i)}
                  style={{
                    borderRadius: "1px",
                    overflow: "hidden",
                    cursor: "pointer",
                    border: activeIndex === i ? "2px solid #f4b400" : "1px solid #ddd",
                    background: "#f5f5f5",
                    transition: "0.2s",
                  }}
                >
                  <img
                    src={img?.url || "https://via.placeholder.com/90"}
                    alt={`thumb-${i}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              ))}
            </div>

            <div className="main-image-wrapper" style={{ flex: 1 }}>
              <img
                src={
                  imagesArray[activeIndex]?.url ||
                  product?.mainImage?.url ||
                  product?.image?.url ||
                  "https://via.placeholder.com/600"
                }
                alt={product.title}
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "600px",
                  borderRadius: "1px",
                  objectFit: "cover",
                  background: "#eee",
                }}
              />
            </div>
          </div>

          {/* RIGHT — DETAILS */}
          <div className="details-section">
            <h1 style={{ color: "#000", fontSize: "28px", marginTop: 0, marginBottom: "10px" }}>
              {product.title}
            </h1>

            <div style={{ marginBottom: "10px" }}>
              {product.originalPrice && (
                <span style={{ color: "#999", textDecoration: "line-through", fontSize: "18px", marginRight: "10px" }}>
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
              {product.originalPrice && (
                <span style={{ color: "green", fontWeight: "600", fontSize: "16px" }}>
                  <span style={{ color: "#f4b400", fontSize: "18px", fontWeight: "bold", marginRight: "12px" }}>
                    ₹{product.price.toLocaleString()}
                  </span>
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
              )}
            </div>

            <p style={{ color: "#777", marginBottom: "10px" }}>
              {product.category.name} : {product.subcategory.name} &nbsp; | &nbsp;
              Gram: {product.gram} g
            </p>

            {/* ⚡ Stock badge — updates live without refresh */}
            <p
              className="stock-badge"
              key={product.isAvailable + "-" + product.quantity} // ⚡ key forces re-animation on change
              style={{
                color: product.isAvailable ? "green" : "red",
                fontWeight: 600,
                marginBottom: "20px",
              }}
            >
              {product.isAvailable
                ? `In Stock `
                : "Out of Stock"}
            </p>

           <h3 style={{ marginBottom: "4px", marginTop: "0px", color: "#000" }}>
  DESCRIPTION
</h3>

<p
  style={{
    color: "#555",
    lineHeight: "1.6",
    marginTop: "0px",
    marginBottom: "15px",
  }}
>
  {product.description}
</p>

            {/* QUANTITY DROPDOWN */}
            <div style={{ marginBottom: "20px", position: "relative", width: "90px", fontFamily: "sans-serif" }}>
              <div
                onClick={() => setShowQty(!showQty)}
                style={{
                  padding: "10px 14px",
                  border: "1px solid #e5e5e5",
                  background: "#fff",
                  color: "#333",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderRadius: "6px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "0.2s",
                }}
              >
                Qty {quantity}
                <span style={{ fontSize: "12px", color: "#999" }}>▼</span>
              </div>

              {showQty && (
                <div
                  style={{
                    position: "absolute",
                    top: "110%",
                    left: 0,
                    right: 0,
                    background: "#fff",
                    border: "1px solid #eee",
                    borderRadius: "6px",
                    zIndex: 10,
                    maxHeight: "180px",
                    overflowY: "auto",
                    boxShadow: "0 8px 18px rgba(0,0,0,0.12)",
                  }}
                >
                  {[...Array(maxQty)].map((_, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setQuantity(i + 1);
                        setShowQty(false);
                      }}
                      style={{
                        padding: "10px",
                        cursor: "pointer",
                        color: "#333",
                        borderBottom: "1px solid #f2f2f2",
                        textAlign: "center",
                      }}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* BUTTONS */}
            <div className="button-group">
              {/* ⚡ Add to Cart disabled when out of stock */}
             <button
  onClick={handleAddToCart}
  style={{
    flex: 1,
    padding: "15px",
    background: "#f4b400",
    border: "none",
     outline: "none",
    borderRadius: "1px",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  }}
>
  ADD TO CART
</button>
              <button
                onClick={handleAddToWishlist}
                style={{
                  flex: 1,
                  padding: "15px",
                  background: "white",
                  border: "2px solid #ff4d4d",
                  borderRadius: "1px",
                  color: "#ff4d4d",
                  fontWeight: "bold",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                WISHLIST
              </button>
            </div>

            {/* BUY NOW */}
            <button
  onClick={handleBuyNow}
  style={{
    width: "100%",
    background: "#ae9a60",
    border: "none",
     outline: "none",
    borderRadius: "1px",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    padding: "16px",
    fontSize: "16px",
    marginBottom: "30px",
  }}
>
  BUY NOW
</button>

            {/* FEATURES */}
            <div
              className="features-grid"
              style={{
                display: "flex",
                justifyContent: "space-between",
                background: "#eeeeee",
                padding: "20px",
                borderRadius: "1px",
                textAlign: "center",
                flexWrap: "wrap",
                gap: "20px",
              }}
            >
              <div style={{ color: "#000" }}>
                <MdOutlineAutorenew size={22} color="#f4b400" />
                <p style={{ color: "#000", fontWeight: 600 }}>Easy Returns</p>
                <small>15 days return policy</small>
              </div>
              <div style={{ color: "#000" }}>
                <FaLock size={22} color="#f4b400" />
                <p style={{ fontWeight: 600 }}>Secure Payment</p>
                <small>100% protected</small>
              </div>
              <div style={{ color: "#000" }}>
                <FaTruck size={22} color="#f4b400" />
                <p style={{ color: "#000", fontWeight: 600 }}>Fast Delivery</p>
                <small>Quick shipping</small>
              </div>
              <div style={{ color: "#000" }}>
                <FaGift size={22} color="#f4b400" />
                <p style={{ fontWeight: 600 }}>Gift Wrapping</p>
                <small>Premium packing</small>
              </div>
            </div>
          </div>
        </div>

        {/* SIMILAR PRODUCTS */}
        <div style={{ marginTop: "60px" }}>
          <h2 style={{ marginBottom: "20px", color: "#000" }}>Similar Products</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
            {similarProducts.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/product/${item._id}`)}
                style={{
                  border: "1px solid #eee",
                  padding: "15px",
                  cursor: "pointer",
                  background: "#fff",
                  transition: "0.2s",
                }}
              >
                <img
                  src={item.mainImage || "https://via.placeholder.com/300"}
                  alt={item.title}
                  style={{ width: "100%", height: "200px", objectFit: "cover", marginBottom: "10px" }}
                />
                <h4 style={{ margin: "5px 0", color: "#000" }}>{item.title}</h4>
                <p style={{ color: "#f4b400", fontWeight: "600" }}>₹{item.price.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}