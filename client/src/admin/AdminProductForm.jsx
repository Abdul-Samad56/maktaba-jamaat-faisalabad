import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  EMPTY_PRODUCT,
  calcDiscountPercent,
  createAdminProduct,
  fetchAdminProduct,
  priceFromDiscount,
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

  const setRegularPrice = (val) => {
    setForm((f) => {
      const d = Number(f.discountPercent) || 0;
      const reg = Number(val) || 0;
      const next = { ...f, regularPrice: val };
      if (d > 0 && reg > 0) {
        next.price = priceFromDiscount(reg, d);
        next.onSale = true;
      }
      return next;
    });
  };

  const setPrice = (val) => {
    setForm((f) => {
      const reg = Number(f.regularPrice) || 0;
      const pr = Number(val) || 0;
      const d = calcDiscountPercent(reg, pr, true);
      return {
        ...f,
        price: val,
        discountPercent: d > 0 ? String(d) : "",
        onSale: d > 0 ? true : f.onSale,
      };
    });
  };

  const setDiscountPercent = (val) => {
    const d = Math.min(100, Math.max(0, Number(val) || 0));
    setForm((f) => {
      const reg = Number(f.regularPrice) || 0;
      const next = { ...f, discountPercent: val };
      if (d > 0 && reg > 0) {
        next.price = priceFromDiscount(reg, d);
        next.onSale = true;
      } else if (d === 0) {
        next.onSale = false;
      }
      return next;
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const { discountPercent: _drop, ...payload } = form;
    try {
      if (isNew) {
        await createAdminProduct(payload);
      } else {
        await updateAdminProduct(id, payload);
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
  const previewDiscount = calcDiscountPercent(form.regularPrice, form.price, form.onSale);

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
                Regular Price (Rs.) — اصل قیمت
                <input
                  type="number"
                  min="0"
                  value={form.regularPrice}
                  onChange={(e) => setRegularPrice(e.target.value)}
                />
              </label>
              <label>
                Sale Price (Rs.) — رعایت کے بعد
                <input
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </label>
            </div>

            <label>
              Discount % — رعایت (مثلاً 20 = -20% badge)
              <input
                type="number"
                min="0"
                max="100"
                value={form.discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
                placeholder="e.g. 20"
              />
            </label>
            <p className="admin-hint">
              Regular Price 1000 + Discount 20% → Sale Price 800 automatically. &quot;On sale&quot; is
              checked when discount is set.
            </p>

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
            <div className="admin-preview-cover">
              <img src={imageUrl(preview)} alt="Preview" className="admin-preview-img" />
              {previewDiscount > 0 && <span className="badge-sale">-{previewDiscount}%</span>}
            </div>
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
