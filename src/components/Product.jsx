import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Product() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    fetch("https://jewellery-backend-icja.onrender.com/api/products/")
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error(err));
  }, []);

  // Responsive columns
  const getColumns = () => {
    if (window.innerWidth <= 480) return "repeat(2, 1fr)"; // Mobile: 2 per row
    if (window.innerWidth <= 768) return "repeat(3, 1fr)"; // Tablet: 3 per row
    return "repeat(auto-fill, minmax(250px, 1fr))"; // Desktop
  };

  const [columns, setColumns] = useState(getColumns());

  useEffect(() => {
    const handleResize = () => setColumns(getColumns());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: columns,
        gap: "20px",
        padding: "20px",
      }}
    >
      {items.map((item) => {
        const isHovered = hovered === item._id;

        return (
          <div
            key={item._id}
            onClick={() => navigate(`/product/${item._id}`)}
            onMouseEnter={() => setHovered(item._id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              position: "relative",
              borderRadius: "8px",
              overflow: "hidden",
              backgroundColor: "#fdfcfb",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              transition: "box-shadow 0.3s",
            }}
          >
            {/* Fixed-size wrapper */}
            <div style={{ width: "100%", height: "250px", overflow: "hidden" }}>
              <img
                src={item.image.url}
                alt={item.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.3s",
                 transform: isHovered ? "scale(1.2)" : "scale(1)"  // 110%// ✅ Zoom in on hover
                }}
              />
            </div>

            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                padding: "10px",
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0))",
                color: "#fff",
                transition: "background 0.3s",
              }}
            >
              <h4 style={{ margin: 0, fontSize: "14px" }}>{item.title}</h4>
              <p style={{ margin: "5px 0 0 0", fontWeight: "bold" }}>
                ₹{item.price}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}