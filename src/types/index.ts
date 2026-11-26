export interface ProductRating {
  rate: number;
  count: number;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: ProductRating;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  username: string;
  displayName: string;
}

export type ThemeMode = 'light' | 'dark';

export type LoadingStatus = 'idle' | 'loading' | 'succeeded' | 'failed';