import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainLayout from "./components/MainLayout";

import HomePage from "./pages/HomePage";
import GoldPage from "./pages/GoldPage";
import GemstonePage from "./pages/GemstonePage";
import WeddingPage from "./pages/WeddingPage";
import DiamondPage from "./pages/DiamondPage";
import PlatinumPage from "./pages/PlatinumPage";
import RoseGoldPage from "./pages/RoseGoldPage";
import RingPage from "./pages/RingPage";
import CartPage from "./components/Cart";
import AddressPage from "./pages/AddressPage";
import OrderPage from "./pages/OrderPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductDetailPage from "./pages/ProductDetailPage";
import LoginPage from "./pages/LoginPage";
import WishlistPage from "./components/Wishlist";

function App() {
  return (
    <Router>
      <Routes>

        {/* ✅ Parent layout */}
        <Route path="/" element={<MainLayout />}>

          {/* Home */}
          <Route index element={<HomePage />} />

          {/* Tabs pages */}
          <Route path="gold" element={<GoldPage />} />
          <Route path="gemstone" element={<GemstonePage />} />
          <Route path="wedding" element={<WeddingPage />} />
          <Route path="diamond" element={<DiamondPage />} />
          <Route path="platinum" element={<PlatinumPage />} />
          <Route path="rosegold" element={<RoseGoldPage />} />
          <Route path="ring" element={<RingPage />} />

        </Route>

        {/* Outside layout */}
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/address" element={<AddressPage />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="wishlist" element={<WishlistPage />} />
      </Routes>

       {/* ⭐ IMPORTANT — Toast container */}
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
    </Router>

      
  );
}

export default App;