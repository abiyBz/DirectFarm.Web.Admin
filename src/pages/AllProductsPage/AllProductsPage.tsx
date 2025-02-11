import React, { useEffect, useState } from "react";
import { useLanguage } from "../../Context/LanguageContext";
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../redux/productsSlice';
import ProductCard from '../../components/ProductCard';
import type { AppDispatch, RootState } from '../../redux/store';

interface Product {
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
}

const AllProductsPage: React.FC = () => {
  const { language } = useLanguage();
  const dispatch = useDispatch<AppDispatch>();
  
  // Use Redux state directly
  const { items, status, error } = useSelector((state: RootState) => state.products);

  // Local state for filters
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000 });

  const fetchCategories = (items: Product[]): string[] => {
    return Array.from(new Set(items.map(product => product.category)));
  };

  useEffect(() => {
    if (items) {
      const uniqueCategories = fetchCategories(items);
      console.log("Unique Categories:", uniqueCategories); // Log for debugging
      setCategories(uniqueCategories);
    }
  }, [items]);
  
  

  // Fetch products on mount
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prevSelectedCategories) => {
      if (prevSelectedCategories.includes(category)) {
        return prevSelectedCategories.filter(item => item !== category); // Remove category if already selected
      } else {
        return [...prevSelectedCategories, category]; // Add category to the list
      }
    });
  };
  
  
  

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, type: "min" | "max") => {
    const value = Number(e.target.value);
    setPriceRange((prevRange) => {
      if (type === "min") {
        return {
          ...prevRange,
          min: Math.min(value, prevRange.max),
        };
      } else {
        return {
          ...prevRange,
          max: Math.max(value, prevRange.min),
        };
      }
    });
  };

  // Filter products whenever items or filters change
  useEffect(() => {
    if (items) {
      const filtered = items.filter((product) => {
        const isCategoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);
        const isPriceMatch = product.pricePerUnit >= priceRange.min && product.pricePerUnit <= priceRange.max;

        return isCategoryMatch && isPriceMatch;
        
      });
      setFilteredProducts(filtered);
    }
  }, [items, selectedCategories, priceRange]);

  if (status === 'loading') return <div>Loading...</div>;
  
  if (status === 'failed') return <div>Error: {error}</div>;

return (
  <div className="p-6 bg-gray-100 min-h-screen flex justify-between">
  {/* Sidebar for Filters */}
  <div className="rounded w-3/7 max-h-fit w-72 bg-white p-4 border-r border-gray-300 text-black">
    <h2 className="text-2xl font-semibold mb-4">{language === "en" ? "Categories" : "ምድቦች"}</h2>
    <div className="rounded max-h-fit bg-white p-4 border-r border-gray-300 text-black">
  
      <div className="space-y-2">
        {categories.length > 0 ? (
        categories.map((category) => (
        <div key={category}>
          <label className="flex items-center space-x-2 lg:space-x-4">
            <input 
              type="checkbox"
              checked={selectedCategories.includes(category)}
              onChange={() => handleCategoryChange(category)}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <span>{category}</span>
          </label>
        </div>
        ))) : (
        <div>No categories available</div>
        )}
        <div>
          <button 
            onClick={() => setSelectedCategories([])} 
            className="w-3/4 text-center py-2 px-4 rounded-md bg-gray-600"
          >
            {language === "en" ? "Clear All" : "ሁሉንም አጽዳ"}
          </button>
        </div>
      </div>
    </div>


    <div className="border-t border-gray-700 my-6"></div>
    <h2 className="text-2xl font-semibold mt-6 mb-4">{language === "en" ? "Price Range" : "የዋጋ ተመን"}</h2>
    <div className="mb-4">
      <label className="block text-sm mb-1">{language === "en" ? "Min Price" : "አነስተኛ የተመን"}</label>
      <input 
        type="range"
        min="0"
        max="5000"
        step="1"
        value={priceRange.min}
        onChange={(e) => handlePriceChange(e, "min")}
        className="w-full"
      />
      <span>{`Br. ${priceRange.min}`}</span>
    </div>
    <div className="mb-4">
      <label className="block text-sm mb-1">{language === "en" ? "Max Price" : "ከፍተኛ ተመን"}</label>
      <input 
        type="range"
        min="0"
        max="5000"
        step="1"
        value={priceRange.max}
        onChange={(e) => handlePriceChange(e, "max")}
        className="w-full"
      />
      <span>{`Br. ${priceRange.max}`}</span>
    </div>
  </div>

      {/* Gap between sidebar and products */}
      <div className="w-4 md:w-6 lg:w-8"></div>

      {/* Products Grid */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default AllProductsPage;
