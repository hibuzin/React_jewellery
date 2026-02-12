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

      <div style={{ marginTop: "20px" }}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ color: "#000000" }}>Discover our premium collections</h2>
        </div>

        <TabsBar />
        <Slider />
        <SliderText />
        <Product /> {/* Product grid */}
      </div>
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