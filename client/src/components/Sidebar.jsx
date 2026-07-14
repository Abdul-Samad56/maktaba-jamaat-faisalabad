export default function Sidebar({ filters, values, onChange, onApply, onClear, onClose }) {
  if (!filters) return null;

  const set = (key, val) => onChange({ ...values, [key]: val });
  const categories = filters.categories || [];

  return (
    <aside className="sidebar">
      <div className="sidebar-head">
        <h3>Filter</h3>
        {onClose && (
          <button type="button" className="sidebar-close" onClick={onClose} aria-label="Close filters">
            ✕
          </button>
        )}
      </div>

      <div className="filter-group">
        <label>Category</label>
        <select value={values.category || "all"} onChange={(e) => set("category", e.target.value)}>
          {categories.map((c) => (
            <option key={c.id || c} value={c.id || c}>
              {c.label || c}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Author</label>
        <select value={values.author || ""} onChange={(e) => set("author", e.target.value)}>
          <option value="">All authors</option>
          {(filters.authors || []).slice(0, 200).map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
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

      <div className="filter-group">
        <label>Price (Rs.)</label>
        <div className="price-row">
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

      <div className="filter-group">
        <label>
          <input
            type="checkbox"
            checked={values.onSale === "true"}
            onChange={(e) => set("onSale", e.target.checked ? "true" : "")}
          />{" "}
          On sale only
        </label>
      </div>

      <div className="filter-group">
        <label>
          <input
            type="checkbox"
            checked={values.available === "true"}
            onChange={(e) => set("available", e.target.checked ? "true" : "")}
          />{" "}
          In stock only
        </label>
      </div>

      <div className="filter-actions">
        <button type="button" className="btn btn-primary" onClick={onApply}>
          Apply
        </button>
        <button type="button" className="btn btn-outline" onClick={onClear}>
          Clear
        </button>
      </div>
    </aside>
  );
}
