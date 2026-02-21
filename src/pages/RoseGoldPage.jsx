import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "../components/AppBar";
import MainHeader from "../components/MainHeader";
import Footer from "../components/Footer";

export default function RoseGoldPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ added
  const navigate = useNavigate();

  useEffect(() => {
    fetch(
      "https://jewellery-backend-icja.onrender.com/api/products/category/69982cab23fbcb21dc3583c1"
    )
      .then((res) => res.json())
      .then((data) => {
        setProducts(data || []);
        setLoading(false); // ✅ added
      })
      .catch((err) => {
        console.error(err);
        setLoading(false); // ✅ added
      });
  }, []);

  return (
    <>
      <div
        style={{
          padding: "40px",
        }}
      >
        {/* GRID */}
        <div className="product-grid">

          {/* ✅ Loading Skeleton */}
          {loading &&
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-image"></div>
              </div>
            ))}

          {/* ✅ Empty State */}
          {!loading && products.length === 0 && (
            <p style={{ gridColumn: "1/-1", textAlign: "center" }}>
              No products found
            </p>
          )}

          {/* Products */}
          {!loading &&
            products.map((item) => (
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

                {/* Overlay */}
                <div className="overlay">
                  <h3>{item.title}</h3>
                  <p>₹{item.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
        </div>

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

            .product-image {
              height: 240px;
            }
          }

          /* ✅ Skeleton Styles Added */
          .skeleton-card {
            background: #f2f2f2;
            height: 320px;
            border-radius: 6px;
            overflow: hidden;
            position: relative;
          }

          .skeleton-image {
            width: 100%;
            height: 100%;
            background: linear-gradient(
              90deg,
              #f0f0f0 25%,
              #e0e0e0 37%,
              #f0f0f0 63%
            );
            background-size: 400% 100%;
            animation: shimmer 1.4s ease infinite;
          }

          @keyframes shimmer {
            0% {
              background-position: 100% 0;
            }
            100% {
              background-position: 0 0;
            }
          }
        `}</style>
      </div>

      <Footer />
    </>
  );
}