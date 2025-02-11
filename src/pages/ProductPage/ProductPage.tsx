import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useCart } from '../../Context/CartContext';
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../Context/LanguageContext";
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

interface Review {
  product: Product;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    registrationDate: string;
    status: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

const ProductPage = () => {
  const { language } = useLanguage();
  const { id } = useParams<{ id: string }>(); // Retrieve the product ID from the URL params
  const [product, setProduct] = useState<Product | null>(null); // Initialize state for a single product
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [prodQty, setProdQty] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, Number(event.target.value)); // Ensure quantity is at least 1
    setProdQty(value);
  };
  
useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        if (id) {
          // Fetch product details
          const productResponse = await axios.post<Product>(`http://localhost:5122/api/Product/GetProduct`, { id });
          let productData = productResponse.data.data;

          if (productData) {
            // Fetch product image
            const imageResponse = await axios.post(`http://localhost:5122/api/Product/GetProductImage`, { id });
            productData = {
              ...productData,
              image: `data:image/jpg;base64,${imageResponse.data.data}`,
              createdAt: new Date(productData.createdAt).toLocaleDateString(),
            };
            setProduct(productData);

            // Fetch reviews
            const reviewsResponse = await axios.post<{ 
              responseStatus: number; 
              isFailed: boolean; 
              data: Review[]
            }>(`http://localhost:5122/api/Product/GetProductReview`, { id });
            if (!reviewsResponse.data.isFailed) {
              setReviews(reviewsResponse.data.data);

              // Calculate average rating
              const sum = reviewsResponse.data.data.reduce((acc, review) => acc + review.rating, 0);
              const avg = reviewsResponse.data.data.length > 0 ? sum / reviewsResponse.data.data.length : 0;
              setAverageRating(Number(avg.toFixed(1)));
            }
          }
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndReviews();
  }, [id]);
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Fetch product details based on the ID from the URL
        const response = await axios.post<Product>(`http://localhost:5122/api/Product/GetProduct`, { id: id });
        const productData = response.data.data; // Assuming a single product object is returned
        console.log(productData);
        // Fetch the product image (optional, if needed)
        if (productData) {
          const imageResponse = await axios.post(`http://localhost:5122/api/Product/GetProductImage`, { id });
          const image = `data:image/jpg;base64,${imageResponse.data.data}`;

          setProduct({
            ...productData,
            image: image || null,
            createdAt: new Date(productData.createdAt).toLocaleDateString(),
          });
        }

      } catch (error) {
        console.error("Fetch error:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }

  }, [id]); // Run effect when `id` changes

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-red-500">Product not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10">
    <div className="max-w-7xl mx-36 p-6 bg-white shadow-lg rounded-lg flex flex-col lg:flex-row gap-10">
    {/* Product Image */}
    <div className="lg:w-1/2 flex items-start justify-center">
      <div className="relative align-top w-full h-96 max-w-lg bg-gray-100 rounded-lg overflow-hidden shadow-sm">
        <img
          className="w-full h-full object-cover"
          src={product.image || "https://via.placeholder.com/500"}
          alt="Product Image"
        />
      </div>
    </div>

    {/* Product Details */}
    <div className="lg:w-1/2 space-y-6">
      {/* Product Name */}
      <h1 className="text-3xl font-semibold text-gray-800">
        {language === "en" ? product.name : product.nameAmharic}
      </h1>

      {/* Description */}
      <p className="text-gray-600 leading-relaxed">
        {language === "en" ? product.description : product.descriptionAmharic}
      </p>

      {/* Price and Unit */}
      <div className="flex items-center space-x-4">
        <div>
          <p className="text-lg text-gray-600">Price:</p>
          <p className="text-2xl font-bold text-gray-900">Br {product.pricePerUnit}</p>
        </div>
        <div className="w-12 md:w-14 lg:w-16"></div>
        <div>
          <p className="text-lg text-gray-600">Unit:</p>
          <p className="text-xl font-semibold text-gray-800">{product.unit}</p>
        </div>
      </div>

      {/* Status and Category */}
      <div className="flex items-center space-x-6">
        <div>
          <p className="text-lg text-gray-600">Status:</p>
          <p className={`text-xl font-semibold ${product.status === "Available" || product.status === "available" ? "text-green-600" : "text-red-600"}`}>
            {product.status}
          </p>
        </div>
        <div className="w-12 md:w-14 lg:w-16"></div>
        <div>
          <p className="text-lg text-gray-600">Category:</p>
          <p className="text-xl font-semibold text-gray-800">{product.category}</p>
        </div>
      </div>

      {/* Quantity Input */}
      <div className="flex items-center space-x-4">
            <label htmlFor="quantity" className="text-lg text-gray-600">Quantity:</label>
            <input
              id="quantity"
              type="number"
              placeholder="Qty"
              value={prodQty}
              onChange={handleQuantityChange}
              className="w-20 border border-gray-300 rounded-lg px-4 py-2 text-gray-700 text-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
          </div>

      {/* Display Average Rating */}
      <div className="text-2xl font-bold text-gray-800 mb-4">
            {language === "en" ? `Average Rating` : `አማካይ ግምገማ`}
            <p className="text-yellow-500 text-4xl">
                    {Array(5).fill(0).map((_, index) => 
                      index < averageRating ? '★' : '☆').join('')}
            </p>
          </div>

          {/* Display Reviews */}
          <div className="space-y-2">
            <h2 className="text-3xl text-black font-bold mb-2">{language === "en" ? "Reviews" : "አስተያየቶች"}</h2>
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.customer.id} className="border p-4 rounded-lg shadow-sm">
                  <p className="text-gray-700 font-semibold">{review.customer.name || "Anonymous"}</p>
                  <p className="text-yellow-500 text-sm">
                    {Array(5).fill(0).map((_, index) => 
                      index < review.rating ? '★' : '☆').join('')}
                  </p>
                  <p className="text-gray-600">{review.comment}</p>
                  <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">{language === "en" ? "No reviews yet." : "ምርቶች የሉም።"}</p>
            )}
          </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
            <button
              onClick={(e) => {
                e.preventDefault();
                addToCart({
                  ...product,
                  price: product.pricePerUnit,
                  quantity: prodQty, // Use the state variable here
                  image: product.image || "path/to/placeholder/image.png",
                });
              }}
              className="w-full bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600 transition"
            >
              Add to Cart
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                addToCart({
                  ...product,
                  price: product.pricePerUnit,
                  quantity: prodQty, // Use the state variable here
                  image: product.image || "path/to/placeholder/image.png",
                });
                navigate("/cart");
              }}
              className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-300 transition"
            >
              Checkout
            </button>
          </div>
    </div>
  </div>
</div>

  );
  
};

export default ProductPage;