import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  fetchProducts,
  selectProductById,
  selectProductsStatus,
} from '../features/products/productsSlice';
import { addToCart } from '../features/cart/cartSlice';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const status = useAppSelector(selectProductsStatus);
  const product = useAppSelector((state) =>
    Number.isFinite(productId) ? selectProductById(state, productId) : undefined
  );

  const [quantity, setQuantity] = useState<number>(1);
  const [addedNotice, setAddedNotice] = useState(false);

  useEffect(() => {
    if (status === 'idle') {
      void dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  if (status === 'loading') {
    return (
      <div className="state-box">
        <p>Đang tải thông tin chi tiết sản phẩm...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="state-box">
        <h2>Không tìm thấy sản phẩm</h2>
        <p className="muted-text">Sản phẩm không tồn tại hoặc đường dẫn không hợp lệ.</p>
        <Link to="/" className="btn btn-primary">
          ← Quay về trang chủ
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
    setAddedNotice(true);
    window.setTimeout(() => setAddedNotice(false), 1500);
  };

  const handleBuyNow = () => {
    dispatch(addToCart({ product, quantity }));
    navigate('/cart');
  };

  return (
    <section className="detail-section">
      <Link to="/" className="back-link">
        ← Quay lại danh sách sản phẩm
      </Link>

      <div className="detail-card">
        <div className="detail-image-box">
          <img src={product.image} alt={product.title} className="detail-image" />
        </div>

        <div className="detail-info">
          <span className="product-category">{product.category}</span>
          <h1 className="detail-title">{product.title}</h1>

          {product.rating && (
            <p className="detail-rating">
              ⭐ {product.rating.rate} / 5 ({product.rating.count} đánh giá)
            </p>
          )}

          <p className="detail-price">${product.price.toFixed(2)}</p>
          <p className="detail-desc">{product.description}</p>

          <div className="detail-actions">
            <div className="qty-stepper">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Giảm số lượng"
              >
                −
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Tăng số lượng"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className={`btn ${addedNotice ? 'btn-success' : 'btn-outline'}`}
            >
              {addedNotice ? '✓ Đã thêm vào giỏ' : 'Thêm vào giỏ hàng'}
            </button>

            <button type="button" onClick={handleBuyNow} className="btn btn-primary">
              Mua ngay
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}