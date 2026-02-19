// pages/ProductDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaHeart, FaTruck, FaLock, FaGift } from "react-icons/fa";
import { MdOutlineAutorenew } from "react-icons/md";
import CryptoJS from "crypto-js";
import AppBar from "../components/AppBar";
import MainHeader from "../components/MainHeader";

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

  useEffect(() => {
  if (!id) return;

  fetch(
    `https://jewellery-backend-icja.onrender.com/api/products/${id}/similar`
  )
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch similar");
      return res.json();
    })
    .then((data) => {
      console.log("SIMILAR:", data);   // ⭐ debug
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

  if (loading)
    return <p style={{ textAlign: "center", padding: "50px" }}>Loading...</p>;

  if (!product)
  return (
    <p style={{ textAlign: "center", padding: "50px" }}>
      Product not found.
    </p>
  );

const imagesArray = [
  ...(product?.mainImage ? [product.mainImage] : []),
  ...(product?.images || []),
];
  

  const SECRET_KEY = "royal_jewellery_secret";

  const handleAddToCart = async () => {
    try {
      const encrypted = localStorage.getItem("auth");
      if (!encrypted) {
        alert("Please login first ❌");
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

      if (!res.ok) throw new Error("Failed to add to cart");

      const data = await res.json();
      console.log(data);
      alert("Added to cart ✅");
    } catch (err) {
      console.error(err);
      alert("Failed to add cart ❌");
    }
  };

  const handleAddToWishlist = async () => {
    try {
      const encrypted = localStorage.getItem("auth");
      if (!encrypted) {
        alert("Please login first ❌");
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

      if (!res.ok) throw new Error("Failed to add wishlist");

      const data = await res.json();
      console.log(data);
      alert("Added to wishlist ✅");
    } catch (err) {
      console.error(err);
      alert("Failed to add wishlist ❌");
    }
  };

  return (
    <>
    <AppBar />
    <MainHeader />
    <div
    
      style={{
        padding: "40px",
        background: "#ffffff",
        minHeight: "100vh",
      }}
    >
      {/* MOBILE RESPONSIVE STYLES */}
      <style>{`
        /* Hide scrollbars */
        .thumbnail-wrapper::-webkit-scrollbar { display: none; }
        .thumbnail-wrapper { -ms-overflow-style: none; scrollbar-width: none; }

        /* Desktop (default) */
        .product-container { display: flex; gap: 40px; flex-wrap: wrap; align-items: flex-start; }
        .image-section { display: flex; gap: 10px; flex: 1; min-width: 600px; }
        .thumbnail-wrapper { display: flex; flex-direction: column; gap: 10px; }
        .thumbnail-item { width: 90px; height: 90px; }
        .details-section { flex: 1; min-width: 400px; }
        .button-group { display: flex; gap: 20px; margin-bottom: 30px; }
        .features-grid { display: flex; flex-wrap: wrap; gap: 20px; justify-content: space-between; }

        /* Tablet & Mobile */
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

        /* Small Mobile */
        @media (max-width: 480px) {
          .features-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      {/* MAIN FLEX CONTAINER */}
      <div className="product-container">
        {/* LEFT — IMAGE + THUMBNAILS */}
        <div className="image-section">
          {/* THUMBNAILS */}
         {/* THUMBNAILS */}
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

{/* MAIN IMAGE */}
<div className="main-image-wrapper" style={{ flex: 1 }}>
 <img
  src={
    imagesArray[activeIndex]?.url ||
    product?.mainImage?.url ||
    product?.image?.url ||        // ✅ fallback
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
          <h2 style={{ color: "#f4b400", marginBottom: "10px" }}>
            ₹{product.price.toLocaleString()}
          </h2>
          <p style={{ color: "#777", marginBottom: "10px" }}>
            {product.category.name} : {product.subcategory.name} &nbsp; | &nbsp;
            Gram: {product.gram} g &nbsp;
          </p>
          <p style={{ color: product.isAvailable ? "green" : "red", fontWeight: 600, marginBottom: "8px" }}>
          {/* 20px → 8px */}
            {product.isAvailable ? "In Stock" : "Out of Stock"}
          </p>
          <h3 style={{ marginBottom: "10px", color: "#000" }}>DESCRIPTION</h3>
          <p style={{ color: "#555", lineHeight: "1.6", marginBottom: "30px" }}>
            {product.description}
          </p>

          {/* QUANTITY DROPDOWN */}
          <div
  style={{
    marginBottom: "20px",
    position: "relative",
    width: "140px",
    fontFamily: "sans-serif",
  }}
>
  {/* SELECT BOX */}
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
    Qty: {quantity}
    <span style={{ fontSize: "12px", color: "#999" }}>▼</span>
  </div>

  {/* DROPDOWN */}
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
      {[...Array(10)].map((_, i) => (
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
            transition: "0.2s",
          }}
          onMouseEnter={(e) =>
            (e.target.style.background = "#f9f9f9")
          }
          onMouseLeave={(e) =>
            (e.target.style.background = "#fff")
          }
        >
          {i + 1}
        </div>
      ))}
    </div>
  )}
</div>

          {/* BUTTONS */}
          <div className="button-group">
            <button
              onClick={handleAddToCart}
              style={{
                flex: 1,
                padding: "15px",
                background: "#f4b400",
                border: "none",
                borderRadius: "1px",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
                outline: "none",
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

          {/* FEATURES */}
          <div className="features-grid" style={{
            display: "flex",
            justifyContent: "space-between",
            background: "#eeeeee",
            padding: "20px",
            borderRadius: "1px",
            textAlign: "center",
            flexWrap: "wrap",
            gap: "20px",
          }}>
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
  <h2 style={{ marginBottom: "20px", color: "#000" }}>
    Similar Products
  </h2>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "20px",
    }}
  >
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

    {/* IMAGE HERE ⭐ */}
   <img
  src={item.image?.url || "https://via.placeholder.com/300"}
  alt={item.title}
  style={{
    width: "100%",
    height: "200px",
    objectFit: "cover",
    marginBottom: "10px",
  }}
    />

    <h4 style={{ margin: "5px 0", color: "#000" }}>
      {item.title}
    </h4>

    <p style={{ color: "#f4b400", fontWeight: "600" }}>
      ₹{item.price.toLocaleString()}
    </p>

  </div>
))}
  </div>
</div>
    </div>
    </>
  );
}