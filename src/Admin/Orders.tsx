import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

interface OrderApiResponse {
  responseStatus: number;
  systemMessage: null;
  isFailed: boolean;
  message: string;
  data: Order[];
}

interface Order {
  id: string;
  customer: null;
  totalAmount: number;
  status: string;
  orderdate: string;
  paymentDate: string | null;
  productOrders: null;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Orders
        const ordersResponse = await axios.get<OrderApiResponse>(
          "http://localhost:5122/api/Order/GetAllOrders",
          {
            headers: {
              accept: "text/plain",
            },
          }
        );
        if (ordersResponse.data.isFailed) {
          throw new Error(
            ordersResponse.data.message || "Failed to fetch orders"
          );
        }
        setOrders(ordersResponse.data.data);
      } catch (err: unknown) {
        setError(
          `Error fetching data: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Data for Order charts
  const statusCount = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusData = Object.entries(statusCount).map(
    ([name, value], index) => ({
      name,
      value,
      fill: COLORS[index % COLORS.length],
    })
  );

  const dailySalesData = orders
    .map((order) => ({
      date: new Date(order.orderdate).toISOString().split("T")[0], // Convert to ISO date string for daily aggregation
      total: order.totalAmount,
    }))
    .reduce((acc, { date, total }) => {
      const existing = acc.find((d) => d.date === date);
      if (existing) {
        existing.total += total;
      } else {
        acc.push({ date, total });
      }
      return acc;
    }, [] as { date: string; total: number }[]);

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
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-5xl font-extrabold text-indigo-700 mb-8 text-center">
        Orders & Products Dashboard
      </h1>

      {/* Total Orders */}
      <div className="bg-white rounded-lg shadow-2xl p-6 mb-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Total Orders: <span className="text-blue-600">{orders.length}</span>
        </h2>
      </div>

      {/* Sales vs Date Line Chart */}
      <div className="bg-gray-200 rounded-lg shadow-2xl p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          Sales Over Time
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailySalesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="date" stroke="#8884d8" />
            <YAxis stroke="#8884d8" />
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
              stroke="#00C49F"
              activeDot={{ r: 8 }}
              name="Total Sales"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Status Chart */}
      <div className="bg-gray-200 rounded-lg shadow-2xl p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          Order Status Distribution
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={statusData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="name" stroke="#8884d8" />
            <YAxis stroke="#8884d8" />
            <Tooltip
              contentStyle={{
                backgroundColor: "black",
                border: "solid",
                borderRadius: "4px",
              }}
            />
            <Legend wrapperStyle={{ paddingTop: "20px" }} />
            <Bar dataKey="value" fill="#8884d8" name="Count" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Array of colors for the charts
const COLORS = [
  "#4CAF50",
  "#FF0707",
  "#eb9100",
  "#113837",
  "#9C27B0",
  "#00BCD4",
  "#FF4081",
  "#8BC34A",
  "#795548",
  "#2196F3",
];

export default Orders;
