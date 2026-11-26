import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  clearCart,
  removeFromCart,
  selectCartItems,
  selectTotalCartAmount,
  selectTotalCartQuantity,
  updateQuantity,
} from '../features/cart/cartSlice';

export function CartPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const cartItems = useAppSelector(selectCartItems);
  const totalQuantity = useAppSelector(selectTotalCartQuantity);
  const totalAmount = useAppSelector(selectTotalCartAmount);

  if (cartItems.length === 0) {
    return (
      <section className="state-box">
        <h1>Giỏ hàng của bạn đang trống</h1>
        <p className="muted-text">Hãy chọn thêm sản phẩm từ trang chủ để bắt đầu mua sắm.</p>
        <Link to="/" className="btn btn-primary">
          Khám phá sản phẩm
        </Link>
      </section>
    );
  }

  return (
    <section className="cart-section">
      <div className="section-header-row">
        <h1>Giỏ hàng ({totalQuantity} sản phẩm)</h1>
        <button
          type="button"
          onClick={() => dispatch(clearCart())}
          className="btn btn-danger-outline btn-sm"
        >
          Xoá toàn bộ giỏ hàng
        </button>
      </div>

      <div className="cart-layout">
        <div className="cart-list">
          {cartItems.map(({ product, quantity }) => (
            <article key={product.id} className="cart-item-card">
              <Link to={`/products/${product.id}`} className="cart-item-thumb">
                <img src={product.image} alt={product.title} />
              </Link>

              <div className="cart-item-info">
                <Link to={`/products/${product.id}`} className="cart-item-title">
                  {product.title}
                </Link>
                <span className="muted-text">Đơn giá: ${product.price.toFixed(2)}</span>

                <div className="cart-item-controls">
                  <div className="qty-stepper">
                    <button
                      type="button"
                      onClick={() =>
                        dispatch(
                          updateQuantity({ productId: product.id, quantity: quantity - 1 })
                        )
                      }
                      aria-label="Giảm số lượng"
                    >
                      −
                    </button>
                    <span>{quantity}</span>
                    <button
                      type="button"
                      onClick={() =>
                        dispatch(
                          updateQuantity({ productId: product.id, quantity: quantity + 1 })
                        )
                      }
                      aria-label="Tăng số lượng"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => dispatch(removeFromCart(product.id))}
                    className="btn-link-danger"
                  >
                    Xoá
                  </button>
                </div>
              </div>

              <div className="cart-item-subtotal">
                ${(product.price * quantity).toFixed(2)}
              </div>
            </article>
          ))}
        </div>

        <aside className="summary-card">
          <h2>Tóm tắt đơn hàng</h2>

          <div className="summary-row">
            <span>Tổng số lượng:</span>
            <strong>{totalQuantity} sản phẩm</strong>
          </div>

          <div className="summary-row">
            <span>Phí vận chuyển:</span>
            <strong>Miễn phí</strong>
          </div>

          <div className="summary-divider" />

          <div className="summary-row total">
            <span>Tổng thanh toán:</span>
            <strong>${totalAmount.toFixed(2)}</strong>
          </div>

          <button
            type="button"
            onClick={() => navigate('/checkout')}
            className="btn btn-primary btn-block"
          >
            Tiến hành thanh toán
          </button>

          <Link to="/" className="btn btn-outline btn-block">
            Tiếp tục mua sắm
          </Link>
        </aside>
      </div>
    </section>
  );
}