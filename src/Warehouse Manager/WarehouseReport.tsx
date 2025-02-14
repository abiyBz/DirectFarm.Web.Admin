import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

type ReportData = {
  id: string;
  itemName: string;
  category: string;
  quantity: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  date: string;
};

const WarehouseReport: React.FC = () => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [filteredData, setFilteredData] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const loginStatus = sessionStorage.getItem("managerLoggedIn");
    if (!loginStatus) {
      navigate("/WarehouseLogin");
      return;
    }

    fetchWarehouseData();
  }, [navigate]);

  const fetchWarehouseData = async () => {
    try {
      const parsedResponse = JSON.parse(
        sessionStorage.getItem("managerLoggedIn") || "{}"
      );
      const managerId = parsedResponse.data.object.id;

      const warehousesResponse = await axios.post<{
        responseStatus: number;
        data: { id: string; name: string; location: string }[];
      }>(
        "http://localhost:5122/api/Warehouse/GetManagersWarehouses",
        { id: managerId },
        {
          headers: { accept: "text/plain", "Content-Type": "application/json" },
        }
      );

      const allProducts: ReportData[] = [];
      for (const warehouse of warehousesResponse.data.data) {
        const productsResponse = await axios.post<{
          responseStatus: number;
          data: {
            id: string;
            product: { name: string; category: string };
            quantityAvailable: number;
            addedAt: string;
          }[];
        }>(
          "http://localhost:5122/api/Warehouse/GetWarehouseFarmerProducts",
          { id: warehouse.id },
          {
            headers: {
              accept: "text/plain",
              "Content-Type": "application/json",
            },
          }
        );

        allProducts.push(
          ...productsResponse.data.data.map((product) => ({
            id: product.id,
            itemName: product.product.name,
            category: product.product.category.split(" / ")[0],
            quantity: product.quantityAvailable,
            status: (
              product.quantityAvailable > 50
                ? "In Stock"
                : product.quantityAvailable > 0
                ? "Low Stock"
                : "Out of Stock"
            ) as "In Stock" | "Low Stock" | "Out of Stock",
            date: new Date(product.addedAt).toISOString().split("T")[0],
          }))
        );
      }
      setFilteredData(allProducts);
    } catch (error) {
      setError("Failed to fetch report data.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = () => {
    let data = [...filteredData];

    if (startDate) {
      data = data.filter((item) => new Date(item.date) >= new Date(startDate));
    }

    if (endDate) {
      data = data.filter((item) => new Date(item.date) <= new Date(endDate));
    }

    if (statusFilter !== "All") {
      data = data.filter((item) => item.status === statusFilter);
    }

    setFilteredData(data);
  };

  const handleDownloadReport = () => {
    const csvContent = [
      ["ID", "Item Name", "Category", "Quantity", "Status", "Date"],
      ...filteredData.map((item) => [
        item.id,
        item.itemName,
        item.category,
        item.quantity,
        item.status,
        item.date,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "warehouse_report.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  if (loading)
    return (
      <div className="text-center mt-20 text-2xl text-gray-600">Loading...</div>
    );
  if (error)
    return (
      <div className="text-center mt-20 text-2xl text-red-500">{error}</div>
    );

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
        Warehouse Stock Report
      </h1>

      {/* Filter Section */}
      <div className="space-y-4 mb-6">
        <div className="flex gap-4">
          <label className="text-lg font-medium text-gray-700 w-32">
            Start Date:
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none w-full"
          />
        </div>
        <div className="flex gap-4">
          <label className="text-lg font-medium text-gray-700 w-32">
            End Date:
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none w-full"
          />
        </div>
        <div className="flex gap-4">
          <label className="text-lg font-medium text-gray-700 w-32">
            Status:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none w-full"
          >
            <option value="All">All</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
        <button
          onClick={handleGenerateReport}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Generate Report
        </button>
      </div>

      {/* Report Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-50 border border-gray-200 rounded-lg shadow-sm text-black">
          <thead className="bg-gray-100 text-left text-black">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Item Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Quantity</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr
                key={item.id}
                className={`${
                  item.status === "In Stock"
                    ? "bg-green-100"
                    : item.status === "Low Stock"
                    ? "bg-yellow-100"
                    : "bg-red-100"
                } hover:bg-gray-200 transition-colors`}
              >
                <td className="px-4 py-3">{item.id}</td>
                <td className="px-4 py-3">{item.itemName}</td>
                <td className="px-4 py-3">{item.category}</td>
                <td className="px-4 py-3">{item.quantity}</td>
                <td className="px-4 py-3 capitalize">{item.status}</td>
                <td className="px-4 py-3">{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownloadReport}
        className="mt-6 w-full py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        Download Report
      </button>
    </div>
  );
};

export default WarehouseReport;
