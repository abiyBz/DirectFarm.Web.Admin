// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; // Import the auth reducer
import productsReducer from './productsSlice';

// Configure the Redux store
const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer, // Combine reducers; here we have only auth
  },
  // Optional: middleware can be added here if needed
});

// Define RootState type based on the store's state shape
export type RootState = ReturnType<typeof store.getState>;

// Define AppDispatch type for dispatching actions
export type AppDispatch = typeof store.dispatch;

// Export the configured store
export default store;
