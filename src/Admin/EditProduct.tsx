import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  pricePerUnit: number;
  unit: string;
  createdAt: string;
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

const EditProduct: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.post<ApiResponse<Product>>(
          "http://localhost:5122/api/Product/GetProduct",
          { id: productId },
          {
            headers: {
              "Content-Type": "application/json",
              accept: "text/plain",
            },
          }
        );
        if (response.data.isFailed) {
          throw new Error(response.data.message || "Failed to fetch product");
        }
        setProduct(response.data.data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(`Error fetching product: ${err.message}`);
        } else {
          setError("Error fetching product: An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProduct((prev) =>
      prev
        ? {
            ...prev,
            [name]: name === "pricePerUnit" ? parseFloat(value) : value,
          }
        : null
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (product) {
      try {
        const response = await axios.post<ApiResponse<Product>>(
          "http://localhost:5122/api/Product/SaveProduct",
          product,
          {
            headers: {
              "Content-Type": "application/json",
              accept: "text/plain",
            },
          }
        );
        if (response.data.isFailed) {
          throw new Error(response.data.message || "Failed to update product");
        }
        navigate("/product-listings"); // Redirect to product list after update
      } catch (error) {
        console.error("Error updating product:", error);
        if (error instanceof Error) {
          setError(`Error updating product: ${error.message}`);
        } else {
          setError("Error updating product: An unknown error occurred");
        }
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
  if (!product) return <div>Product not found</div>;

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-300 min-h-screen w-1/2 rounded-2xl">
      <h1 className="text-2xl font-bold mb-4 text-black">Edit Product</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Name:
          </label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-800 bg-white text-gray-800 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Description:
          </label>
          <input
            type="text"
            name="description"
            value={product.description}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-800 bg-white text-gray-800 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Category:
          </label>
          <input
            type="text"
            name="category"
            value={product.category}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-800 bg-white text-gray-800 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Price Per Unit:
          </label>
          <input
            type="number"
            name="pricePerUnit"
            value={product.pricePerUnit}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-800 bg-white text-gray-800 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Unit:
          </label>
          <input
            type="text"
            name="unit"
            value={product.unit}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-800 bg-white text-gray-800 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Status:
          </label>
          <input
            type="text"
            name="status"
            value={product.status}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-800 bg-white text-gray-800 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Name Amharic:
          </label>
          <input
            type="text"
            name="nameAmharic"
            value={product.nameAmharic}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-800 bg-white text-gray-800 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Description Amharic:
          </label>
          <input
            type="text"
            name="descriptionAmharic"
            value={product.descriptionAmharic}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-800 bg-white text-gray-800 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
