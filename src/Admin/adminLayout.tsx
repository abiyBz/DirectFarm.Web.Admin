import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import ManageUsers from "./Manageuser";
import OrderStatus from "./OrderStatus";
import Reports from "./Reports";
import ProductListing from "./Productlistings";
import RegisterWarehouse from "./RegisterWarehouse";
import AdminLogin from "./LoginAdmin";
import ProductForm from "./addproduct";
import Orders from "./Orders";
import { ErrorLogger } from "./errorlogger";
import Products from "./Products";
import LowStockProducts from "./lowstockproducts";
import EditProduct from "./EditProduct";
import WarehouseList from "./WarehouseList";
import CheckReviews from "./CheckReviews";

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <ErrorLogger>
      <div className="flex h-screen bg-white">
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
            <Sidebar />
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
              <Route path="/" element={<Dashboard />} />
              <Route path="/manage-users" element={<ManageUsers />} />
              <Route path="/OrderStatus" element={<OrderStatus />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/product-listings" element={<ProductListing />} />
              <Route path="/login" element={<AdminLogin />} />
              <Route
                path="/registerwarehouse"
                element={<RegisterWarehouse />}
              />
              <Route path="/ProductForm" element={<ProductForm />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/products" element={<Products />} />
              <Route path="/low-stock" element={<LowStockProducts />} />
              <Route
                path="/edit-product/:productId"
                element={<EditProduct />}
              />
              <Route path="/warehouse-list" element={<WarehouseList />} />
              <Route path="/check-reviews" element={<CheckReviews />} />
            </Routes>
          </div>
        </div>
      </div>
    </ErrorLogger>
  );
};

export default AdminLayout;
