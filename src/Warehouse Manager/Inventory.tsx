import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

// Define the interfaces as per your structure
interface Warehouse {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
}

interface Farmer {
  id: string;
  name: string;
  phone: string;
}

interface FarmerProductInfo {
  id: string; // Main ID
  farmer: Farmer; // Use the Farmer interface
  product: Product; // Use the Product interface
  quantityAvailable: number; // Quantity available for sale or stock
  warehouse: Warehouse; // Use the Warehouse interface
  addedAt: string; // ISO date string for when it was added
}

const Inventory: React.FC = () => {
  // State to store product details
  const [productName, setProductName] = useState<string>("");
  const [productDescription, setProductDescription] = useState<string>("");
  const [productQuantity, setProductQuantity] = useState<number>(0);
  const [productPrice, setProductPrice] = useState<number>(0);
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse[]>([]);
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer[]>([]);
  const [user, setUser] = useState<String>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // State for error messages
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const loginStatus = sessionStorage.getItem("managerLoggedIn");
    if (!loginStatus) {
      navigate("/WarehouseLogin"); // Redirect if already logged in
    }
  }, [navigate]);

  useEffect(() => {
    const storedLoginResponse = sessionStorage.getItem("managerLoggedIn");

    if (storedLoginResponse) {
      try {
        const parsedResponse = JSON.parse(storedLoginResponse);

        const managerId = parsedResponse.data.object.id;
        setUser(managerId);
      } catch (error) {
        console.error("Failed to parse login response:", error);
      }
    }
  }, []); // Empty dependency array to run only once on mount

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const response = await fetch(
          "http://localhost:5122/api/Farmer/GetAllFarmers",
          {
            method: "GET", // Set the method to POST
            headers: {
              "Content-Type": "application/json", // Specify the content type
            },
            // Add payload if needed
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setFarmers(data.data); // Update state with fetched data
      } catch (err) {
        setError("Failed"); // Update error state if fetching fails
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchFarmers(); // Call the fetch function
  }, []);

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const response = await fetch(
          "http://localhost:5122/api/Warehouse/GetManagersWarehouses",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: user, // Directly use the string ID
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setWarehouses(data.data);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Failed");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      // Add check to ensure user ID exists
      fetchWarehouses();
    }
  }, [user]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:5122/api/Product/GetAllProducts"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProducts(data.data); // Update state with fetched data
      } catch (err) {
        setError("Failed"); // Update error state if fetching fails
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchProducts(); // Call the fetch function
  }, []);

  // Handle form submission to add a product
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create new product object based on the FarmerProductInfo interface
    const newProduct: FarmerProductInfo = {
      id: "00000000-0000-0000-0000-000000000000", // Placeholder ID; adjust as needed
      farmer: {
        id: selectedFarmer.length > 0 ? selectedFarmer[0].id : "", // Use selected farmer ID
        name: "",
        phone: "", // Use selected farmer name
      },
      product: {
        id: selectedProduct.length > 0 ? selectedProduct[0].id : "", // Use selected product ID or placeholder
        name: "", // Use selected product name
      },
      quantityAvailable: productQuantity,
      warehouse: {
        id: selectedWarehouse.length > 0 ? selectedWarehouse[0].id : "", // Use selected warehouse ID or placeholder
        name: "", // Use selected warehouse name
      },
      addedAt: new Date().toISOString(), // Current date in ISO format
    };

    try {
      const response = await fetch(
        "http://localhost:5122/api/Warehouse/RegisterFarmersProduct",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProduct),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      const data = await response.json();

      if (data.isFailed) {
        setError(data.message || "Registration failed.");
        return;
      }

      alert("Product added successfully!");

      // Clear the form fields after submission
      setSelectedFarmer([]);
      setSelectedProduct([]);
      setSelectedWarehouse([]);
      setProductQuantity(0);
    } catch (error) {}
  };

  const handleCategoryChange = () => {
    console.log(selectedProduct);
  };

  const handleSelectedProduct = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value; // Get the selected product ID as a number
    const product = products.find((p) => p.id === selectedId); // Find the selected product

    if (product) {
      setSelectedProduct([product]); // Update state with the selected product in an array
      console.log(product); // Log the selected product
    }
  };

  const handleSelectedFarmer = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value; // Get the selected farmer ID as a number
    const farmer = farmers.find((f) => f.id === selectedId); // Find the selected farmer

    if (farmer) {
      setSelectedFarmer([farmer]); // Update state with the selected farmer in an array
      console.log(farmer); // Log the selected farmer
    }
  };

  const handleSelectedWarehouse = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value; // Get the selected warehouse ID as a number
    const warehouse = warehouses.find((w) => w.id === selectedId); // Find the selected warehouse

    if (warehouse) {
      setSelectedWarehouse([warehouse]); // Update state with the selected warehouse in an array
      console.log(warehouse); // Log the selected warehouse
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  return (
    <div className="max-w-xl mx-auto p-8 text-black">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Warehouse Manager - Add Product
      </h1>

      {/* Form to add a new product */}
      <form onSubmit={handleAddProduct} className="space-y-6 mb-8">
        <div>
          <label htmlFor="name" className="block text-lg font-semibold">
            Select a product
          </label>
          <select
            id="products"
            onChange={handleSelectedProduct}
            required
            className="w-full px-8 py-4 rounded-lg font-medium   border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
          >
            <option value="" disabled>
              Select a product
            </option>
            {filteredProducts.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-lg font-semibold">
            Select Farmer
          </label>
          <select
            id="farmers"
            onChange={handleSelectedFarmer}
            required
            className="w-full px-8 py-4 rounded-lg font-medium   border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
          >
            <option value="" disabled>
              Select a Farmer
            </option>{" "}
            {/* Placeholder option */}
            {farmers.map((farmer) => (
              <option key={farmer.id} value={farmer.id}>
                {" "}
                {/* Use farmer.id as value */}
                {farmer.name} - {farmer.phone} {/* Display farmer name */}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="quantity" className="block text-lg font-semibold">
            Quantity:
          </label>
          <input
            id="quantity"
            type="number"
            value={productQuantity}
            onChange={(e) => setProductQuantity(Number(e.target.value))}
            required
            min={1}
            className="w-full px-8 py-4 rounded-lg font-medium   border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-lg font-semibold">
            Select a warehouse
          </label>
          <select
            id="warehouses"
            onChange={handleSelectedWarehouse}
            required
            className="w-full px-8 py-4 rounded-lg font-medium   border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
          >
            {warehouses.map((warehouse) => (
              <option key={warehouse.id} value={warehouse.id}>
                {" "}
                {warehouse.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleCategoryChange}
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default Inventory;
