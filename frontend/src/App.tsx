import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import ProductsPage from "./pages/ProductsPage/ProductsPage";
import CategoriesPage from "./pages/CategoriesPage/CategoriesPage";
import ProductPage from "./pages/ProductPage/ProductPage";
import CategoryPage from "./pages/CategoryPage/CategoryPage";
import LandingPage from "./pages/LandingPage/LandingPage";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 
          "/" renders the landing page full-screen — no Navbar.
          All other routes render with the persistent Navbar.
        */}
        <Route path="/" element={<LandingPage />} />

        <Route
          path="/*"
          element={
            <>
              {/* Navbar persists across all routes */}
              <Navbar />

              <Routes>
                {/* Default route → redirect to /products */}
                <Route path="/" element={<Navigate to="/products" replace />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:id" element={<ProductPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/categories/:id" element={<CategoryPage />} />
              </Routes>
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
