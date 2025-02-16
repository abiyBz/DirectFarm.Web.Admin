import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./redux/store";
import { fetchProducts } from "./redux/productsSlice";

import AdminLayout from "./Admin/adminLayout";
import WarehouseLayout from "./Warehouse Manager/WarehouseLayout";
import Login from "./Admin/LoginAdmin";

const App: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const renderLayout = () => {
    const adminLoginStatus = sessionStorage.getItem("adminLoggedIn");
    const managerLoginStatus = sessionStorage.getItem("managerLoggedIn");

    if (adminLoginStatus) {
      return <AdminLayout />;
    } else if (managerLoginStatus) {
      return <WarehouseLayout />;
    } else {
      return <Navigate to="/login" replace />;
    }
  };

  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Conditional Route for Admin or Warehouse Layout */}
        <Route
          path="/*"
          element={
            isLoggedIn ? renderLayout() : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
