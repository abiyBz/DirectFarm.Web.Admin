import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '../Context/CartContext';
import { useNavigate } from 'react-router-dom';
import { CiShoppingCart } from "react-icons/ci";
import { useLanguage } from "../Context/LanguageContext";

const MiniCart: React.FC = () => {
  const { language } = useLanguage();
  const { cart, removeFromCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const cartRef = useRef<HTMLDivElement>(null);

  const toggleCart = () => setIsOpen(!isOpen);

  // Close cart when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div className="relative" ref={cartRef}>
      {/* Cart Icon */}
      <div
        className="relative cursor-pointer text-gray-700 hover:text-gray-900"
        onClick={toggleCart}
      >
        <CiShoppingCart size={24} color="black" />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
          {cart.length}
        </span>
      </div>

      {/* Cart Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-gray-200">
            <h4 className="text-lg font-semibold text-gray-800">{language === "en" ? "🛍️ Cart Preview" : "🛍️ ቅርጫት"}</h4>
          </div>
          <div className="max-h-60 overflow-y-auto divide-y divide-gray-200">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 hover:bg-gray-100"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-md"
                  />
                  <div className="flex-1 ml-3">
                    <p className="text-sm font-medium text-gray-800">{language === "en" ? item.name : item.nameAmharic}{}</p>
                    <p className="text-xs text-gray-500">{item.price} ETB</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ❌
                  </button>
                </div>
              ))
            ) : (
              <p className="p-4 text-sm text-gray-500">{language === "en" ? "Your cart is empty 🛒" : "ቅርጫትዎ ባዶ ነው 🛒"}</p>
            )}
          </div>
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => navigate('/cart')}
              className="w-full text-center bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md"
            >
              {language === "en" ? "View Cart 🛒" : "ቅርጫትዎን ይመልከቱ 🛒"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniCart;
