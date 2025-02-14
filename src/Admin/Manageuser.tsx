import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';

// Types
type Farmer = {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  location: string;
  status: 'active' | 'inactive';
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
  isFailed: boolean;
  message: string;
  data: T;
};

// Utility Functions
const formatDate = (dateString: string) => 
  new Date(dateString).toLocaleDateString();

// Main Component
const FarmersList: React.FC = () => {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedFarmerId, setExpandedFarmerId] = useState<string | null>(null);
  const [products, setProducts] = useState<Record<string, FarmerProduct[]>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('');

  // Fetch data with error handling
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [farmersRes, productsRes] = await Promise.all([
        axios.get<ApiResponse<Farmer[]>>('http://localhost:5122/api/Farmer/GetAllFarmers'),
        axios.get<ApiResponse<FarmerProduct[]>>('http://localhost:5122/api/Warehouse/GetAllFarmerProducts')
      ]);

      if (farmersRes.data.isFailed || productsRes.data.isFailed) {
        throw new Error(farmersRes.data.message || productsRes.data.message);
      }

      setFarmers(farmersRes.data.data);

      const productsByFarmer = productsRes.data.data.reduce((acc, product) => {
        acc[product.farmer.id] = [...(acc[product.farmer.id] || []), product];
        return acc;
      }, {} as Record<string, FarmerProduct[]>);

      setProducts(productsByFarmer);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Memoized filtered farmers
  const filteredFarmers = useMemo(() => 
    farmers.filter(farmer =>
      [farmer.name, farmer.phone, farmer.email].some(
        field => field?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    ),
    [farmers, searchTerm]
  );

  // Memoized product filter
  const filterProductsByWarehouse = useCallback((products: FarmerProduct[]) => 
    warehouseFilter 
      ? products.filter(p => 
          p.warehouse.name.toLowerCase().includes(warehouseFilter.toLowerCase())
        )
      : products,
    [warehouseFilter]
  );

  const toggleProducts = useCallback((farmerId: string) => 
    setExpandedFarmerId(prev => prev === farmerId ? null : farmerId),
    []
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} onRetry={fetchData} />;

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-800">
          Registered Farmers
        </h1>

        <SearchFilters 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          warehouseFilter={warehouseFilter}
          onWarehouseFilterChange={setWarehouseFilter}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFarmers.map(farmer => (
            <FarmerCard
              key={farmer.id}
              farmer={farmer}
              isExpanded={expandedFarmerId === farmer.id}
              products={filterProductsByWarehouse(products[farmer.id] || [])}
              onToggle={toggleProducts}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Sub-components
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500" />
  </div>
);

const ErrorDisplay: React.FC<{ message: string; onRetry: () => void }> = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center h-screen space-y-4">
    <div className="text-red-500 font-bold text-2xl">{message}</div>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
    >
      Retry
    </button>
  </div>
);

const SearchFilters: React.FC<{
  searchTerm: string;
  onSearchChange: (value: string) => void;
  warehouseFilter: string;
  onWarehouseFilterChange: (value: string) => void;
}> = ({ searchTerm, onSearchChange, warehouseFilter, onWarehouseFilterChange }) => (
  <div className="mb-4 space-y-2">
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      placeholder="Search by name, phone, or email..."
      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
    <input
      type="text"
      value={warehouseFilter}
      onChange={(e) => onWarehouseFilterChange(e.target.value)}
      placeholder="Filter by warehouse name..."
      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  </div>
);

const FarmerCard: React.FC<{
  farmer: Farmer;
  isExpanded: boolean;
  products: FarmerProduct[];
  onToggle: (farmerId: string) => void;
}> = ({ farmer, isExpanded, products, onToggle }) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
    <div 
      onClick={() => onToggle(farmer.id)}
      className={`p-6 cursor-pointer relative hover:bg-green-50 transition-colors ${
        farmer.status === 'active' 
          ? 'border-2 border-green-500' 
          : 'border-2 border-red-500'
      }`}
      role="button"
      tabIndex={0}
    >
      <h2 className="text-2xl font-semibold mb-4 flex items-center">
        <StatusIndicator status={farmer.status} />
        {farmer.name}
      </h2>
      <FarmerInfo farmer={farmer} />
      <ToggleButton isExpanded={isExpanded} />
    </div>
    
    {isExpanded && (
      <ProductList products={products} farmerId={farmer.id} />
    )}
  </div>
);

const StatusIndicator: React.FC<{ status: Farmer['status'] }> = ({ status }) => (
  <span className={`mr-3 ${status === 'active' ? 'text-green-500' : 'text-red-500'}`}>
    ●
  </span>
);

const FarmerInfo: React.FC<{ farmer: Farmer }> = ({ farmer }) => (
  <>
    <p className="text-gray-600">
      <span className="font-medium">Phone:</span> {farmer.phone}
    </p>
    <p className="text-gray-600 mt-2">
      <span className="font-medium">Location:</span> {farmer.location}
    </p>
  </>
);

const ToggleButton: React.FC<{ isExpanded: boolean }> = ({ isExpanded }) => (
  <span className="absolute bottom-4 right-4 text-blue-500 hover:underline">
    {isExpanded ? 'Hide Products' : 'Show Products'}
    <ChevronIcon isExpanded={isExpanded} />
  </span>
);

const ChevronIcon: React.FC<{ isExpanded: boolean }> = ({ isExpanded }) => (
  <svg
    className={`w-6 h-6 ml-2 inline-block ${
      isExpanded ? 'transform rotate-180' : ''
    }`}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path
      fillRule="evenodd"
      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

const ProductList: React.FC<{ products: FarmerProduct[]; farmerId: string }> = ({ 
  products,
  farmerId 
}) => (
  <div className="p-4 bg-gray-50 border-t border-gray-200">
    {products.length === 0 ? (
      <div className="text-center text-gray-500">
        No products found for this farmer
      </div>
    ) : (
      <ul className="space-y-2">
        {products.map(product => (
          <ProductItem key={`${farmerId}-${product.id}`} product={product} />
        ))}
      </ul>
    )}
  </div>
);

const ProductItem: React.FC<{ product: FarmerProduct }> = ({ product }) => (
  <li className="flex items-center p-3 bg-white rounded-md shadow-sm hover:bg-gray-100 transition">
    <div className="flex-grow">
      <strong className="text-lg text-gray-900">{product.product.name}</strong>
      <p className="text-sm text-gray-600">
        Warehouse: {product.warehouse.name}
      </p>
      <p className="text-xs text-gray-500">
        Added: {formatDate(product.addedAt)}
      </p>
    </div>
    <span className="text-gray-700">QTY: {product.quantityAvailable}</span>
  </li>
);

export default FarmersList;