export default function AdminFilters({ filters, values, onChange, onApply, onClear }) {
  if (!filters) return null;

  const set = (key, val) => onChange({ ...values, [key]: val });

  return (
    <aside className="admin-filters">
      <div className="admin-filters-head">
        <h3>Filters</h3>
      </div>

      <div className="admin-filter-group">
        <label>Publisher / Source</label>
        <select value={values.source || ""} onChange={(e) => set("source", e.target.value)}>
          <option value="">All sources</option>
          {(filters.sources || []).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="admin-filter-group">
        <label>Author</label>
        <select value={values.author || ""} onChange={(e) => set("author", e.target.value)}>
          <option value="">All authors</option>
          {(filters.authors || []).slice(0, 300).map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      <div className="admin-filter-group">
        <label>Publisher</label>
        <select value={values.publisher || ""} onChange={(e) => set("publisher", e.target.value)}>
          <option value="">All publishers</option>
          {(filters.publishers || []).slice(0, 300).map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div className="admin-filter-group">
        <label>Category</label>
        <select value={values.category || ""} onChange={(e) => set("category", e.target.value)}>
          <option value="">All categories</option>
          {(filters.categories || []).map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="admin-filter-group">
        <label>Language</label>
        <select value={values.language || ""} onChange={(e) => set("language", e.target.value)}>
          <option value="">All languages</option>
          {(filters.languages || []).map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>

      <div className="admin-filter-group">
        <label>Price (Rs.)</label>
        <div className="admin-price-row">
          <input
            type="number"
            placeholder="From"
            value={values.minPrice || ""}
            onChange={(e) => set("minPrice", e.target.value)}
          />
          <input
            type="number"
            placeholder="To"
            value={values.maxPrice || ""}
            onChange={(e) => set("maxPrice", e.target.value)}
          />
        </div>
      </div>

      <div className="admin-filter-group">
        <label>
          <input
            type="checkbox"
            checked={values.available === "true"}
            onChange={(e) => set("available", e.target.checked ? "true" : "")}
          />{" "}
          In stock only
        </label>
      </div>

      <div className="admin-filter-group">
        <label>
          <input
            type="checkbox"
            checked={values.onSale === "true"}
            onChange={(e) => set("onSale", e.target.checked ? "true" : "")}
          />{" "}
          On sale only
        </label>
      </div>

      <div className="admin-filter-actions">
        <button type="button" className="admin-btn admin-btn-primary" onClick={onApply}>
          Apply
        </button>
        <button type="button" className="admin-btn" onClick={onClear}>
          Clear
        </button>
      </div>
    </aside>
  );
}
