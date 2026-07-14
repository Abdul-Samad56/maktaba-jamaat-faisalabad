import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  deleteAdminProduct,
  fetchAdminFilters,
  fetchAdminProducts,
  fetchAdminStats,
  runBilingualTitlesFix,
  runStockDiscountFix,
} from "./adminApi";
import { formatPrice, imageUrl } from "../api";
import { fullTitle, titleEn, titleUr } from "../bilingual";
import AdminFilters from "./AdminFilters";

const EMPTY_FILTERS = {
  source: "",
  author: "",
  publisher: "",
  category: "",
  language: "",
  minPrice: "",
  maxPrice: "",
  available: "",
  onSale: "",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [data, setData] = useState(null);
  const [filterOptions, setFilterOptions] = useState(null);
  const [query, setQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [draftFilters, setDraftFilters] = useState(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fixMsg, setFixMsg] = useState("");
  const [fixing, setFixing] = useState(false);
  const [bilingualFixing, setBilingualFixing] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [statsRes, productsRes] = await Promise.all([
        fetchAdminStats(),
        fetchAdminProducts({
          page,
          limit: 20,
          search: query,
          ...appliedFilters,
        }),
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
    fetchAdminFilters().then(setFilterOptions).catch(() => {});
  }, []);

  useEffect(() => {
    load();
  }, [page, query, appliedFilters]);

  const onSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setQuery(searchInput.trim());
  };

  const onApplyFilters = () => {
    setPage(1);
    setAppliedFilters({ ...draftFilters });
  };

  const onClearFilters = () => {
    setDraftFilters(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
    setPage(1);
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

  const onFixStockDiscount = async () => {
    if (
      !confirm(
        "تمام کتابیں In Stock کریں گے اور ہر ڈسکاؤنٹ سے 10% کم کریں گے (مثلاً 50% → 40%)۔ جاری رکھیں؟"
      )
    ) {
      return;
    }
    setFixing(true);
    setFixMsg("");
    try {
      const r = await runStockDiscountFix();
      setFixMsg(
        `Done: ${r.availableModified} stock updated, ${r.discountUpdated} discounts reduced (−10%), ${r.saleCleared} sales cleared.`
      );
      load();
    } catch (err) {
      setFixMsg(err.message);
    } finally {
      setFixing(false);
    }
  };

  const onFixBilingual = async () => {
    if (
      !confirm(
        "تمام کتابوں کے عنوان اردو/انگلش میں الگ کریں گے اور سرچ انڈیکس بنائیں گے۔ جاری رکھیں؟"
      )
    ) {
      return;
    }
    setBilingualFixing(true);
    setFixMsg("");
    try {
      const r = await runBilingualTitlesFix();
      setFixMsg(`Bilingual titles: scanned ${r.scanned}, updated ${r.updated}.`);
      load();
    } catch (err) {
      setFixMsg(err.message);
    } finally {
      setBilingualFixing(false);
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-topbar">
        <h1>Books Management</h1>
        <div className="admin-topbar-actions">
          <button
            type="button"
            className="admin-btn"
            disabled={bilingualFixing}
            onClick={onFixBilingual}
          >
            {bilingualFixing ? "Updating titles..." : "Fix Urdu/English titles"}
          </button>
          <button
            type="button"
            className="admin-btn"
            disabled={fixing}
            onClick={onFixStockDiscount}
          >
            {fixing ? "Updating..." : "Fix stock + −10% discount"}
          </button>
          <Link to="/admin/products/new" className="admin-btn admin-btn-primary">
            + Add Book
          </Link>
        </div>
      </div>

      {fixMsg && <p className="admin-muted">{fixMsg}</p>}

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

      <div className="admin-layout">
        <AdminFilters
          filters={filterOptions}
          values={draftFilters}
          onChange={setDraftFilters}
          onApply={onApplyFilters}
          onClear={onClearFilters}
        />

        <div className="admin-main-col">
          <form className="admin-search" onSubmit={onSearch}>
            <input
              type="search"
              placeholder="Search by title, author, publisher..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit" className="admin-btn">
              Search
            </button>
          </form>

          {error && <p className="admin-error">{error}</p>}
          {loading && <p className="admin-muted">Loading...</p>}

          {!loading && data && (
            <p className="admin-muted">{data.total} books found</p>
          )}

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
                      <th>Publisher</th>
                      <th>Source</th>
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
                        <td className="admin-title-cell">
                          <div>{titleEn(p) || fullTitle(p)}</div>
                          {titleUr(p) && titleUr(p) !== titleEn(p) && (
                            <div className="admin-title-ur" lang="ur" dir="rtl">
                              {titleUr(p)}
                            </div>
                          )}
                        </td>
                        <td>{p.author || "—"}</td>
                        <td>{p.publisher || "—"}</td>
                        <td>{p.source || "—"}</td>
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
      </div>
    </div>
  );
}
