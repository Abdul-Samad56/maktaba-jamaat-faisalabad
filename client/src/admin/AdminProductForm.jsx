import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  EMPTY_PRODUCT,
  createAdminProduct,
  fetchAdminProduct,
  productToForm,
  updateAdminProduct,
} from "./adminApi";
import { imageUrl } from "../api";

const CATEGORIES = [
  "General",
  "Quran",
  "Tafseer",
  "Hadith",
  "Seerat un Nabi",
  "Dars e Nizami",
  "Children Books",
];

export default function AdminProductForm() {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isNew) return;
    setLoading(true);
    fetchAdminProduct(id)
      .then((p) => setForm(productToForm(p)))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (isNew) {
        await createAdminProduct(form);
      } else {
        await updateAdminProduct(id, form);
      }
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const preview = {
    localImage: form.localImage,
    image: form.image,
  };

  if (loading) return <p className="admin-muted">Loading book...</p>;

  return (
    <div className="admin-panel admin-form-page">
      <div className="admin-topbar">
        <h1>{isNew ? "Add New Book" : "Edit Book"}</h1>
        <Link to="/admin" className="admin-btn">
          ← Back
        </Link>
      </div>

      {error && <p className="admin-error">{error}</p>}

      <form className="admin-form" onSubmit={onSubmit}>
        <div className="admin-form-grid">
          <div className="admin-form-fields">
            <label>
              Title *
              <input value={form.title} onChange={(e) => set("title", e.target.value)} required />
            </label>

            <label>
              Author
              <input value={form.author} onChange={(e) => set("author", e.target.value)} />
            </label>

            <label>
              Publisher
              <input value={form.publisher} onChange={(e) => set("publisher", e.target.value)} />
            </label>

            <label>
              Source *
              <input value={form.source} onChange={(e) => set("source", e.target.value)} required />
            </label>

            <label>
              Category
              <select value={form.category} onChange={(e) => set("category", e.target.value)}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Language
              <input value={form.bookLanguage} onChange={(e) => set("bookLanguage", e.target.value)} />
            </label>

            <div className="admin-row-2">
              <label>
                Price (Rs.)
                <input
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                />
              </label>
              <label>
                Regular Price (Rs.)
                <input
                  type="number"
                  min="0"
                  value={form.regularPrice}
                  onChange={(e) => set("regularPrice", e.target.value)}
                />
              </label>
            </div>

            <div className="admin-checks">
              <label>
                <input
                  type="checkbox"
                  checked={form.available}
                  onChange={(e) => set("available", e.target.checked)}
                />{" "}
                In stock
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={form.onSale}
                  onChange={(e) => set("onSale", e.target.checked)}
                />{" "}
                On sale
              </label>
            </div>

            <label>
              ISBN
              <input value={form.isbn} onChange={(e) => set("isbn", e.target.value)} />
            </label>

            <label>
              Pages
              <input value={form.pages} onChange={(e) => set("pages", e.target.value)} />
            </label>

            <label>
              SKU
              <input value={form.sku} onChange={(e) => set("sku", e.target.value)} />
            </label>

            <label>
              Image URL
              <input value={form.image} onChange={(e) => set("image", e.target.value)} />
            </label>

            <label>
              Local image path
              <input
                value={form.localImage}
                onChange={(e) => set("localImage", e.target.value)}
                placeholder="e.g. Maktaba Islamia Website/1_book.jpg"
              />
            </label>

            <label>
              Product link
              <input value={form.productLink} onChange={(e) => set("productLink", e.target.value)} />
            </label>

            <label>
              Tags (comma separated)
              <input value={form.tags} onChange={(e) => set("tags", e.target.value)} />
            </label>

            <label>
              Description
              <textarea
                rows={5}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </label>
          </div>

          <aside className="admin-preview">
            <h3>Cover Preview</h3>
            <img src={imageUrl(preview)} alt="Preview" className="admin-preview-img" />
            <p className="admin-muted">
              Local path images are served from the پبلیشرز folder via /images/
            </p>
          </aside>
        </div>

        <div className="admin-form-actions">
          <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
            {saving ? "Saving..." : isNew ? "Add Book" : "Save Changes"}
          </button>
          <Link to="/admin" className="admin-btn">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
