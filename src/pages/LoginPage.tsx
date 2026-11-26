import { useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface LocationState {
  from?: {
    pathname?: string;
  };
}

export function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as LocationState | null;
  const redirectPath = state?.from?.pathname || '/';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (user) {
    return <Navigate to={redirectPath} replace />;
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim()) {
      setErrorMessage('Vui lòng nhập tên đăng nhập.');
      return;
    }

    const isSuccess = login(username, password);
    if (!isSuccess) {
      setErrorMessage('Sai mật khẩu. Gợi ý mật khẩu mặc định là 123456.');
      return;
    }

    navigate(redirectPath, { replace: true });
  };

  return (
    <section className="auth-wrapper">
      <form onSubmit={handleSubmit} className="auth-card" noValidate>
        <h1>Đăng nhập ShopMini</h1>
        <p className="muted-text">
          Đăng nhập để tiếp tục thanh toán và quản lý đơn hàng của bạn.
        </p>

        {errorMessage && (
          <div className="alert-error" role="alert">
            {errorMessage}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="username">Tên đăng nhập</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Ví dụ: sinhvien_ptit"
            className="input-control"
            autoComplete="username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Mật khẩu</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nhập 123456"
            className="input-control"
            autoComplete="current-password"
          />
        </div>

        <button type="submit" className="btn btn-primary btn-block">
          Đăng nhập
        </button>

        <div className="demo-hint">
          Tài khoản demo: tên bất kỳ · Mật khẩu: <code>123456</code>
        </div>
      </form>
    </section>
  );
}