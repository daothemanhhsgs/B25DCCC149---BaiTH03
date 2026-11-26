import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="state-box">
      <p className="code-404">404</p>
      <h1>Không tìm thấy trang</h1>
      <p className="muted-text">
        Đường dẫn bạn truy cập không tồn tại hoặc đã bị thay đổi.
      </p>
      <Link to="/" className="btn btn-primary">
        Về trang chủ ShopMini
      </Link>
    </section>
  );
}