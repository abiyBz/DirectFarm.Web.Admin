import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

type Delivery = {
  id: string;
  date: string;
  status: string;
  carrier: string;
  items: string;
};

const deliveries: Delivery[] = [
  {
    id: "D1234",
    date: "2025-01-04",
    status: "Delivered",
    carrier: "Ride",
    items: "50kg Onions",
  },
  {
    id: "D5678",
    date: "2025-01-03",
    status: "In Transit",
    carrier: "Zmall",
    items: "5kg Brocolli",
  },
  {
    id: "D9101",
    date: "2025-01-02",
    status: "Delayed",
    carrier: "BeU",
    items: "10kg Tomatoes",
  },
];

const TrackDeliveries: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const loginStatus = sessionStorage.getItem("managerLoggedIn");
    if (!loginStatus) {
      navigate("/WarehouseLogin"); // Redirect if already logged in
    }
  }, [navigate]);
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Track Deliveries</h1>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Delivery ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Carrier
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Items
              </th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map((delivery) => (
              <tr key={delivery.id} className="border-t">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {delivery.id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {delivery.date}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      delivery.status === "Delivered"
                        ? "bg-green-100 text-green-600"
                        : delivery.status === "In Transit"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {delivery.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {delivery.carrier}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {delivery.items}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrackDeliveries;
