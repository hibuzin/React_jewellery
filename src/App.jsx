// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AppBar from "./components/AppBar";
import TabsBar from "./components/TabsBar";
import Slider from "./components/Slider";
import SliderText from "./components/SliderText";
import Product from "./components/Product";
import ProductDetailPage from "./pages/ProductDetailPage";

function Home() {
  return (
    <>
      <AppBar />

      <div
        style={{
          marginTop: "20px",
          textAlign: "center",
          padding: "0 10px",
        }}
      >
        <h2
          style={{
            color: "#000000",
            fontSize: "clamp(16px, 2vw, 24px)",
            lineHeight: 1.3,
          }}
        >
          Discover our premium collections
        </h2>
      </div>

      {/* ✅ Directly render TabsBar */}
      <TabsBar />

      <Slider />
      <SliderText />
      <Product />
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;