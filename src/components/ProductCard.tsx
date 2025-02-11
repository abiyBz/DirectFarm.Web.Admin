// src/ProductCard.tsx
import React from 'react';
import { useLanguage } from "../Context/LanguageContext";
import { Link } from "react-router-dom";
import { useCart } from '../Context/CartContext';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    category: string;
    pricePerUnit: number;
    unit: string;
    createdAt: string;
    status: string;
    image?: string;
    nameAmharic: string;
    descriptionAmharic: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { language } = useLanguage(); // Move hooks inside the component
  const { addToCart } = useCart(); // Move hooks inside the component

  if (!product) {
    return <div>No product data available</div>; // Handle missing product data
  }

  return (
    
      <div className="relative bg-white shadow-md rounded-lg overflow-hidden group hover:shadow-lg transition-shadow flex flex-col max-h-fit">
        {/* Product Image */}
        <Link to={`/product/${product.id}`} className="block overflow-hidden">
          <img
            className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110"
            src={product.image || 'path/to/placeholder/image.png'}
            alt={product.name}
          />
        </Link>
        {/* Product Details */}
        <div className="p-4">
          {/* Product Name */}
          <h3 className="mt-2 font-semibold text-gray-900 text-lg leading-tight">
            {language === "en" ? product.name : product.nameAmharic}
          </h3>
  
          {/* Price */}
          <p className="mt-1 text-green-600 font-bold text-sm">
            Br. {product.pricePerUnit.toFixed(2)}
          </p>
  
          {/* Add to Cart Button */}
          <button
            className="mt-3 w-full bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-2 rounded transition transform hover:scale-105"
            onClick={(e) => {
              e.preventDefault();
              addToCart({
                ...product,
                price: product.pricePerUnit,
                quantity: 1,
                image: product.image || 'path/to/placeholder/image.png',
              });
            }}
          >
            {language === "en" ? "Add to Cart" : "ወደ ጋሪ አክል"}
          </button>
        </div>
      </div>
    
  );
};

export default ProductCard;
