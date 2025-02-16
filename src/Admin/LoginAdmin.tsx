/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../redux/authSlice";
import { AppDispatch, RootState } from "../redux/store";

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [role, setRole] = useState<"admin" | "warehouse">("admin"); // Role selection
  const [error, setError] = useState<string | null>(null);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  useEffect(() => {
    // Check session storage for login status and redirect
    const adminLoginStatus = sessionStorage.getItem("adminLoggedIn");
    const managerLoginStatus = sessionStorage.getItem("managerLoggedIn");

    if (adminLoginStatus) {
      dispatch(loginSuccess(JSON.parse(adminLoginStatus)));
      navigate("/");
    } else if (managerLoginStatus) {
      dispatch(loginSuccess(JSON.parse(managerLoginStatus)));
    }
  }, [dispatch, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value as "admin" | "warehouse");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Determine the API endpoint and session storage key based on the selected role
      let apiUrl: string;
      let sessionStorageKey: string;

      if (role === "admin") {
        apiUrl = "http://localhost:5122/api/Admin/AdminLogin";
        sessionStorageKey = "adminLoggedIn";
      } else {
        apiUrl = "http://localhost:5122/api/Warehouse/WarehouseLogin";
        sessionStorageKey = "managerLoggedIn";
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.isFailed) {
        setError(data.message || "Login failed.");
        return;
      }

      // Save login status to session storage and dispatch success action
      sessionStorage.setItem(sessionStorageKey, JSON.stringify(data));
      dispatch(loginSuccess(data));

      // Redirect based on role
      if (role === "admin") {
        navigate("/");
      } else {
        navigate("/");
      }
    } catch (error) {
      setError("An unexpected error occurred.");
      console.error("Login error:", error);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center items-center">
        <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
          <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
            <div className="mt-12 flex flex-col items-center">
              <h1 className="text-2xl xl:text-3xl font-extrabold">Sign In</h1>
              <p className="mt-2 text-center text-gray-600">
                Sign in to continue!
              </p>
              <div className="w-full flex-1 mt-8">
                <div className="mx-auto max-w-lg">
                  <form onSubmit={handleSubmit}>
                    {/* Role Selection */}
                    <select
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mb-5"
                      value={role}
                      onChange={handleRoleChange}
                    >
                      <option value="admin">Admin</option>
                      <option value="warehouse">Warehouse Manager</option>
                    </select>

                    {/* Email Input */}
                    <input
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />

                    {/* Password Input */}
                    <input
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />

                    {/* Error Message */}
                    {error && (
                      <p className="text-red-500 text-sm mt-3">{error}</p>
                    )}

                    {/* Submit Button */}
                    <button
                      className="mt-5 tracking-wide font-semibold bg-green-500 text-gray-100 w-full py-4 rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                      type="submit"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                        />
                      </svg>
                      <span className="ml-3">Sign In</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
