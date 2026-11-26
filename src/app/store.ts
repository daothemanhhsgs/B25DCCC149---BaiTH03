import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../features/products/productsSlice';
import cartReducer from '../features/cart/cartSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
  },
});

store.subscribe(() => {
  try {
    const cartItems = store.getState().cart.items;
    localStorage.setItem('shopmini_cart_items', JSON.stringify(cartItems));
  } catch {
    // Bỏ qua nếu trình duyệt chặn localStorage
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;