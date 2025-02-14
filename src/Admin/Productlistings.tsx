import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  pricePerUnit: number;
  unit: string;
  createdAt: string; // ISO date string
  status: string;
  nameAmharic: string;
  descriptionAmharic: string;
};

type ApiResponse<T> = {
  responseStatus: number;
  systemMessage: null | string;
  isFailed: boolean;
  message: string;
  data: T;
};

const Productlistings: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<ApiResponse<Product[]>>(
          "http://localhost:5122/api/Product/GetAllProducts",
          {
            headers: {
              accept: "text/plain",
            },
          }
        );
        if (response.data.isFailed) {
          throw new Error(response.data.message || "Failed to fetch products");
        }
        setProducts(response.data.data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(`Error fetching products: ${err.message}`);
        } else {
          setError("Error fetching products: An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(
          `http://localhost:5122/api/Product/DeleteProduct/${id}`
        );
        setProducts(products.filter((product) => product.id !== id));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleEdit = (productId: string) => {
    navigate(`/edit-product/${productId}`);
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
      <div className="text-center mt-20 text-2xl text-red-500">{error}</div>
    );

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">
        Product Catalog
      </h1>
      <div className="flex justify-between items-center">
        <Link
          to="/ProductForm"
          className="mb-4 inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add New Product
        </Link>
        <button
          className="mb-4 inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={() => navigate("/low-stock")}
        >
          Check Low Stock Products
        </button>
        <button
          className="mb-4 inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={() => navigate("/check-reviews")}
        >
          Check Products Review
        </button>
      </div>
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Category
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Price
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Unit
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
                Created At
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.pricePerUnit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.unit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span
                    className={
                      product.status === "active"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(product.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => handleEdit(product.id)}
                    className="text-blue-600 hover:text-blue-800 mr-2 border-2 border-blue-600 hover:border-blue-800 rounded-md px-2 py-1 bg-transparent"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-800 border-2 border-red-600 hover:border-red-800 rounded-md px-2 py-1 bg-transparent"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Productlistings;
