import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AdminLayout from "./Admin/adminLayout";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./redux/store";
import { fetchProducts } from "./redux/productsSlice";
import { useEffect } from "react";
import MainLayout from "./Layout/MainLayout";
import WarehouseLayout from "./Warehouse Manager/WarehouseLayout";
import WarehouseLogin from "./Warehouse Manager/WarehouseLogin";
import LoginAdmin from "./Admin/LoginAdmin";

const App: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  return (
    <Router>
      {/* The Router is only placed here */}
      <Routes>
        <Route path="*" element={<MainLayout />} />
        <Route path="/admin" element={<AdminLayout />} />
        <Route path="/warehouse" element={<WarehouseLayout />} />

        {/* Use this to work on admin layouts */}
        {/* <Route path="/login" element={<LoginAdmin />} />
        <Route
          path="*"
          element={
            isLoggedIn ? <AdminLayout /> : <Navigate to="/login" replace />
          }
        /> */}

        {/* Use this to work on warehouse layouts */}
        {/* <Route path="/login" element={<WarehouseLogin />} />
        <Route
          path="*"
          element={
            isLoggedIn ? <WarehouseLayout /> : <Navigate to="/login" replace />
          }
        /> */}
      </Routes>
    </Router>
  );
};

export default App;
