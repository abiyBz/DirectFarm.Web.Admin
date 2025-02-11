import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Farmer = {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  location: string;
  status: string;
};

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

type Warehouse = {
  id: string;
  name: string;
  location: string;
  manager: {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: string;
  };
};

type FarmerProduct = {
  id: string;
  farmer: Farmer;
  product: Product;
  quantityAvailable: number;
  warehouse: Warehouse;
  addedAt: string;
};

type ApiResponse<T> = {
  responseStatus: number;
  systemMessage: null | {
    culture: string;
    messageType: number;
    type: string;
    message: string;
    messageCode: string;
    systemMessageCode: string;
    hasDetail: boolean;
    moduleCode: string;
    exceptionMessage: string;
  };
  isFailed: boolean;
  message: string;
  data: T;
};

const FarmersList: React.FC = () => {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedFarmerId, setExpandedFarmerId] = useState<string | null>(null);
  const [products, setProducts] = useState<{ [key: string]: FarmerProduct[] }>({});
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [warehouseFilter, setWarehouseFilter] = useState<string>('');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // This will format the date according to the locale of the browser
  };

  useEffect(() => {
    const fetchFarmersAndProducts = async () => {
      try {
        // Fetch farmers
        const farmersResponse = await axios.get<ApiResponse<Farmer[]>>('http://localhost:5122/api/Farmer/GetAllFarmers', {
          headers: {
            'accept': 'text/plain',
          }
        });
        if (farmersResponse.data.isFailed) {
          throw new Error(farmersResponse.data.message || 'Failed to fetch farmers');
        }
        setFarmers(farmersResponse.data.data);

        // Fetch all farmer products
        const productsResponse = await axios.get<ApiResponse<FarmerProduct[]>>('http://localhost:5122/api/Warehouse/GetAllFarmerProducts', {
          headers: {
            'accept': 'text/plain',
          }
        });
        if (productsResponse.data.isFailed) {
          throw new Error(productsResponse.data.message || 'Failed to fetch products');
        }

        // Organize products by farmer ID
        const productsByFarmer: { [key: string]: FarmerProduct[] } = {};
        productsResponse.data.data.forEach(product => {
          if (!productsByFarmer[product.farmer.id]) {
            productsByFarmer[product.farmer.id] = [];
          }
          productsByFarmer[product.farmer.id].push(product);
        });
        setProducts(productsByFarmer);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(`Error fetching data: ${err.message}`);
        } else {
          setError('Error fetching data: An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFarmersAndProducts();
  }, []);

  const toggleProducts = (farmerId: string) => {
    setExpandedFarmerId(prev => prev === farmerId ? null : farmerId);
  };

  const filteredFarmers = farmers.filter(farmer => 
    farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (farmer.email && farmer.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Filter products based on warehouse if a filter is set
  const filterProductsByWarehouse = (products: FarmerProduct[]) => {
    if (warehouseFilter === '') return products;
    return products.filter(product => product.warehouse.name.toLowerCase().includes(warehouseFilter.toLowerCase()));
  };

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
        <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-800">Registered Farmers</h1>

        <div className="mb-4">
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, phone, or email..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input 
            type="text" 
            value={warehouseFilter}
            onChange={(e) => setWarehouseFilter(e.target.value)}
            placeholder="Filter by warehouse name..."
            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFarmers.map((farmer) => (
            <div key={farmer.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div 
                onClick={() => toggleProducts(farmer.id)} 
                className={`p-6 cursor-pointer relative hover:bg-green-50 ${farmer.status === 'active' ? 'border-2 border-green-500' : 'border-2 border-red-500'}`}
              >
                <h2 className="text-2xl text-black font-semibold mb-4 flex items-center">
                  <span className={`mr-3 ${farmer.status === 'active' ? 'text-green-500' : 'text-red-500'}`}>
                    {farmer.status === 'active' ? '●' : '●'}
                  </span>
                  {farmer.name}
                </h2>
                <p className="text-gray-600">
                  <span className="font-medium">Phone:</span> {farmer.phone}
                </p>
                <p className="text-gray-600 mt-2">
                  <span className="font-medium">Location:</span> {farmer.location}
                </p>
                <span className="absolute bottom-4 right-4 text-blue-500 hover:underline">
                  {expandedFarmerId === farmer.id ? 'Hide Products' : 'Show Products'}
                </span>
              </div>
              {expandedFarmerId === farmer.id && products[farmer.id] && (
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <ul className="space-y-2">
                    {filterProductsByWarehouse(products[farmer.id]).map(product => (
                      <li key={product.id} className="flex items-center p-3 bg-white rounded-md shadow-sm hover:bg-gray-100 transition duration-300">
                        <div className="flex-grow">
                          <strong className="text-lg text-gray-900">{product.product.name}</strong>
                          <p className="text-sm text-gray-600">Warehouse: {product.warehouse.name}</p>
                          <p className="text-xs text-gray-500">Added: {formatDate(product.addedAt)}</p>
                        </div>
                        <span className="text-gray-700">QTY: {product.quantityAvailable}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FarmersList;