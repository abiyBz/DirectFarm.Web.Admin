import { useState } from "react";
import React from "react";
import { useCart } from "../../Context/CartContext";
import { useLanguage } from "../../Context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { loginSuccess } from "../../redux/authSlice";
import { RootState } from '../../redux/store';

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const [verified, setVerified] = useState<string | null>(null);
  const [urlSent, setUrlSent] = useState<boolean>(false);
  const [newOrder, setNewOrder] = useState<string | null>(null);
  const [deliveryOption, setDeliveryOption] = useState<string>(''); // State for delivery option


  const checkoutCart = cart.map(item => ({
    productID: item.id,
    quantity: item.quantity
  }));

  interface CheckoutData {
    id: string;
    customerID: string;
    details: any[];
  }

  const authToken = localStorage.getItem('authToken');
  let customer = null;

  if (authToken) {
    try {
      const parsedToken = JSON.parse(authToken);
      customer = parsedToken.data?.customer;
    } catch (error) {
      console.error('Failed to parse authToken:', error);
    }
  }

  const customerID = customer ? customer.id : '';

  const [checkoutData] = useState<CheckoutData>({
    id: '00000000-0000-0000-0000-000000000000',
    customerID: customerID,
    details: checkoutCart
  });

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // State to track payment status
  

  const handleQuantityChange = (id: string, value: number) => {
    if (value > 0) {
      updateQuantity(id, value);
    }
  };
  
const handleCheckout = async () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
      navigate("/login");
  } else if (deliveryOption === 'pickup') { // Only proceed if 'pickup' is selected
      try {
          // Step 1: Place order and get order ID
          const saveProductResponse = await axios.post('http://localhost:5122/api/Order/PlaceOrder', checkoutData);
          const orderId = saveProductResponse.data.data.id; // Get order ID directly
          setNewOrder(saveProductResponse.data.data.id); // Store the new order ID
          console.log(newOrder)
          // Step 2: Initialize payment and get payment URL
          const paymentResponse = await axios.post(`http://localhost:5122/api/Order/IntializePayment`, { id: orderId });
          const url = paymentResponse.data.data;
          setUrlSent(true);
          // Step 3: Open the payment URL in a new tab
          window.open(url, "_blank");

      } catch (error) {
          console.error('Error during checkout:', error);
      }
  } else {
    alert(language === "en" ? "Please select a delivery option." : "እባክዎን የመረከቢያ አማራጭ ይምረጡ።");
  }
};

const handleVerification = async () => {
  if (!newOrder) {
      console.error('No order ID available for verification.');
      return;
  }

  try {
      // Step 4: Verify payment using the stored order ID
      const verificationResponse = await axios.post(`http://localhost:5122/api/Order/VerifyPayment`, { id: newOrder });
      if(verificationResponse.data.data)
      setVerified('verified');
      setNewOrder('')
      // Handle verification response as needed (e.g., update UI or notify user)

  } catch (error) {
      console.error('Error verifying payment:', error);
  }
};

  return (
    <div className="bg-gray-100 h-screen py-8 text-black">
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-semibold mb-4">
        {language === "en" ? "Shopping Cart" : "የእርስዎ ቅርጫት"}
      </h1>
      
      {cart.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg mb-4">
            {language === "en" ? "Cart is empty!" : "ቅርጫትዎ ባዶ ነው!"}
          </p>
          <button
            onClick={() => navigate("/all-products")} // Navigate to products
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            {language === "en" ? "Go to Products" : "ወደ ምርቶች ይሂዱ"}
          </button>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-3/4">
            <div className="bg-white rounded-lg shadow-md p-6 mb-4 flow-root">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left font-semibold">{language === "en" ? "Product" : "ምርት"}</th>
                    <th className="text-left font-semibold">{language === "en" ? "Price" : "ዋጋ"}</th>
                    <th className="text-left font-semibold">{language === "en" ? "Quantity" : "ብዛት"}</th>
                    <th className="text-left font-semibold">{language === "en" ? "Total" : "ጠቅላላ"}</th>
                    <th className="text-left font-semibold">{language === "en" ? "Actions" : "እርምጃዎች"}</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id}>
                      <td className="py-4">
                        <div className="flex items-center">
                          <img
                            className="h-16 w-16 mr-4"
                            src={item.image || "https://via.placeholder.com/150"}
                            alt={item.name}
                          />
                          <span className="font-semibold">{language === "en" ? item.name : item.nameAmharic}</span>
                        </div>
                      </td>
                      <td className="py-4">Br. {item.price.toFixed(2)}</td>
                      <td className="py-4">
                        <div className="flex items-center">
                          <button
                            className="border rounded-md py-2 px-4 mr-2"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="text-center w-8">{item.quantity}</span>
                          <button
                            className="border rounded-md py-2 px-4 ml-2"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-4">Br. {(item.price * item.quantity).toFixed(2)}</td>
                      <td className="py-4 text-center">
                        <button
                          onClick={() => removeFromCart(item.id)} // Existing remove function
                          className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md"
                        >
                          {language === "en" ? "Remove" : "አስወግድ"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Clear Cart Button */}
              <button
                onClick={clearCart} // Existing clear function
                className="flex mt-4 bg-red-500 text-white outline hover:bg-white hover:text-red-600 rounded p-4 font-medium transition hover:scale-105 float-right"
              >
                {language === "en" ? "Clear Cart" : "ጋሪን አጽዳ"}
              </button>

            </div>
          </div>

          {/* Summary Section */} 
          <div className="md:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">{language === "en" ? "Summary" : "አጠቃላይ"}</h2>
              {/* Delivery Options */}
              <div className="mb-4">
                  <label className="block mb-2 font-semibold">{language === "en" ? "Delivery Option:" : "የማስረጃ ዝርዝር:"}</label>
                  <div className="flex flex-col">
                    <label>
                      <input 
                        type="radio" 
                        name="deliveryOption" 
                        value="pickup" 
                        onChange={() => setDeliveryOption('pickup')}
                        checked={deliveryOption === 'pickup'}
                        className="mr-2"
                      />
                      {language === "en" ? "Pick Up" : "ማንሳት"}
                    </label>
                    <label>
                      <input 
                        type="radio" 
                        name="deliveryOption" 
                        value="delivery" 
                        onChange={() => setDeliveryOption('delivery')}
                        checked={deliveryOption === 'delivery'}
                        className="mr-2"
                        disabled
                      />
                      <span className="line-through">{language === "en" ? "Delivery" : "ማድረስ"}</span>
                    </label>
                  </div>
                </div>
              {/* Example summary values */}
              <div className="flex justify-between mb-2">
                <span>{language === "en" ? "Subtotal" : "እንደ አጠቃላይ"}:</span>
                {/* Replace with actual subtotal variable */}
                <span>Br. {cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</span> 
              </div>
              {/* Add taxes and shipping cost here */}
              {/* Example Total */}
              <hr className="my-2" />
              <div className="flex justify-between mb-2">
                <span className="font-semibold">{language === "en" ? "Total" : "ጠቅላላ"}:</span>
                {/* Replace with actual total price variable */}
                <span className="font-semibold">Br. {totalPrice.toFixed(2)}</span> 
              </div>
              <h2 className="text-center text-red-500">{language === "en" ? "Please don't forget to download your reciept" : "እባክዎን ደረሰኝዎን ማውረድዎን አይርሱ"}</h2>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 w-full"
              >
                {language === "en" ? "Checkout" : "ወደ ክፍያ"}
              </button>

              {urlSent ? (
                
              <button 
              className="text-white hover:text-blue-600 py-2 px-4 rounded-lg mt-4 w-full" 
              onClick={handleVerification}
              >
                {language === "en" ? "Verify Payment" : "ክፍያዎትን ያረጋግጡ"}
              </button>
              ): (
                <p></p>
              )}
              {verified === null ? null : (
                verified === "verified" ? (
                    <div className="p-4 text-green-600">
                        {language === "en" ? "VERIFIED" : "ክፍያዎትን ተረጋግጧል"}
                    </div>
                ) : (
                    <div className="p-4 text-red-500">
                        {language === "en" ? "NOT VERIFIED" : "ክፍያዎት አልተከፈለም"}
                    </div>
                )
            )}
              
            </div>
          </div>

        </div>
      )}
    </div>
  </div>





  );
};

export default CartPage;
