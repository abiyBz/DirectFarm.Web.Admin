import React, { useEffect, useState } from "react";
import { useLanguage } from "../../Context/LanguageContext";
import axios from "axios";

interface ProductResponse {
  id: string;
  name: string;
  description: string;
  category: string;
  pricePerUnit: number;
  unit: string;
  createdAt: string;
  status: string;
  nameAmharic: string;
  descriptionAmharic: string;
}

interface OrderResponse {
  id: string;
  totalAmount: number;
  status: string;
  orderdate: string;
  paymentDate: string | null;
}

const ProfilePage: React.FC = () => {
  const { language } = useLanguage();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(false);
  const [orderProducts, setOrderProducts] = useState<{
    [key: string]: ProductResponse[];
  }>({});
  const [selectedProduct, setSelectedProduct] =
    useState<ProductResponse | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  // Fetch User Details
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      try {
        const parsedToken = JSON.parse(authToken);
        const customer = parsedToken.data?.customer;

        if (customer) {
          setUser({
            id: customer.id,
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            address: customer.address,
            joined: customer.registrationDate,
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to parse authToken:", error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  // Fetch Orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (user?.id) {
        try {
          const orderresponse = await axios.post(
            `http://localhost:5122/api/Customer/GetCustomerOrders`,
            { id: user.id }
          );
          if (!orderresponse.data.isFailed) {
            setOrders(orderresponse.data.data);
          } else {
            setError(orderresponse.data.message || "Failed to fetch orders.");
          }
        } catch (err) {
          console.error("Error fetching orders:", err);
          setError("Failed to fetch orders. Please try again later.");
        }
      } else {
        setOrders([]);
      }
    };

    fetchOrders();
  }, [user]);

  // Fetch Products for a Selected Order
  const fetchOrderProducts = async (orderId: string) => {
    setLoadingProducts(true);
    try {
      const response = await axios.post(
        `http://localhost:5122/api/Order/GetOrderProducts`,
        { id: orderId }
      );
      if (!response.data.isFailed) {
        setOrderProducts((prev) => ({
          ...prev,
          [orderId]: response.data.data,
        }));
      } else {
        setError(response.data.message || "Failed to fetch order products.");
      }
    } catch (err) {
      console.error("Error fetching order products:", err);
      setError("Failed to fetch order products. Please try again later.");
    } finally {
      setLoadingProducts(false);
    }
  };

  // Handle Accordion Toggle
  const handleToggle = (orderId: string) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
      if (!orderProducts[orderId]) {
        fetchOrderProducts(orderId);
      }
    }
  };

  // Handle product selection for review
  const handleProductSelect = (product: ProductResponse) => {
    setSelectedProduct(product);
    setRating(0); // Reset rating
    setComment(""); // Reset comment
  };

  // Submit Review
  const submitReview = async () => {
    if (!selectedProduct || !user) return;

    // Construct the payload according to the API structure
    const reviewPayload: {
      product: ProductResponse;
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
    } = {
      product: {
        ...selectedProduct,
        createdAt: selectedProduct.createdAt, // Assuming these match your ProductResponse interface
      },
      customer: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        registrationDate: user.joined, // Assuming 'joined' is the registration date in your user state
        status: "active", // Assuming this is always 'active' or you can fetch from user if available
      },
      rating: rating,
      comment: comment,
      createdAt: new Date().toISOString(), // Current date and time
    };

    try {
      // Send the review data to the backend
      const response = await axios.post<{ isFailed: boolean; message: string }>(
        "http://localhost:5122/api/Customer/ReviewProduct",
        reviewPayload
      );

      // Check if the review was successfully submitted
      if (response.data.isFailed) {
        setError(response.data.message || "Failed to submit review.");
      } else {
        alert(
          language === "en"
            ? "Review submitted successfully!"
            : "ምርት ግምገማውን በተሳካ ሁኔታ ላክህ!"
        );
        setSelectedProduct(null);
        setRating(0);
        setComment("");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      setError("Failed to submit review. Please try again later.");
    }
  };

  // Star Rating Component
  const Star = ({ selected = false, onClick }) => (
    <span
      onClick={onClick}
      className={`text-2xl cursor-pointer ${
        selected ? "text-yellow-600" : "text-gray-300"
      }`}
    >
      ★
    </span>
  );

  return (
    <div className="bg-gray-100 min-h-screen p-6 text-gray-800">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-black text-white">
          <h1 className="text-3xl font-semibold text-white">
            {language === "en" ? "Profile" : "መገለጫ"}
          </h1>
          <p className="text-md font-bold text-center">
            {language === "en"
              ? "Manage your account and orders"
              : "መለያዎን እና ትዕዛዞችን ያስተዳድሩ"}
          </p>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">
            {language === "en" ? "User Information" : "የተጠቃሚ መረጃ"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p>
                <strong>{language === "en" ? "Name:" : "ስም:"}</strong>{" "}
                {user?.name || "N/A"}
              </p>
              <p>
                <strong>{language === "en" ? "Email:" : "ኢሜል አድራሻ:"}</strong>{" "}
                {user?.email || "N/A"}
              </p>
              <p>
                <strong>
                  {language === "en" ? "Member ID:" : "አባል መታወቂያ:"}
                </strong>{" "}
                {user?.id || "N/A"}
              </p>
            </div>
            <div>
              <p>
                <strong>{language === "en" ? "Phone:" : "ስልክ:"}</strong>{" "}
                {user?.phone || "N/A"}
              </p>
              <p>
                <strong>{language === "en" ? "Address:" : "አድራሻ:"}</strong>{" "}
                {user?.address || "N/A"}
              </p>
            </div>
          </div>
          <p className="mt-4 text-gray-500 text-sm">
            {language === "en" ? "Member since:" : "አባል:"}{" "}
            {user?.joined || "N/A"}
          </p>
        </div>

        <div className="p-6 border-t">
          <h2 className="text-2xl font-bold mb-4">
            {language === "en" ? "Order History" : "የትዕዛዝ ታሪክ"}
          </h2>
          <ul>
            {orders.map((order) => (
              <li key={order.id} className="mb-4 border rounded-md">
                <div
                  className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => handleToggle(order.id)}
                >
                  <div>
                    <p>
                      <strong>
                        {language === "en" ? "Order ID:" : "የትዕዛዝ መታወቂያ:"}
                      </strong>{" "}
                      {order.id}
                    </p>
                    <p>
                      <strong>{language === "en" ? "Date:" : "ቀን:"}</strong>{" "}
                      {new Date(order.orderdate).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>
                        {language === "en" ? "Total Amount:" : "ጠቅላላ ድምር:"}
                      </strong>{" "}
                      Br {order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`px-2 py-1 text-sm font-medium rounded-md ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-800"
                          : order.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "success"
                          ? "bg-green-200 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.status}
                    </span>
                    <svg
                      className={`w-6 h-6 ml-2 ${
                        expandedOrderId === order.id
                          ? "transform rotate-180"
                          : ""
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>

                {expandedOrderId === order.id && (
                  <div className="p-4 bg-gray-50">
                    {loadingProducts ? (
                      <p>
                        {language === "en"
                          ? "Loading products..."
                          : "ምርቶች በመጫን ላይ..."}
                      </p>
                    ) : (
                      <ul>
                        {orderProducts[order.id]?.map((product) => (
                          <li
                            key={product.id}
                            className="mb-4 p-2 border-b border-gray-200"
                          >
                            <h3 className="font-bold mb-2">
                              {language === "en"
                                ? product.name
                                : product.nameAmharic}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {language === "en"
                                ? product.description
                                : product.descriptionAmharic}
                            </p>
                            <p>
                              <strong>
                                {language === "en" ? "Price:" : "ዋጋ:"}
                              </strong>{" "}
                              Br {product.pricePerUnit}
                            </p>
                            <button
                              onClick={() => handleProductSelect(product)}
                              className="mt-2 px-4 py-2 bg-blue-700 text-white outline hover:text-blue-700 hover:bg-white font-medium transition hover:scale-105 rounded-full"
                            >
                              {language === "en" ? "Review" : "አስተያየት መስጫ"}
                            </button>
                          </li>
                        )) || (
                          <p>
                            {language === "en"
                              ? "No products found for this order."
                              : "ለዚህ ትዕዛዝ ምርቶች አልተገኙም።"}
                          </p>
                        )}
                      </ul>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Review Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">
                {language === "en"
                  ? selectedProduct.name
                  : selectedProduct.nameAmharic}
              </h2>
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    selected={rating >= star}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={
                  language === "en"
                    ? "Write your review here..."
                    : "የእርስዎን ምርት እዚህ ይጻፉ..."
                }
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
              ></textarea>
              <div className="flex justify-end">
                <button
                  onClick={submitReview}
                  className="px-4 py-2 bg-blue-700 rounded-full text-white outline hover:text-blue-700 hover:bg-white"
                >
                  {language === "en" ? "Submit" : "ላክ"}
                </button>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="ml-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 focus:outline-none"
                >
                  {language === "en" ? "Cancel" : "ሰረዝ"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
