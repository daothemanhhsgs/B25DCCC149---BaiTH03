import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';

export function MainLayout() {
  return (
    <div className="app-shell">
      <Header />
      <main className="main-content">
        <div className="container">
          <Outlet />
        </div>
      </main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <span>ShopMini Storefront — Bài tập thực hành 03 (RIPT1306)</span>
          <span>React + TypeScript + Redux Toolkit + Context API</span>
        </div>
      </footer>
    </div>
  );
}