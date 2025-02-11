import React, { useState } from 'react';
import axios from 'axios';

interface Product {
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
}

// Define the categories structure
const categories = [
  { en: "Vegetables", am: "አትክልት" },
  { en: "Fruits", am: "ፍራፍሬ" },
  { en: "Dairy Products", am: "የእንስሳት ምርቶች" },
  { en: "Grains", am: "እህል" },
  { en: "Meat", am: "ሥጋ" },
  { en: "Legumes", am: "አተርና አተር ዝርያዎች" },
  { en: "Oilseeds", am: "ዘይት እህል" }
];

const ProductForm: React.FC = () => {
  const [product, setProduct] = useState<Product>({
    id: '00000000-0000-0000-0000-000000000000',
    name: '',
    description: '',
    category: '',
    pricePerUnit: 0,
    unit: '',
    createdAt: '',
    status: '',
    nameAmharic: '',
    descriptionAmharic: ''
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Set createdAt to the current timestamp in ISO format
    const currentTimestamp = new Date().toISOString();
    
    try {
      // Update createdAt in product state
      const productToSubmit = { ...product, createdAt: currentTimestamp };

      // Step 1: Save the product
      const saveProductResponse = await axios.post('http://localhost:5122/api/Product/SaveProduct', productToSubmit);
      
      const newProductId = saveProductResponse.data.data.id; // Assuming the response contains the new product ID

      console.log('New Product ID:', newProductId); // Log new product ID for debugging

      // Step 2: Convert image file to Base64 and prepare data for saving image
      if (!imageFile) {
        throw new Error('Image file is required.');
      }

      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      
      reader.onloadend = async () => {
        // Get Base64 encoded string
        const base64String = reader.result as string;

        // Prepare data for saving image
        const imageData = {
          id: newProductId,
          fileName: imageFile.name,
          image: base64String.split(',')[1] // Extract only the Base64 part (after the comma)
        };

        console.log('Image Data:', imageData); // Log image data for debugging

        // Step 3: Save the image using the provided API
        await axios.post('http://localhost:5122/api/Product/SaveProductImage', imageData);

        alert('Product Saved ');
      };
      
      reader.onerror = () => {
        throw new Error('Failed to convert image to Base64.');
      };
      
    } catch (error) {
      console.error('Error saving product or image:', error);

      // Type guard to check if error is AxiosError
      if (axios.isAxiosError(error)) {
        setError(error.response ? error.response.data : 'An error occurred while saving.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gradient-to-br from-indigo-200 to-purple-200">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Add New Product</h1>
      
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {error && <div className="text-red-500 text-xs italic mb-4">{error}</div>}
        
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
            Name:
          </label>
          <input 
            type="text"
            id="name"
            name="name"
            value={product.name}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter product name"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
            Description:
          </label>
          <textarea 
            id="description"
            name="description"
            value={product.description}
            onChange={handleChange}
            className="shadow form-textarea mt-1 block w-full border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter product description"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">
            Category:
          </label>
          <select 
            id="category"
            name="category"
            value={product.category}
            onChange={handleChange}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat, index) => (
              <option key={index} value={index}>
                {cat.en} / {cat.am}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="pricePerUnit" className="block text-gray-700 text-sm font-bold mb-2">
            Price Per Unit:
          </label>
          <input 
            type="number"
            id="pricePerUnit"
            name="pricePerUnit"
            value={product.pricePerUnit}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter price per unit"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="unit" className="block text-gray-700 text-sm font-bold mb-2">
            Unit:
          </label>
          <input 
            type="text"
            id="unit"
            name="unit"
            value={product.unit}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter unit of measurement (e.g., kg, pcs)"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">
            Status:
          </label>
          <input 
            type="text"
            id="status"
            name="status"
            value={product.status}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter product status (e.g., available, out of stock)"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="nameAmharic" className="block text-gray-700 text-sm font-bold mb-2">
            Name (Amharic):
          </label>
          <input 
            type="text"
            id="nameAmharic"
            name="nameAmharic"
            value={product.nameAmharic}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter product name in Amharic"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="descriptionAmharic" className="block text-gray-700 text-sm font-bold mb-2">
            Description (Amharic):
          </label>
          <textarea 
            id="descriptionAmharic"
            name="descriptionAmharic"
            value={product.descriptionAmharic}
            onChange={handleChange}
            className="shadow form-textarea mt-1 block w-full border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter product description in Amharic"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">
            Upload Image:
          </label>
          <input 
            type="file"
            id="image"
            accept="image/*"
            onChange={handleFileChange}
            className="form-input w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="flex items-center justify-center">
          <button 
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {loading ? 'Saving...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;