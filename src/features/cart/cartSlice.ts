import { createSelector, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CartItem, Product } from '../../types';
import type { RootState } from '../../app/store';

const CART_STORAGE_KEY = 'shopmini_cart_items';

interface CartState {
  items: CartItem[];
}

interface AddToCartPayload {
  product: Product;
  quantity?: number;
}

interface UpdateQuantityPayload {
  productId: number;
  quantity: number;
}

const loadInitialCart = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (entry): entry is CartItem =>
        typeof entry === 'object' &&
        entry !== null &&
        'product' in entry &&
        'quantity' in entry &&
        typeof (entry as CartItem).quantity === 'number'
    );
  } catch {
    return [];
  }
};

const initialState: CartState = {
  items: loadInitialCart(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<AddToCartPayload>) => {
      const { product, quantity = 1 } = action.payload;
      const safeQty = Math.max(1, Math.floor(quantity));
      const existingItem = state.items.find((item) => item.product.id === product.id);

      if (existingItem) {
        existingItem.quantity += safeQty;
      } else {
        state.items.push({ product, quantity: safeQty });
      }
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.product.id !== action.payload);
    },

    updateQuantity: (state, action: PayloadAction<UpdateQuantityPayload>) => {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter((item) => item.product.id !== productId);
        return;
      }
      const target = state.items.find((item) => item.product.id === productId);
      if (target) {
        target.quantity = Math.floor(quantity);
      }
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

export const selectCartItems = (state: RootState): CartItem[] => state.cart.items;

export const selectTotalCartQuantity = createSelector([selectCartItems], (items): number =>
  items.reduce((sum, item) => sum + item.quantity, 0)
);

export const selectTotalCartAmount = createSelector([selectCartItems], (items): number =>
  items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
);

export default cartSlice.reducer;