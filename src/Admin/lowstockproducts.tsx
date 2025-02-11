import React, { useEffect, useState } from "react";
import axios from "axios";

interface Product {
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
  // Add any additional fields related to inventory here, like 'quantity' if available
}

interface ProductLowStockApiResponse {
  responseStatus: number;
  systemMessage: null;
  isFailed: boolean;
  message: string;
  data: Product[];
}

const LowStockProducts: React.FC = () => {
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [quantityThreshold, setQuantityThreshold] = useState<number>(100);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLowStockProducts = async () => {
      try {
        const response = await axios.post<ProductLowStockApiResponse>(
          `http://localhost:5122/api/Product/GetProductsBelow?quantity=${quantityThreshold}`
        );
        if (response.data.isFailed) {
          throw new Error(
            response.data.message || "Failed to fetch low stock products"
          );
        }
        setLowStockProducts(response.data.data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(`Error fetching low stock products: ${err.message}`);
        } else {
          setError("Error fetching low stock products");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLowStockProducts();
  }, [quantityThreshold]);

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
        Low Stock Products
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex justify-between items-center">
          Products Below Stock Threshold
          <input
            type="number"
            value={quantityThreshold}
            onChange={(e) => setQuantityThreshold(Number(e.target.value))}
            className="w-20 h-8 border border-gray-300 rounded-md text-sm text-gray-700 pl-2"
            placeholder="Threshold"
          />
        </h2>
        <ul className="space-y-2">
          {lowStockProducts.map((product) => (
            <li key={product.id} className="px-4 py-2 bg-gray-100 rounded-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold">{product.name}</p>
                  <p className="text-sm text-gray-600">
                    {product.category} - {product.pricePerUnit} {product.unit}
                  </p>
                </div>
                <p className="text-red-600">Low Stock</p>
              </div>
            </li>
          ))}
          {lowStockProducts.length === 0 && (
            <p>No products below the current threshold.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default LowStockProducts;
