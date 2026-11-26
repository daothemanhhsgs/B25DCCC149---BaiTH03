import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { useAppDispatch } from '../app/hooks';
import { addToCart } from '../features/cart/cartSlice';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    dispatch(addToCart({ product, quantity: 1 }));
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1100);
  };

  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`} className="product-thumb-wrap">
        <img
          src={product.image}
          alt={product.title}
          className="product-thumb"
          loading="lazy"
        />
      </Link>

      <div className="product-body">
        <span className="product-category">{product.category}</span>

        <h3 className="product-title">
          <Link to={`/products/${product.id}`}>{product.title}</Link>
        </h3>

        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>

          <button
            type="button"
            onClick={handleAdd}
            className={`btn btn-sm ${justAdded ? 'btn-success' : 'btn-primary'}`}
          >
            {justAdded ? '✓ Đã thêm' : '+ Thêm giỏ'}
          </button>
        </div>
      </div>
    </article>
  );
}