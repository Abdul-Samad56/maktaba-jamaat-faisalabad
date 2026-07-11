export default function Sidebar({ filters, values, onChange, onApply, onClear, onClose }) {
  if (!filters) return null;

  const set = (key, val) => onChange({ ...values, [key]: val });

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
        <label>Publisher / Source</label>
        <select value={values.source || ""} onChange={(e) => set("source", e.target.value)}>
          <option value="">All sources</option>
          {filters.sources.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Author</label>
        <select value={values.author || ""} onChange={(e) => set("author", e.target.value)}>
          <option value="">All authors</option>
          {filters.authors.slice(0, 200).map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Publisher</label>
        <select value={values.publisher || ""} onChange={(e) => set("publisher", e.target.value)}>
          <option value="">All publishers</option>
          {filters.publishers.slice(0, 200).map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Language</label>
        <select value={values.language || ""} onChange={(e) => set("language", e.target.value)}>
          <option value="">All languages</option>
          {filters.languages.map((l) => (
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
