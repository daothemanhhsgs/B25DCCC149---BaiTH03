import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { LoadingStatus, Product } from '../../types';
import type { RootState } from '../../app/store';

interface ProductsState {
  items: Product[];
  status: LoadingStatus;
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>('products/fetchProducts', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    if (!response.ok) {
      return rejectWithValue(`Lỗi máy chủ (${response.status})`);
    }
    const data = (await response.json()) as Product[];
    return data;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Không thể kết nối tới máy chủ sản phẩm';
    return rejectWithValue(message);
  }
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Đã xảy ra lỗi không xác định';
      });
  },
});

export const selectAllProducts = (state: RootState): Product[] => state.products.items;
export const selectProductsStatus = (state: RootState): LoadingStatus => state.products.status;
export const selectProductsError = (state: RootState): string | null => state.products.error;
export const selectProductById = (state: RootState, id: number): Product | undefined =>
  state.products.items.find((item) => item.id === id);

export default productsSlice.reducer;