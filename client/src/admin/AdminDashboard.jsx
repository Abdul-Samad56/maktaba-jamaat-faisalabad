import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteAdminProduct, fetchAdminProducts, fetchAdminStats } from "./adminApi";
import { formatPrice, imageUrl } from "../api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [data, setData] = useState(null);
  const [query, setQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [statsRes, productsRes] = await Promise.all([
        fetchAdminStats(),
        fetchAdminProducts({ page, limit: 20, search: query }),
      ]);
      setStats(statsRes);
      setData(productsRes);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page, query]);

  const onSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setQuery(searchInput.trim());
  };

  const onDelete = async (product) => {
    if (!confirm(`Delete "${product.title}"?`)) return;
    try {
      await deleteAdminProduct(product._id);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-topbar">
        <h1>Books Management</h1>
        <Link to="/admin/products/new" className="admin-btn admin-btn-primary">
          + Add Book
        </Link>
      </div>

      {stats && (
        <div className="admin-stats">
          <div className="admin-stat">
            <strong>{stats.total}</strong>
            <span>Total</span>
          </div>
          <div className="admin-stat">
            <strong>{stats.available}</strong>
            <span>In Stock</span>
          </div>
          <div className="admin-stat">
            <strong>{stats.onSale}</strong>
            <span>On Sale</span>
          </div>
        </div>
      )}

      <form className="admin-search" onSubmit={onSearch}>
        <input
          type="search"
          placeholder="Search by title, author, description..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button type="submit" className="admin-btn">
          Search
        </button>
      </form>

      {error && <p className="admin-error">{error}</p>}
      {loading && <p className="admin-muted">Loading...</p>}

      {!loading && data?.items?.length === 0 && (
        <p className="admin-muted">No books found.</p>
      )}

      {!loading && data?.items?.length > 0 && (
        <>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Cover</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <img src={imageUrl(p)} alt="" className="admin-thumb" />
                    </td>
                    <td className="admin-title-cell">{p.title}</td>
                    <td>{p.author || "—"}</td>
                    <td>{p.category || "—"}</td>
                    <td>{formatPrice(p.price)}</td>
                    <td>
                      {p.available ? (
                        <span className="admin-badge ok">In stock</span>
                      ) : (
                        <span className="admin-badge no">Sold out</span>
                      )}
                    </td>
                    <td className="admin-actions">
                      <Link to={`/admin/products/${p._id}`} className="admin-btn admin-btn-sm">
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="admin-btn admin-btn-sm admin-btn-danger"
                        onClick={() => onDelete(p)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data.pages > 1 && (
            <div className="admin-pagination">
              <button
                type="button"
                className="admin-btn"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </button>
              <span>
                Page {data.page} / {data.pages}
              </span>
              <button
                type="button"
                className="admin-btn"
                disabled={page >= data.pages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
