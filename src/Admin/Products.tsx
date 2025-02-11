import axios from "axios";
import { useEffect, useState } from "react";
import { Cell, Legend, Pie, Tooltip, Bar, BarChart, XAxis, YAxis, CartesianGrid, LabelList } from "recharts";
import { PieChart, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";

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
  quantity: number; // Assuming quantity is available in the product data
}

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await axios.get<ProductApiResponse>(
          "http://localhost:5122/api/Product/GetAllProducts",
          {
            headers: {
              accept: "text/plain",
            },
          }
        );
        if (productsResponse.data.isFailed) {
          throw new Error(
            productsResponse.data.message || "Failed to fetch products"
          );
        }
        setProducts(productsResponse.data.data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(`Error fetching data: ${err.message}`);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Data for Product Category Pie Chart
  const categoryCount = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.entries(categoryCount).map(
    ([name, value], index) => ({
      name,
      value,
      fill: COLORS[index % COLORS.length],
    })
  );

  // Data for Product Quantity Bar Chart
  const productQuantityData = products.map((product, index) => ({
    name: product.name,
    quantity: product.quantity,
    fill: COLORS[index % COLORS.length],
  }));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center mt-8 text-2xl">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Product Quantities Bar Chart */}
      <div className="bg-white rounded-lg shadow-2xl p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Product Quantities
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart 
            data={productQuantityData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="name" 
              interval={0} 
              angle={-45} 
              textAnchor="end" 
              height={100} 
              stroke="#374151"
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis 
              stroke="#374151" 
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: "rgba(255,255,255,0.8)",
                border: "none",
                borderRadius: "4px",
                color: "#333",
              }}
            />
            <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: '12px' }} />
            <Bar 
              dataKey="quantity" 
              name="Quantity" 
              maxBarSize={50}
              label={{ position: 'top', fill: '#6b7280', fontSize: 10 }}
            >
              {productQuantityData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Product Categories Pie Chart */}
      <div className="bg-white rounded-lg shadow-2xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Product Categories Distribution
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              paddingAngle={1}
              label
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255,255,255,0.8)",
                border: "none",
                borderRadius: "4px",
                color: "#333",
              }}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <button
        className="bg-green-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-green-600 transition-colors duration-300"
        onClick={() => navigate("/low-stock")}
      >
        Check Low Stock Products
      </button>
    </div>
  );
};

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
  "#673AB7",
  "#03A9F4",
];

export default Products;