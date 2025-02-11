import React, { useEffect, useState } from "react";
import axios from "axios";

// Define types based on API responses
type Manager = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
};

type Warehouse = {
  id: string;
  name: string;
  location: string;
  manager: Manager;
};

type ApiResponse<T> = {
  responseStatus: number;
  systemMessage: null | string;
  isFailed: boolean;
  message: string;
  data: T;
};

const WarehouseList: React.FC = () => {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [warehouses, setWarehouses] = useState<{ [key: string]: Warehouse[] }>(
    {}
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all managers
        const managersResponse = await axios.get<ApiResponse<Manager[]>>(
          "http://localhost:5122/api/Warehouse/GetAllManagers",
          {
            headers: { accept: "text/plain" },
          }
        );
        if (managersResponse.data.isFailed) {
          throw new Error(
            managersResponse.data.message || "Failed to fetch managers"
          );
        }
        setManagers(managersResponse.data.data);

        // Fetch warehouses for each manager
        const warehousesData: { [key: string]: Warehouse[] } = {};
        for (const manager of managersResponse.data.data) {
          const warehousesResponse = await axios.post<ApiResponse<Warehouse[]>>(
            "http://localhost:5122/api/Warehouse/GetManagersWarehouses",
            { id: manager.id },
            {
              headers: {
                "Content-Type": "application/json",
                accept: "text/plain",
              },
            }
          );
          if (warehousesResponse.data.isFailed) {
            console.error(
              `Failed to fetch warehouses for manager ${manager.id}:`,
              warehousesResponse.data.message
            );
            continue; // Skip to next manager if this one fails
          }
          warehousesData[manager.id] = warehousesResponse.data.data;
        }
        setWarehouses(warehousesData);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(`Error fetching data: ${err.message}`);
        } else {
          setError("Error fetching data: An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 font-bold text-2xl">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-800">
          Warehouse List by Manager
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {managers.map((manager) => (
            <div
              key={manager.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-2xl text-black font-semibold mb-4 flex items-center">
                  <span
                    className={`mr-3 ${
                      manager.status === "active"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {manager.status === "active" ? "●" : "●"}
                  </span>
                  {manager.name}
                </h2>
                <ul className="space-y-2">
                  {warehouses[manager.id]?.map((warehouse) => (
                    <li
                      key={warehouse.id}
                      className="flex items-center p-3 bg-gray-50 rounded-md shadow-sm hover:bg-gray-100 transition duration-300"
                    >
                      <div className="flex-grow">
                        <strong className="text-lg text-gray-900">
                          {warehouse.name}
                        </strong>
                        <p className="text-sm text-gray-600">
                          {warehouse.location}
                        </p>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 text-gray-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 4.5l7.5 7.5-7.5 7.5"
                        />
                      </svg>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WarehouseList;
