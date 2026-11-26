import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useAppSelector } from '../app/hooks';
import { selectTotalCartQuantity } from '../features/cart/cartSlice';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const totalCartQuantity = useAppSelector(selectTotalCartQuantity);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand-logo">
          <span className="brand-mark">SM</span>
          <span>ShopMini</span>
        </Link>

        <nav className="header-nav" aria-label="Điều hướng chính">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Sản phẩm
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) =>
              isActive ? 'nav-link cart-link active' : 'nav-link cart-link'
            }
          >
            <span>Giỏ hàng</span>
            <span className="cart-badge" aria-label={`Có ${totalCartQuantity} sản phẩm trong giỏ`}>
              {totalCartQuantity}
            </span>
          </NavLink>

          <button
            type="button"
            onClick={toggleTheme}
            className="btn-icon"
            title={theme === 'light' ? 'Chuyển sang giao diện tối' : 'Chuyển sang giao diện sáng'}
          >
            {theme === 'light' ? '🌙 Tối' : '☀️ Sáng'}
          </button>

          {user ? (
            <div className="user-controls">
              <span className="user-pill" title="Tài khoản đang đăng nhập">
                👤 {user.displayName}
              </span>
              <button type="button" onClick={handleLogout} className="btn btn-outline btn-sm">
                Đăng xuất
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              Đăng nhập
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}