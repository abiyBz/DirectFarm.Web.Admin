import React, { useState } from 'react';
import axios from 'axios';
import './ProductForm.css'; // Import your CSS file

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
    id: '00000000-0000-0000-0000-000000000000', // Default ID
    name: '',
    description: '',
    category: '',
    pricePerUnit: 0,
    unit: '',
    createdAt: '', // Initially empty, will be set on submit
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
      setImageFile(e.target.files[0]); // Get the first file selected
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
    <form onSubmit={handleSubmit}>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={product.name}
          onChange={handleChange}
          placeholder="Enter product name"
          required
        />
      </div>

      <div>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={product.description}
          onChange={handleChange}
          placeholder="Enter product description"
          required
        />
      </div>

      <div>
        <label htmlFor="category">Category:</label>
        <select
          id="category"
          name="category"
          value={product.category}
          onChange={handleChange}
          required
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.en} / {cat.am} {/* Display both English and Amharic */}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="pricePerUnit">Price Per Unit:</label>
        <input
          type="number"
          id="pricePerUnit"
          name="pricePerUnit"
          value={product.pricePerUnit}
          onChange={handleChange}
          placeholder="Enter price per unit"
          required
        />
      </div>

      <div>
        <label htmlFor="unit">Unit:</label>
        <input
          type="text"
          id="unit"
          name="unit"
          value={product.unit}
          onChange={handleChange}
          placeholder="Enter unit of measurement (e.g., kg, pcs)"
          required
        />
      </div>

      <div>
        <label htmlFor="status">Status:</label>
        <input
          type="text"
          id="status"
          name="status"
          value={product.status}
          onChange={handleChange}
          placeholder="Enter product status (e.g., available, out of stock)"
        />
      </div>

      <div>
        <label htmlFor="nameAmharic">Name (Amharic):</label>
        <input
          type="text"
          id="nameAmharic"
          name="nameAmharic"
          value={product.nameAmharic}
          onChange={handleChange}
          placeholder="Enter product name in Amharic"
        />
      </div>

      <div>
        <label htmlFor="descriptionAmharic">Description (Amharic):</label>
        <textarea
          id="descriptionAmharic"
          name="descriptionAmharic"
          value={product.descriptionAmharic}
          onChange={handleChange}
          placeholder="Enter product description in Amharic"
        />
      </div>

      {/* File input for the image */}
      <div>
        <label htmlFor="image">Upload Image:</label>
        <input
          type="file"
          id="image"
          accept="image/*" // Accepts only image files
          onChange={handleFileChange}
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Submit'}
      </button>
    </form>
  );
};

export default ProductForm;
