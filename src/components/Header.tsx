import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../Context/LanguageContext";
import MiniCart from "./MiniCart";
import { logout, loginSuccess } from "../redux/authSlice";
import { AppDispatch, RootState } from "../redux/store";
import { CiUser } from "react-icons/ci";
import { fetchProducts } from "../redux/productsSlice";

const Header: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // State for managing mobile menu visibility
  const [products, setProducts] = useState<any[]>([]); // State for products
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]); // State for filtered products
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for dropdown
  const { items, status } = useSelector((state: RootState) => state.products);
  const dispatch: AppDispatch = useDispatch();

  // Retrieve products from session storage
  useEffect(() => {
    const storedProducts = sessionStorage.getItem("products");
    const products = storedProducts ? JSON.parse(storedProducts) : [];
    setProducts(products);
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setFilteredProducts([]); // Clear filtered products when clicking outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      dispatch(loginSuccess(token)); // Update Redux state if token exists
    }
  }, [dispatch]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    dispatch(logout());
    navigate("/"); // Adjust this path based on your routing structure
  };

  const handleButtonClick = () => {
    navigate("/login"); // Navigate to login page
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen); // Toggle mobile menu
  };

  // Debounce search term updates
  const debounceSearch = useCallback(
    (input: string) => {
      const timer = setTimeout(() => {
        if (items) {
          const results = items.filter(
            (product) =>
              product.nameAmharic.toLowerCase().includes(input.toLowerCase()) ||
              product.name.toLowerCase().includes(input.toLowerCase())
          );
          setFilteredProducts(results);
        }
      }, 300); // 300ms debounce delay
      return () => clearTimeout(timer);
    },
    [items]
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    debounceSearch(event.target.value);
  };

  // If products are not loaded, you might want to trigger a fetch here
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  return (
    <header className="shadow-md bg-white z-50 w-full top-0">
      {/* Top Bar */}
      <div className="bg-black text-white text-sm py-2 pl-96 pr-4 flex items-center justify-between">
        {!isLoggedIn && (
          <div>
            <span>
              {language === "en"
                ? "Up to 20% Discount for new customers, "
                : "ለአዳዲስ ደንበኞች እስከ 20% ቅናሽ"}
            </span>
            <Link to="/signup" className="underline hover:text-yellow-300">
              {language === "en"
                ? " Sign Up Now to Redeem!"
                : "  ለመውሰድ አሁን ይመዝገቡ"}
            </Link>
          </div>
        )}

        <select
          className="bg-white text-black rounded-md px-2 py-1 border border-gray-300"
          value={language}
          onChange={(e) => setLanguage(e.target.value as "en" | "am")}
        >
          <option value="en">English</option>
          <option value="am">አማርኛ (Amharic)</option>
        </select>
      </div>

      {/* Navigation Bar */}
      <div className="grid xl:grid-cols-1 grid-cols-1">
        <div>
          <div className="w-full bg-white py-3 px-3 transition-transform duration-300">
            <div className="flex justify-between items-center">
              <div className="flex justify-items-center items-center gap-2">
                <img
                  src="../logo-bg-removed.png"
                  alt="Logo"
                  className="w-12 h-12 object-contain"
                />
                <Link to="/">
                  <p className="font-semibold text-green-500">DIRECT FARM</p>
                </Link>
                <div style={{ position: "relative", left: "30px" }}>
                  <input
                    className="rounded-3xl py-3 px-3 outline-none text-xs w-full pr-10 lg:w-[350px] bg-gray-100 text-green-900"
                    placeholder={
                      language === "en"
                        ? "Search for Different Fruits, Vegetable, or Meat"
                        : "የተለያዩ ፍራፍሬ፣ አትክልት ወይም ስጋ ይፈልጉ"
                    }
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5 text-green-900 absolute right-3 top-1/2 transform -translate-y-1/2 hidden lg:block md:block"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>

                  {/* Dropdown for search results */}
                  {filteredProducts.length > 0 && (
                    <div
                      ref={dropdownRef}
                      className="absolute z-10 w-[350px] bg-white border border-gray-300 rounded-md mt-2 shadow-lg"
                    >
                      {filteredProducts.map((product) => (
                        <Link
                          key={product.id}
                          to={`/product/${product.id}`}
                          className="flex items-center py-4 px-8 hover:bg-gray-100 cursor-pointer block"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-8 h-8 mr-2 object-cover"
                          />{" "}
                          {/* Adjust size as needed */}
                          <span className="text-black">
                            {product.nameAmharic}/{product.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Desktop Navigation Links */}
              <div className="hidden md:flex justify-items-center items-center gap-8 text-white">
                <Link
                  to="/"
                  className="font-extralight block text-green-500 hover:text-green-600 transition-colors"
                >
                  {language === "en" ? "Home" : "መነሻ"}
                </Link>

                <Link
                  to="/all-products"
                  className="font-extralight block text-green-500 hover:text-green-600 transition-colors"
                >
                  {language === "en" ? "All Products" : "ሁሉንም ምርቶች ይመልከቱ"}
                </Link>

                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    {language === "en" ? "Log Out" : "ውጣ"}
                  </button>
                ) : (
                  <button
                    onClick={handleButtonClick}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg border-2 border-green-700 hover:bg-green-300 hover:text-green-900 transition"
                  >
                    {language === "en" ? "Sign-In" : "ግባ/ተመዝገብ"}
                  </button>
                )}

                {isLoggedIn && (
                  <Link
                    to="/profilepage"
                    className="hover:text-green-600 transition-colors"
                  >
                    <CiUser size={24} color="black" />
                  </Link>
                )}

                <MiniCart />
              </div>

              {/* Mobile Menu Icon */}
              <button
                onClick={toggleMenu}
                className="md:hidden text-gray-700 focus:outline-none"
                aria-label={language === "en" ? "Open Menu" : "ማውጫ ክፈት"}
                aria-expanded={isOpen ? "true" : "false"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="none"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16m-7 6h7"
                    stroke="white"
                  />
                </svg>
              </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
              <div className="md:hidden bg-white shadow-lg rounded-lg p-4 mt-4">
                {/* Mobile Navigation Links */}
                <ul className="space-y-2">
                  <li>
                    <Link
                      to="/"
                      className="font-bold block text-green-600 transition-colors "
                    >
                      {language === "en" ? "Home" : "መነሻ"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/all-products"
                      className="font-bold block text-green-600 transition-colors "
                    >
                      {language === "en"
                        ? "View All Products"
                        : "ሁሉንም ምርቶች ይመልከቱ"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/profilepage"
                      className="block text-green-600 transition-colors"
                    >
                      {language === "en" ? "Profile" : "የግል ገጽ"}
                    </Link>
                  </li>
                  <li>
                    {isLoggedIn ? (
                      <button
                        onClick={handleLogout}
                        className="bg-red-600 text-white w-full px-4 py-2 rounded-lg hover:bg-red-700 transition"
                      >
                        {language === "en" ? "Log Out" : "ውጣ"}
                      </button>
                    ) : (
                      <button
                        onClick={handleButtonClick}
                        className="bg-green-600 text-white w-full px-4 py-2 rounded-lg hover:bg-green-700 transition"
                      >
                        {language === "en" ? "Sign-In" : "ግባ/ተመዝገብ"}
                      </button>
                    )}
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
