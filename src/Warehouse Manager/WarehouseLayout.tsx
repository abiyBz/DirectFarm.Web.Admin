import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./Warehouse.css";
import WareSide from "./WareSide";
import Delivery from "./Delivery";
import Inventory from "./Inventory";
import WareDashboard from "./WareDashboard";
import FarmerRegistration from "./FarmerRegistration";
import WarehouseReport from "./WarehouseReport";
import WarehouseLogin from "./WarehouseLogin";

const WarehouseLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 md:hidden z-50 p-2 bg-green-500 text-white rounded-full"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-0 bg-gray-900 bg-opacity-50 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:w-60 z-40`}
        onClick={toggleSidebar}
      >
        <div
          className="h-full overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <WareSide />
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-60" : "ml-0"
        } md:ml-60`}
      >
        <div className="flex-1 p-4">
          <Routes>
            <Route path="/WarehouseLogin" element={<WarehouseLogin />} />
            <Route path="/" element={<WareDashboard />} />
            <Route path="/Inventory" element={<Inventory />} />
            <Route path="/delivery" element={<Delivery />} />
            <Route path="/registerfarmer" element={<FarmerRegistration />} />
            <Route path="/warehousereport" element={<WarehouseReport />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default WarehouseLayout;