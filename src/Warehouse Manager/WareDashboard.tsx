import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const loginStatus = sessionStorage.getItem("managerLoggedIn");
    if (!loginStatus) {
      navigate("/WarehouseLogin"); // Redirect if already logged in
    }
  }, [navigate]);

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Warehouse Manager Dashboard
      </h1>

      {/* Warehouse Overview Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">
          Warehouse Overview
        </h2>
        <p className="text-gray-600 mb-4">
          Overview of Inventory and Operations
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Total Inventory */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold text-gray-800">
              Total Inventory
            </h3>
            <p className="text-2xl font-bold text-blue-600">12,500 Items</p>
          </div>
          {/* Pending Shipments */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold text-gray-800">
              Pending Shipments
            </h3>
            <p className="text-2xl font-bold text-red-600">320 Orders</p>
          </div>
          {/* Items Low on Stock */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold text-gray-800">
              Items Low on Stock
            </h3>
            <p className="text-2xl font-bold text-yellow-600">15 Items</p>
          </div>
        </div>
      </div>

      {/* Sales Overview / Shipments */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">
          Recent Deliveries
        </h2>
        <p className="text-gray-600 mb-4">
          Overview of Recent Deliveries for Direct Farm
        </p>
        <div className="bg-gray-100 p-6 rounded-lg">
          <p className="text-center text-gray-400">
            Deliveries Tracking Placeholder (e.g., Delivery Trends)
          </p>
        </div>
      </div>

      {/* Key Warehouse Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold text-gray-800">
            Total Orders Processed
          </h3>
          <p className="text-2xl font-bold text-green-600">1,230 Orders</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold text-gray-800">
            Total Deliveries
          </h3>
          <p className="text-2xl font-bold text-blue-600">980 Deliveries</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold text-gray-800">
            Pending Orders
          </h3>
          <p className="text-2xl font-bold text-red-600">250 Orders</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
