/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Order {
  id: string;
  customer: null;
  totalAmount: number;
  status: string;
  orderdate: string;
  paymentDate: string | null;
  productOrders: null;
}

interface OrderApiResponse {
  responseStatus: number;
  systemMessage: null;
  isFailed: boolean;
  message: string;
  data: Order[];
}

interface OrderPickedUpResponse {
  responseStatus: number;
  systemMessage: null;
  isFailed: boolean;
  message: string;
  data: boolean;
}

const OrderStatus: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterDate, setFilterDate] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get<OrderApiResponse>(
          "http://localhost:5122/api/Order/GetAllOrders",
          {
            headers: {
              accept: "text/plain",
            },
          }
        );
        if (response.data.isFailed) {
          throw new Error(response.data.message || "Failed to fetch orders");
        }
        setOrders(response.data.data);
        applyFilters(response.data.data); // Apply filters on initial load
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(`Error fetching orders: ${err.message}`);
        } else {
          setError("An unknown error occurred while fetching orders");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Effect for filtering
  useEffect(() => {
    applyFilters(orders);
  }, [filterStatus, filterDate, searchTerm, orders]);

  const applyFilters = (allOrders: Order[]) => {
    let filtered = allOrders;

    // Search by order ID or total amount
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.totalAmount.toString().includes(searchTerm)
      );
    }

    // Filter by status
    if (filterStatus) {
      filtered = filtered.filter((order) =>
        order.status.toLowerCase().includes(filterStatus.toLowerCase())
      );
    }

    // Filter by date
    if (filterDate) {
      filtered = filtered.filter(
        (order) =>
          new Date(order.orderdate).toISOString().split("T")[0] === filterDate
      );
    }

    setFilteredOrders(filtered);
  };

  const handleOrderPickedUp = async (orderId: string) => {
    try {
      const response = await axios.post<OrderPickedUpResponse>(
        `http://localhost:5122/api/Order/OrderPickedUp`,
        {
          id: orderId,
        },
        {
          headers: {
            accept: "text/plain",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.isFailed) {
        throw new Error(
          response.data.message || "Failed to update order status"
        );
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "picked up" } : order
        )
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(`Error: ${err.message}`);
      } else {
        alert("An unknown error occurred");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
        Order Management
      </h1>

      {/* Search and Filter controls */}
      <div className="mb-4 flex space-x-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by ID or Amount"
          className="p-2 border border-gray-800 rounded w-full bg-white text-gray-800"
        />
        <input
          type="text"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          placeholder="Filter by status"
          className="p-2 border border-gray-800 rounded text-gray-800 bg-white"
        />
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Order ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Amount
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.totalAmount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.status}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.orderdate).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {order.status !== "picked up" && (
                    <button
                      onClick={() => handleOrderPickedUp(order.id)}
                      className="text-indigo-600 border-2 border-indigo-600 hover:border-indigo-900 hover:bg-indigo-600 hover:text-white rounded-md px-2 py-1 bg-transparent"
                    >
                      Mark as Picked Up
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No orders match your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderStatus;
