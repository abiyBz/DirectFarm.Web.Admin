// src/features/productsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Product {
    id: string;
    name: string;
    description: string;
    category: string;
    pricePerUnit: number;
    unit: string;
    createdAt: string;
    status: string;
    image?: string;
    nameAmharic: string;
    descriptionAmharic: string;
  }

interface ProductsState {
  items: Product[] | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProductsState = {
  items: null,
  status: 'idle',
  error: null,
};

// Async thunk to fetch products and their images
export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await axios.get<Product[]>(`http://localhost:5122/api/Product/GetAvailableProducts`);
  
  const productsWithImages = await Promise.all(response.data.data.map(async (product) => {
    try {
      const imageResponse = await axios.post(`http://localhost:5122/api/Product/GetProductImage`, { id: product.id });
      return {
        ...product,
        image: `data:image/jpg;base64,${imageResponse.data.data}`,
        createdAt: new Date(product.createdAt).toISOString(), // Convert to ISO string if needed
      };
    } catch (imageError) {
      console.error("Image fetch error:", imageError);
      return { ...product, image: null }; // Return product with no image
    }
  }));

  return productsWithImages; // Return the array of products with images
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload; // Set fetched products
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export default productsSlice.reducer;
