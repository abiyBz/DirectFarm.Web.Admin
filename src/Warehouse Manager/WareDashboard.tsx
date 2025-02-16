import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

// Define types for data from APIs
type Warehouse = {
  id: string;
  name: string;
  location: string;
  manager: Manager;
};
type Manager = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
};
type FarmerProduct = {
  id: string;
  farmer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    location: string;
    status: string;
  };
  product: {
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
  };
  quantityAvailable: number;
  warehouse: null;
  addedAt: string;
};
type ApiResponse<T> = {
  responseStatus: number;
  systemMessage: null | string;
  isFailed: boolean;
  message: string;
  data: T;
};

const Dashboard: React.FC = () => {
  const [managerWarehouses, setManagerWarehouses] = useState<Warehouse[]>([]);
  const [warehouseProducts, setWarehouseProducts] = useState<FarmerProduct[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string | null>(
    null
  );
  const [showProducts, setShowProducts] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<{
    key: keyof FarmerProduct["product"];
    order: "asc" | "desc";
  }>({ key: "name", order: "asc" });
  const [user, setUser] = useState<Manager>({
    id: "",
    name: "",
    email: "",
    phone: "",
    status: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const loginStatus = sessionStorage.getItem("managerLoggedIn");
    if (!loginStatus) {
      navigate("/");
      return;
    }

    try {
      const parsedResponse = JSON.parse(loginStatus);
      const managerData = parsedResponse.data.object;
      setUser({
        id: managerData.id,
        name: managerData.name || "N/A",
        email: managerData.email || "N/A",
        phone: managerData.phone || "N/A",
        status: managerData.status || "N/A",
      });
    } catch (error) {
      console.error("Failed to parse login response:", error);
      navigate("/WarehouseLogin"); // Redirect if parsing fails
    }
  }, [navigate]);

  useEffect(() => {
    const fetchManagerData = async () => {
      if (!user.id) return; // Don't fetch if no user ID

      try {
        const warehousesResponse = await axios.post<ApiResponse<Warehouse[]>>(
          "http://localhost:5122/api/Warehouse/GetManagersWarehouses",
          { id: user.id },
          {
            headers: {
              accept: "text/plain",
              "Content-Type": "application/json",
            },
          }
        );

        if (warehousesResponse.data.isFailed) {
          throw new Error(
            warehousesResponse.data.message ||
              "Failed to fetch manager warehouses"
          );
        }
        setManagerWarehouses(warehousesResponse.data.data);
        if (warehousesResponse.data.data.length > 0) {
          setSelectedWarehouse(warehousesResponse.data.data[0].id);
        }
      } catch (err: any) {
        setError(`Error fetching manager data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchManagerData();
  }, [user]);

  useEffect(() => {
    const fetchWarehouseProducts = async () => {
      if (selectedWarehouse) {
        try {
          const productsResponse = await axios.post<
            ApiResponse<FarmerProduct[]>
          >(
            "http://localhost:5122/api/Warehouse/GetWarehouseFarmerProducts",
            { id: selectedWarehouse },
            {
              headers: {
                accept: "text/plain",
                "Content-Type": "application/json",
              },
            }
          );

          if (productsResponse.data.isFailed) {
            throw new Error(
              productsResponse.data.message ||
                "Failed to fetch warehouse products"
            );
          }
          setWarehouseProducts(productsResponse.data.data);
        } catch (err: unknown) {
          console.error("Error fetching warehouse products:", err);
        }
      }
    };

    fetchWarehouseProducts();
  }, [selectedWarehouse]);

  const categoryCounts = warehouseProducts.reduce((acc, product) => {
    const category = product.product.category.split(" / ")[0];
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const pieChartData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        data: Object.values(categoryCounts),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#33CC33",
        ],
      },
    ],
  };

  const sortProducts = (products: FarmerProduct[]) => {
    return [...products].sort((a, b) => {
      if (a.product[sortBy.key] < b.product[sortBy.key])
        return sortBy.order === "asc" ? -1 : 1;
      if (a.product[sortBy.key] > b.product[sortBy.key])
        return sortBy.order === "asc" ? 1 : -1;
      return 0;
    });
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error)
    return (
      <div className="text-center mt-20 text-2xl text-red-500">{error}</div>
    );

  const handleWarehouseSelect = (warehouseId: string) => {
    setSelectedWarehouse(warehouseId);
    setShowProducts(true); // Reset view when changing warehouse
  };

  const toggleProducts = () => setShowProducts(!showProducts);

  const handleSort = (key: keyof FarmerProduct["product"]) => {
    setSortBy((prev) => ({
      key: key,
      order: prev.key === key && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  const sortedProducts = sortProducts(warehouseProducts);

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-800">
        Warehouse Manager Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Warehouse Selection */}
        <div className="bg-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-t-4 border-blue-500">
          <h2 className="text-xl font-semibold mb-4">Select Warehouse</h2>
          <select
            onChange={(e) => handleWarehouseSelect(e.target.value)}
            value={selectedWarehouse || ""}
            className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {managerWarehouses.map((warehouse) => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </option>
            ))}
          </select>
          {selectedWarehouse && (
            <div className="mt-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Selected Warehouse Details
                </h3>
                {managerWarehouses.map(
                  (warehouse) =>
                    warehouse.id === selectedWarehouse && (
                      <div key={warehouse.id} className="space-y-2">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Name:</span>{" "}
                          {warehouse.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Location:</span>{" "}
                          {warehouse.location}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Status:</span>
                          <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        </p>
                      </div>
                    )
                )}
              </div>
            </div>
          )}
        </div>

        {/* Product Distribution by Category */}
        <div className="bg-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-t-4 border-blue-500">
          <h2 className="text-xl font-semibold mb-4">Product Distribution</h2>
          <Pie data={pieChartData} />
        </div>

        {/* Warehouse Statistics */}
        <div className="bg-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-t-4 border-blue-500">
          <h2 className="text-2xl font-bold mb-6 text-blue-800 border-b pb-2">
            Warehouse Statistics
          </h2>
          <div className="space-y-6">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200">
              <span className="text-blue-700 font-medium">Total Products:</span>
              <span className="font-bold text-lg bg-blue-500 text-white px-4 py-1 rounded-full">
                {sortedProducts.length}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200">
              <span className="text-green-700 font-medium">
                Total Quantity:
              </span>
              <span className="font-bold text-lg bg-green-500 text-white px-4 py-1 rounded-full">
                {sortedProducts.reduce(
                  (sum, p) => sum + p.quantityAvailable,
                  0
                )}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200">
              <span className="text-purple-700 font-medium">
                Average Price:
              </span>
              <span className="font-bold text-lg bg-purple-500 text-white px-4 py-1 rounded-full">
                Br.{" "}
                {(
                  sortedProducts.reduce(
                    (sum, p) => sum + p.product.pricePerUnit,
                    0
                  ) / sortedProducts.length || 0
                ).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Warehouse Products */}
        <div className="bg-white rounded-lg shadow-lg p-4 col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4 flex items-center justify-between">
            Products in Selected Warehouse
            <button
              onClick={toggleProducts}
              className="text-blue-500 hover:text-blue-700"
            >
              {showProducts ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          </h2>
          {showProducts && (
            <div className="overflow-y-auto max-h-96">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 cursor-pointer"
                      onClick={() => handleSort("name")}
                    >
                      Product Name{" "}
                      {sortBy.key === "name" &&
                        (sortBy.order === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 cursor-pointer"
                      onClick={() => handleSort("pricePerUnit")}
                    >
                      Price{" "}
                      {sortBy.key === "pricePerUnit" &&
                        (sortBy.order === "asc" ? "↑" : "↓")}
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Farmer
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Added On
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b bg-white hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">{product.product.name}</td>
                      <td className="px-6 py-4">
                        {product.product.pricePerUnit} {product.product.unit}
                      </td>
                      <td className="px-6 py-4">{product.farmer.name}</td>
                      <td className="px-6 py-4">{product.quantityAvailable}</td>
                      <td className="px-6 py-4">
                        {new Date(product.addedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            Quick Actions
          </h3>
          <div className="space-y-4">
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              onClick={() => navigate("/inventory")}
            >
              <span>Add New Product</span>
            </button>

            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
              <span>Generate Report</span>
            </button>

            <div className="bg-gray-50 rounded-lg p-4 mt-6">
              <h4 className="font-semibold text-gray-700 mb-3">Quick Stats</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Low Stock Items:
                  </span>
                  <span className="bg-red-100 text-red-800 px-2.5 py-1 rounded-full text-xs font-medium">
                    {
                      sortedProducts.filter((p) => p.quantityAvailable <= 20)
                        .length
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Value:</span>
                  <span className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full text-xs font-medium">
                    Br.{" "}
                    {sortedProducts
                      .reduce(
                        (sum, p) =>
                          sum + p.quantityAvailable * p.product.pricePerUnit,
                        0
                      )
                      .toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Price Distribution */}
        <div className="bg-white rounded-lg shadow-lg p-4 col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Price Distribution</h2>
          <Bar
            data={{
              labels: sortedProducts.map((p) => p.product.name),
              datasets: [
                {
                  label: "Price per Unit",
                  data: sortedProducts.map((p) => p.product.pricePerUnit),
                  backgroundColor: "rgba(54, 162, 235, 0.6)",
                  borderColor: "rgba(54, 162, 235, 1)",
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>

        {/* Manager Information Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-t-4 border-indigo-500">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Personal Information
          </h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="bg-indigo-100 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="text-lg font-semibold text-gray-800">
                  {user?.name || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-lg font-semibold text-gray-800">
                  {user?.email || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Warehouses Managed</p>
                <p className="text-lg font-semibold text-gray-800">
                  {managerWarehouses.length}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  Account Status
                </span>
                <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
