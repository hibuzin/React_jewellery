import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

export default function DiamondPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);   // ✅ loading state
  const navigate = useNavigate();

  useEffect(() => {
    fetch(
      "https://jewellery-backend-icja.onrender.com/api/products/category/699823b9cb1b5f294d6e2e47"
    )
      .then((res) => res.json())
      .then((data) => {
        setProducts(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <div style={{ padding: "20px" }}>

        {/* ✅ LOADING SKELETON */}
        {loading && (
          <div className="product-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="product-card skeleton-card"></div>
            ))}
          </div>
        )}

        {/* ✅ EMPTY STATE */}
        {!loading && products.length === 0 && (
          <div className="empty">
            <h2>No products found</h2>
            <p>Please check back later.</p>
          </div>
        )}

        {/* ✅ PRODUCTS GRID */}
        {!loading && products.length > 0 && (
          <div className="product-grid">
            {products.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/product/${item._id}`)}
                className="product-card"
              >
                <img
                  src={item.mainImage?.url}
                  alt={item.title}
                  className="product-image"
                />

                <div className="overlay">
                  <h3>{item.title}</h3>
                  <p>₹{item.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* STYLES */}
        <style>{`
          .product-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
          }

          .product-card {
            position: relative;
            overflow: hidden;
            cursor: pointer;
            background: #eee;
            border-radius: 6px;
          }

          .product-image {
            width: 100%;
            height: 320px;
            object-fit: cover;
            transition: transform 0.4s ease;
            display: block;
          }

          .product-card:hover .product-image {
            transform: scale(1.05);
          }

          .overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 20px;
            background: linear-gradient(
              to top,
              rgba(0,0,0,0.8),
              rgba(0,0,0,0.0)
            );
            color: #fff;
          }

          .overlay h3 {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
          }

          .overlay p {
            margin: 6px 0 0;
            font-size: 18px;
            font-weight: 700;
          }

          /* ✅ Skeleton */
          .skeleton-card {
            height: 320px;
            animation: pulse 1.5s infinite;
          }

          @keyframes pulse {
            0% { background: #f0f0f0; }
            50% { background: #e0e0e0; }
            100% { background: #f0f0f0; }
          }

          /* ✅ Empty */
          .empty {
            text-align: center;
            padding: 80px 20px;
            color: #666;
          }

          /* Tablet */
          @media (max-width: 1024px) {
            .product-grid {
              grid-template-columns: repeat(3, 1fr);
            }
          }

          /* Mobile */
          @media (max-width: 768px) {
            .product-grid {
              grid-template-columns: repeat(2, 1fr);
            }

            .product-image,
            .skeleton-card {
              height: 240px;
            }
          }
        `}</style>
      </div>

      <Footer />
    </>
  );
}