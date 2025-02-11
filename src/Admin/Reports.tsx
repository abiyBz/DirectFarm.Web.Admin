import React, { useState, useEffect } from "react";
import axios from "axios";

// Interfaces for API responses

interface CustomerApiResponse {
  responseStatus: number;
  systemMessage: null;
  isFailed: boolean;
  message: string;
  data: Customer[];
}

interface Customer {
  id: string;
}

interface OrderApiResponse {
  responseStatus: number;
  systemMessage: null;
  isFailed: boolean;
  message: string;
  data: Order[];
}

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  orderdate: string;
  // other fields...
}

interface ProductApiResponse {
  responseStatus: number;
  systemMessage: null;
  isFailed: boolean;
  message: string;
  data: Product[];
}

interface Product {
  id: string;
  name: string;
  category: string;
  pricePerUnit: number;
  status: string;
  // other fields...
}

interface ProductLowStockApiResponse {
  responseStatus: number;
  systemMessage: null;
  isFailed: boolean;
  message: string;
  data: Product[];
}

type ReportType = "sales" | "customers" | "products" | "lowStock";

const Reports: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reportType, setReportType] = useState<ReportType>("sales");

  const colorPalette: Record<ReportType, string> = {
    sales: "bg-green-500",
    customers: "bg-blue-500",
    products: "bg-yellow-500",
    lowStock: "bg-red-500",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          customersResponse,
          ordersResponse,
          productsResponse,
          lowStockResponse,
        ] = await Promise.all([
          axios.get<CustomerApiResponse>(
            "http://localhost:5122/api/Customer/GetAllCustomers"
          ),
          axios.get<OrderApiResponse>(
            "http://localhost:5122/api/Order/GetAllOrders"
          ),
          axios.get<ProductApiResponse>(
            "http://localhost:5122/api/Product/GetAllProducts"
          ),
          axios.post<ProductLowStockApiResponse>(
            "http://localhost:5122/api/Product/GetProductsBelow?quantity=100"
          ),
        ]);

        if (
          customersResponse.data.isFailed ||
          ordersResponse.data.isFailed ||
          productsResponse.data.isFailed ||
          lowStockResponse.data.isFailed
        ) {
          throw new Error(
            customersResponse.data.message ||
              ordersResponse.data.message ||
              productsResponse.data.message ||
              lowStockResponse.data.message ||
              "Failed to fetch data"
          );
        }

        setCustomers(customersResponse.data.data);
        setOrders(ordersResponse.data.data);
        setProducts(productsResponse.data.data);
        setLowStockProducts(lowStockResponse.data.data);
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

  const generateReport = () => {
    switch (reportType) {
      case "sales":
        return generateSalesReport();
      case "customers":
        return generateCustomerReport();
      case "products":
        return generateProductReport();
      case "lowStock":
        return generateLowStockReport();
      default:
        return (
          <p className="text-center text-gray-600 font-semibold">
            Select a report type
          </p>
        );
    }
  };

  const generateSalesReport = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-3xl font-bold text-green-700 mb-4">Sales Report</h2>
      <table className="w-full text-left">
        <tbody>
          <tr className="border-b border-gray-200">
            <td className="py-2 text-black text-lg font-medium">Total Sales</td>
            <td className="py-2 text-lg font-bold text-green-600">
              $
              {orders
                .reduce((sum, order) => sum + order.totalAmount, 0)
                .toFixed(2)}
            </td>
          </tr>
          <tr className="border-b border-gray-200">
            <td className="py-2 text-black text-lg font-medium">
              Number of Orders
            </td>
            <td className="py-2 text-lg font-bold">{orders.length}</td>
          </tr>
        </tbody>
      </table>
      <h3 className="text-black text-xl font-semibold mt-6 mb-2">
        Sales by Status
      </h3>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(
          orders.reduce((acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        ).map(([status, count]) => (
          <li key={status} className="bg-gray-100 p-4 rounded-lg shadow-sm">
            <span className="text-gray-800 font-medium">{status}: </span>
            <span className="text-green-700 font-bold">{count}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  const generateCustomerReport = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-3xl font-bold text-blue-700 mb-4">Customer Report</h2>
      <p className="text-2xl text-blue-600 font-bold">
        Total Customers: {customers.length}
      </p>
    </div>
  );

  const generateProductReport = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-3xl font-bold text-yellow-700 mb-4">
        Product Report
      </h2>
      <p className="text-2xl text-yellow-600 font-bold">
        Total Products: {products.length}
      </p>
      <h3 className="text-black text-xl font-semibold mt-6 mb-2">
        Products by Category
      </h3>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="py-2 text-black">Category</th>
            <th className="py-2 text-black">Count</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(
            products.reduce((acc, product) => {
              acc[product.category] = (acc[product.category] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)
          ).map(([category, count]) => (
            <tr key={category} className="border-b border-gray-200">
              <td className="py-2 text-black">{category}</td>
              <td className="py-2 text-black font-bold">{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const generateLowStockReport = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-3xl font-bold text-red-700 mb-4">
        Low Stock Products Report
      </h2>
      <p className="text-2xl text-red-600 font-bold mb-4">
        Products with less than 100 in stock: {lowStockProducts.length}
      </p>
      <ul className="list-disc pl-5">
        {lowStockProducts.map((product) => (
          <li key={product.id} className="mb-2">
            <span className="text-red-500 font-medium">{product.name} -</span>{" "}
            <span className="text-gray-700">{product.category}</span>
          </li>
        ))}
      </ul>
    </div>
  );

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
        Reports
      </h1>

      <div className="mb-8 flex justify-center">
        <div className="relative">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value as ReportType)}
            className={`p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-${
              colorPalette[reportType].split("-")[1]
            }-500 focus:border-transparent w-64 ${
              colorPalette[reportType]
            } text-white`}
          >
            <option value="sales" className="text-gray-900">
              Sales Report
            </option>
            <option value="customers" className="text-gray-900">
              Customer Report
            </option>
            <option value="products" className="text-gray-900">
              Product Report
            </option>
            <option value="lowStock" className="text-gray-900">
              Low Stock Report
            </option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">{generateReport()}</div>
    </div>
  );
};

export default Reports;
