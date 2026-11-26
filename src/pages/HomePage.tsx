import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  fetchProducts,
  selectAllProducts,
  selectProductsError,
  selectProductsStatus,
} from '../features/products/productsSlice';
import { ProductCard } from '../components/ProductCard';

export function HomePage() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectAllProducts);
  const status = useAppSelector(selectProductsStatus);
  const error = useAppSelector(selectProductsError);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    if (status === 'idle') {
      void dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map((p) => p.category)));
    return ['all', ...unique];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchKeyword.trim().toLowerCase();
    return products.filter((product) => {
      const matchCategory =
        selectedCategory === 'all' || product.category === selectedCategory;
      const matchTitle =
        normalizedQuery === '' ||
        product.title.toLowerCase().includes(normalizedQuery);
      return matchCategory && matchTitle;
    });
  }, [products, searchKeyword, selectedCategory]);

  return (
    <section className="home-section">
      <div className="toolbar-card">
        <div className="toolbar-heading">
          <h1>Danh mục sản phẩm</h1>
          <p className="muted-text">
            Hiển thị {filteredProducts.length} / {products.length} sản phẩm
          </p>
        </div>

        <div className="search-box-wrap">
          <input
            type="search"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Tìm kiếm theo tên sản phẩm..."
            className="input-control search-input"
            aria-label="Tìm kiếm theo tên sản phẩm"
          />
          {searchKeyword && (
            <button
              type="button"
              onClick={() => setSearchKeyword('')}
              className="btn btn-outline btn-sm"
            >
              Xoá
            </button>
          )}
        </div>

        {categories.length > 1 && (
          <div className="category-pills" role="tablist" aria-label="Lọc danh mục">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`pill-btn ${selectedCategory === cat ? 'active' : ''}`}
              >
                {cat === 'all' ? 'Tất cả' : cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {status === 'loading' && (
        <div className="product-grid" aria-busy="true">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="skeleton-card">
              <div className="skeleton-img" />
              <div className="skeleton-line short" />
              <div className="skeleton-line" />
              <div className="skeleton-line medium" />
            </div>
          ))}
        </div>
      )}

      {status === 'failed' && (
        <div className="state-box error-box">
          <h2>Không thể tải danh sách sản phẩm</h2>
          <p>{error}</p>
          <button
            type="button"
            onClick={() => void dispatch(fetchProducts())}
            className="btn btn-primary"
          >
            Thử tải lại
          </button>
        </div>
      )}

      {status === 'succeeded' && filteredProducts.length === 0 && (
        <div className="state-box">
          <h2>Không tìm thấy sản phẩm phù hợp</h2>
          <p className="muted-text">
            Thử đổi từ khóa tìm kiếm hoặc chọn lại danh mục &ldquo;Tất cả&rdquo;.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchKeyword('');
              setSelectedCategory('all');
            }}
            className="btn btn-outline"
          >
            Đặt lại bộ lọc
          </button>
        </div>
      )}

      {status === 'succeeded' && filteredProducts.length > 0 && (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}