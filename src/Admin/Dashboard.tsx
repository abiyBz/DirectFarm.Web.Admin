import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useErrorLogger } from "./errorlogger";

// Interface for Customer API response
interface CustomerApiResponse {
  responseStatus: number;
  systemMessage: {
    culture: string;
    messageType: number;
    type: string;
    message: string;
    messageCode: string;
    systemMessageCode: string;
    hasDetail: boolean;
    moduleCode: string;
    exceptionMessage: string;
  } | null;
  isFailed: boolean;
  message: string;
  data: Customer[];
}

interface Customer {
  id: string;
  // other fields...
}

// Interface for Order API response
interface OrderApiResponse {
  responseStatus: number;
  systemMessage: {
    culture: string;
    messageType: number;
    type: string;
    message: string;
    messageCode: string;
    systemMessageCode: string;
    hasDetail: boolean;
    moduleCode: string;
    exceptionMessage: string;
  } | null;
  isFailed: boolean;
  message: string;
  data: Order[];
}

interface Order {
  id: string;
  totalAmount: number;
  orderdate: string;
  // other fields...
}

// Interface for Product API response
interface ProductApiResponse {
  responseStatus: number;
  systemMessage: {
    culture: string;
    messageType: number;
    type: string;
    message: string;
    messageCode: string;
    systemMessageCode: string;
    hasDetail: boolean;
    moduleCode: string;
    exceptionMessage: string;
  } | null;
  isFailed: boolean;
  message: string;
  data: Product[];
}

interface Product {
  id: string;
  // other fields...
}

const Dashboard: React.FC = () => {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [totalOrders, setTotalOrders] = useState<number | null>(null);
  const [monthlySales, setMonthlySales] = useState<number>(0);
  const [salesData, setSalesData] = useState<{ date: string; total: number }[]>(
    []
  );
  const [totalProducts, setTotalProducts] = useState<number | null>(null); // New state for total products
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [timeFrame, setTimeFrame] = useState<"daily" | "weekly" | "monthly">(
    "daily"
  );
  const navigate = useNavigate();
  const { logError } = useErrorLogger();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, ordersResponse, productsResponse] =
          await Promise.all([
            axios.get<CustomerApiResponse>(
              "http://localhost:5122/api/Customer/GetAllCustomers"
            ),
            axios.get<OrderApiResponse>(
              "http://localhost:5122/api/Order/GetAllOrders"
            ),
            axios.get<ProductApiResponse>(
              "http://localhost:5122/api/Product/GetAllProducts"
            ), // New API call
          ]);

        if (usersResponse.data.isFailed) {
          throw new Error(
            usersResponse.data.message || "Failed to fetch users"
          );
        }
        if (ordersResponse.data.isFailed) {
          throw new Error(
            ordersResponse.data.message || "Failed to fetch orders"
          );
        }
        if (productsResponse.data.isFailed) {
          throw new Error(
            productsResponse.data.message || "Failed to fetch products"
          );
        }

        setTotalUsers(usersResponse.data.data.length);
        setTotalOrders(ordersResponse.data.data.length);
        setTotalProducts(productsResponse.data.data.length); // Set total products

        const { thisMonthSales, salesTrend } = calculateSalesTrends(
          ordersResponse.data.data,
          timeFrame
        );
        setMonthlySales(thisMonthSales);
        setSalesData(salesTrend);
      } catch (err: any) {
        logError(err);
        setError(`Error fetching data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeFrame, logError]);

  const calculateSalesTrends = (
    orders: Order[],
    frame: "daily" | "weekly" | "monthly"
  ) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Filter orders to only those within the current month
    const currentMonthOrders = orders.filter(
      (order) => new Date(order.orderdate) >= startOfMonth
    );

    // Calculate monthly sales
    const thisMonthSales = currentMonthOrders.reduce(
      (total, order) => total + order.totalAmount,
      0
    );

    // Group orders by date, week, or month based on 'frame'
    const groupedSales = currentMonthOrders.reduce((acc, order) => {
      const orderDate = new Date(order.orderdate);
      let key;

      switch (frame) {
        case "daily":
          key = orderDate.toISOString().split("T")[0];
          break;
        case "weekly": {
          const startOfWeek = new Date(
            orderDate.setDate(orderDate.getDate() - orderDate.getDay())
          );
          key = startOfWeek.toISOString().split("T")[0];
          break;
        }
        case "monthly":
          key = `${orderDate.getFullYear()}-${String(
            orderDate.getMonth() + 1
          ).padStart(2, "0")}`;
          break;
      }

      if (!acc[key]) {
        acc[key] = { date: key, total: 0 };
      }
      acc[key].total += order.totalAmount;
      return acc;
    }, {} as Record<string, { date: string; total: number }>);

    // Convert object to array for chart data
    const salesTrend = Object.values(groupedSales).sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    return { thisMonthSales, salesTrend };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error)
    return (
      <div className="text-red-600 text-center mt-8 text-2xl">
        Error: {error}
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
        Dashboard
      </h1>

      {/* Time Frame Selector with buttons */}
      <div className="flex justify-center space-x-4 mb-8">
        {["daily", "weekly", "monthly"].map((frame) => (
          <button
            key={frame}
            onClick={() =>
              setTimeFrame(frame as "daily" | "weekly" | "monthly")
            }
            className={`px-4 py-2 rounded-md text-white transition-all duration-300 ease-in-out
              ${
                timeFrame === frame
                  ? "bg-green-800"
                  : "bg-green-700 hover:bg-green-900"
              }`}
          >
            {frame.charAt(0).toUpperCase() + frame.slice(1)}
          </button>
        ))}
      </div>

      {/* Sales Summary Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 transition-all duration-300 ease-in-out hover:shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800">
          Sales Trends ({timeFrame})
        </h2>
        <p className="text-gray-600 mb-4">Overview of Sales</p>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "black",
                border: "none",
                borderRadius: "4px",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#8884d8"
              name="Sales"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md text-center transition-all duration-300 ease-in-out hover:shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800">Total Users</h3>
          <p
            className="text-2xl font-bold text-blue-600"
            aria-label="Total Users"
          >
            {totalUsers !== null ? totalUsers : "N/A"}
          </p>
        </div>
        <div
          className="bg-white p-6 rounded-lg shadow-md text-center cursor-pointer hover:bg-gray-100 transition-all duration-300 ease-in-out"
          onClick={() => navigate("/orders")}
          role="button"
          aria-label="View Orders Processed"
        >
          <h3 className="text-xl font-semibold text-gray-800">
            Orders Processed
          </h3>
          <p className="text-2xl font-bold text-purple-600">
            {totalOrders !== null ? totalOrders : "N/A"}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center transition-all duration-300 ease-in-out hover:shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800">Monthly Sales</h3>
          <p
            className="text-2xl font-bold text-green-600"
            aria-label="Monthly Sales"
          >
            Br.{monthlySales.toFixed(2)}
          </p>
        </div>
        <div
          className="bg-white p-6 rounded-lg shadow-md text-center transition-all duration-300 ease-in-out hover:shadow-lg"
          onClick={() => navigate("/products")}
          role="button"
          aria-label="View Total Products"
        >
          <h3 className="text-xl font-semibold text-gray-800">
            Total Products
          </h3>
          <p
            className="text-2xl font-bold text-orange-600"
            aria-label="Total Products"
          >
            {totalProducts !== null ? totalProducts : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
