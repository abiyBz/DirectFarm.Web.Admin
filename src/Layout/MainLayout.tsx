import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HomePage from "../pages/HomePage/HomePage";
import "./MainLayout.css";
import LoginPage from "../pages/LoginPage/LogInPage";
import SignUpPage from "../pages/SignUp/SignUp";
import Features from "../components/Features";
import { LanguageProvider } from "../Context/LanguageContext";
import AllProductsPage from "../pages/AllProductsPage/AllProductsPage";
import MiniCart from "../components/MiniCart";
import CartPage from "../pages/CartPage/CartPage";
import { CartProvider } from "../Context/CartContext";
import ProductForm from "../pages/ProductForm/ProductForm";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import ProductPage from "../pages/ProductPage/ProductPage";


const MainLayout: React.FC = () => {
  return (
    <LanguageProvider>
      <CartProvider>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/all-products" element={<AllProductsPage />} />
          <Route path="/minicart" element={<MiniCart />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/productForm" element={<ProductForm />} />
          <Route path="/profilepage" element={<ProfilePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Features />
        <Footer />
      </CartProvider>
    </LanguageProvider>
  );
};

export default MainLayout;
