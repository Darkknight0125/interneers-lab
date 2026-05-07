import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import ProductsPage from "./pages/ProductsPage/ProductsPage";
import CategoriesPage from "./pages/CategoriesPage/CategoriesPage";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      {/* Navbar persists across all routes */}
      <Navbar />

      <Routes>
        {/* Default route → redirect to /products */}
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
