import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchFilters, fetchProducts } from "../api";
import Pagination from "../components/Pagination";
import ProductCard from "../components/ProductCard";
import Sidebar from "../components/Sidebar";

const CATEGORY_LABELS = {
  all: "All Books",
  quran: "Quran",
  tafseer: "Tafseer",
  hadith: "Hadith",
  seerat: "Seerat un Nabi",
  "dars-e-nizami": "Dars e Nizami",
};

function ProductSkeleton() {
  return (
    <div className="product-card skeleton-card">
      <div className="skeleton-image" />
      <div className="skeleton-line" />
      <div className="skeleton-line short" />
      <div className="skeleton-line price" />
    </div>
  );
}

export default function HomePage() {
  const [params, setParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [filters, setFilters] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const productsRef = useRef(null);

  const category = params.get("category") || "all";
  const page = Number(params.get("page") || 1);
  const sort = params.get("sort") || "featured";
  const search = params.get("search") || "";

  const query = {
    page,
    limit: 24,
    category,
    sort,
    search,
    author: params.get("author") || "",
    publisher: params.get("publisher") || "",
    source: params.get("source") || "",
    language: params.get("language") || "",
    minPrice: params.get("minPrice") || "",
    maxPrice: params.get("maxPrice") || "",
    available: params.get("available") || "",
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await fetchProducts(query);
      setData(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(query)]);

  useEffect(() => {
    fetchFilters().then(setFilters).catch(() => {});
  }, []);

  useEffect(() => {
    setDraft({
      author: query.author,
      publisher: query.publisher,
      source: query.source,
      language: query.language,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      available: query.available,
    });
    setShowFilters(false);
    load();
  }, [load]);

  useEffect(() => {
    document.body.style.overflow = showFilters ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showFilters]);

  const applyFilters = () => {
    const next = new URLSearchParams(params);
    ["author", "publisher", "source", "language", "minPrice", "maxPrice", "available"].forEach(
      (k) => {
        if (draft[k]) next.set(k, draft[k]);
        else next.delete(k);
      }
    );
    next.delete("page");
    setParams(next);
    setShowFilters(false);
    document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const clearFilters = () => {
    const next = new URLSearchParams();
    if (category !== "all") next.set("category", category);
    if (search) next.set("search", search);
    setParams(next);
    setShowFilters(false);
  };

  const setPage = (p) => {
    const next = new URLSearchParams(params);
    next.set("page", String(p));
    setParams(next);
  };

  const setSort = (e) => {
    const next = new URLSearchParams(params);
    next.set("sort", e.target.value);
    next.delete("page");
    setParams(next);
  };

  const showGrid = !loading && !error && data?.items?.length > 0;
  const showEmpty = !loading && !error && data?.items?.length === 0;
  const showSkeleton = loading && !data?.items?.length;

  return (
    <>
      <section className="hero hero-compact">
        <div className="container">
          <h2>Maktaba Jamaat e Islami Faisalabad</h2>
          <p>Your trusted place for Islamic books from leading Pakistani publishers</p>
        </div>
      </section>

      <div className="container page-layout">
        {showFilters && (
          <button
            type="button"
            className="filter-backdrop"
            aria-label="Close filters"
            onClick={() => setShowFilters(false)}
          />
        )}
        <div className={`sidebar-wrap ${showFilters ? "open" : ""}`}>
          <Sidebar
            filters={filters}
            values={draft}
            onChange={setDraft}
            onApply={applyFilters}
            onClear={clearFilters}
            onClose={() => setShowFilters(false)}
          />
        </div>

        <main id="products-section" ref={productsRef} className="products-main">
          <div className="collection-header">
            <h1>Collection: {CATEGORY_LABELS[category] || category}</h1>
            <div className="collection-meta">
              <span className="product-count">
                {loading && !data ? "Loading..." : `${data?.total ?? 0} products`}
              </span>
              <div className="toolbar-actions">
                <button
                  type="button"
                  className="btn btn-outline filter-toggle"
                  onClick={() => setShowFilters((v) => !v)}
                >
                  {showFilters ? "Hide filters" : "Filter & sort"}
                </button>
                <div className="sort-bar">
                  <label>
                    Sort:{" "}
                    <select value={sort} onChange={setSort}>
                      <option value="featured">Featured</option>
                      <option value="title-asc">A-Z</option>
                      <option value="title-desc">Z-A</option>
                      <option value="price-asc">Price ↑</option>
                      <option value="price-desc">Price ↓</option>
                      <option value="newest">Newest</option>
                    </select>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {error && <p className="error">{error}</p>}

          {loading && data?.items?.length > 0 && (
            <p className="loading-inline">Updating books...</p>
          )}

          {showSkeleton && (
            <div className="product-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          )}

          {showEmpty && <p className="empty">No products found. Try changing filters.</p>}

          {showGrid && (
            <>
              <div className={`product-grid ${loading ? "loading-blur" : ""}`}>
                {data.items.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
              <Pagination page={data.page} pages={data.pages} onChange={setPage} />
            </>
          )}
        </main>
      </div>
    </>
  );
}
