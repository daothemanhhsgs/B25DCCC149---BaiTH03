import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  clearCart,
  selectCartItems,
  selectTotalCartAmount,
  selectTotalCartQuantity,
} from '../features/cart/cartSlice';

export function CheckoutPage() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();

  const cartItems = useAppSelector(selectCartItems);
  const totalQuantity = useAppSelector(selectTotalCartQuantity);
  const totalAmount = useAppSelector(selectTotalCartAmount);

  const [receiverName, setReceiverName] = useState(user?.displayName ?? '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [formError, setFormError] = useState('');
  const [orderCompleted, setOrderCompleted] = useState(false);

  const handlePlaceOrder = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');

    if (!receiverName.trim() || !phone.trim() || !address.trim()) {
      setFormError('Vui lòng điền đầy đủ họ tên, số điện thoại và địa chỉ nhận hàng.');
      return;
    }

    dispatch(clearCart());
    setOrderCompleted(true);
  };

  if (orderCompleted) {
    return (
      <section className="state-box success-box" role="status">
        <div className="success-badge">✓</div>
        <h1>Đặt hàng thành công!</h1>
        <p>
          Cảm ơn <strong>{receiverName}</strong> đã mua sắm tại ShopMini. Giỏ hàng của bạn
          đã được làm mới và đơn hàng đang được xử lý.
        </p>
        <Link to="/" className="btn btn-primary">
          Tiếp tục mua sắm
        </Link>
      </section>
    );
  }

  if (cartItems.length === 0) {
    return (
      <section className="state-box">
        <h1>Không có sản phẩm để thanh toán</h1>
        <p className="muted-text">Giỏ hàng của bạn hiện đang trống.</p>
        <Link to="/" className="btn btn-primary">
          Quay về trang chủ
        </Link>
      </section>
    );
  }

  return (
    <section className="checkout-section">
      <h1>Thanh toán đơn hàng</h1>

      <div className="cart-layout">
        <form onSubmit={handlePlaceOrder} className="checkout-form-card" noValidate>
          <h2>Thông tin giao hàng</h2>

          {formError && (
            <div className="alert-error" role="alert">
              {formError}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="receiverName">Họ và tên người nhận</label>
            <input
              id="receiverName"
              type="text"
              value={receiverName}
              onChange={(e) => setReceiverName(e.target.value)}
              className="input-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Số điện thoại</label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0912345678"
              className="input-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Địa chỉ nhận hàng</label>
            <textarea
              id="address"
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
              className="input-control"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Đặt hàng (${totalAmount.toFixed(2)})
          </button>
        </form>

        <aside className="summary-card">
          <h2>Đơn hàng ({totalQuantity} món)</h2>

          <ul className="checkout-item-list">
            {cartItems.map(({ product, quantity }) => (
              <li key={product.id} className="checkout-item-row">
                <span className="checkout-item-name">
                  {product.title} <strong>×{quantity}</strong>
                </span>
                <span>${(product.price * quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>

          <div className="summary-divider" />

          <div className="summary-row total">
            <span>Tổng cộng:</span>
            <strong>${totalAmount.toFixed(2)}</strong>
          </div>
        </aside>
      </div>
    </section>
  );
}