// pages/ProductDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

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

  return (
    <div style={{ padding: "20px", backgroundColor: "#fdfcf9" }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          padding: "8px 16px",
          marginBottom: "20px",
          background: "#FFC107",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          color: "#fff",
          fontWeight: 600,
        }}
      >
        ← Back
      </button>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <img
          src={product.image.url}
          alt={product.title}
          style={{
            width: "100%",
            maxWidth: "500px",
            borderRadius: "12px",
            objectFit: "cover",
            alignSelf: "center",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#333" }}>
            {product.title}
          </h1>
          <p
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#FFC107",
            }}
          >
            ₹{product.price.toLocaleString()}
          </p>
          <p style={{ fontSize: "1rem", color: "#555" }}>
            {product.category.name} / {product.subcategory.name}
          </p>
          <p style={{ fontSize: "1rem", color: "#555" }}>{product.gram} grams</p>
          <p style={{ fontSize: "1rem", color: "#444" }}>{product.description}</p>
          <p
            style={{
              fontWeight: 600,
              color: product.isAvailable ? "#28a745" : "#dc3545",
            }}
          >
            {product.isAvailable ? "Available" : "Out of Stock"}
          </p>
        </div>
      </div>
    </div>
  );
}