import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchProducts } from "../api";
import { API_BASE } from "../config";
import ProductCard from "../components/ProductCard";
import Seo from "../components/Seo";
import { SITE_NAME } from "../siteConfig";

/**
 * Shared landing page for /author/:slug and /publisher/:slug
 */
export default function EntityPage({ kind }) {
  const { slug } = useParams();
  const [entity, setEntity] = useState(null);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  const isAuthor = kind === "author";
  const apiBase = isAuthor ? "authors" : "publishers";

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    setPage(1);

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/${apiBase}/${encodeURIComponent(slug)}`, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(isAuthor ? "Author not found" : "Publisher not found");
        const data = await res.json();
        if (cancelled) return;
        setEntity(data);

        const products = await fetchProducts({
          [isAuthor ? "author" : "publisher"]: data.name,
          page: 1,
          limit: 24,
          sort: "featured",
        });
        if (cancelled) return;
        setItems(products?.items || []);
        setTotal(products?.total || 0);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load");
          setEntity(null);
          setItems([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug, apiBase, isAuthor]);

  useEffect(() => {
    if (!entity || page === 1) return;
    let cancelled = false;
    (async () => {
      try {
        const products = await fetchProducts({
          [isAuthor ? "author" : "publisher"]: entity.name,
          page,
          limit: 24,
          sort: "featured",
        });
        if (cancelled) return;
        setItems((prev) => [...prev, ...(products?.items || [])]);
        setTotal(products?.total || 0);
      } catch {
        /* ignore pagination errors */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [page, entity, isAuthor]);

  const label = isAuthor ? "Author" : "Publisher";
  const labelUr = isAuthor ? "مصنف" : "ناشر";
  const path = `/${isAuthor ? "author" : "publisher"}/${slug}`;
  const title = entity
    ? `${entity.name} — ${label} | ${SITE_NAME}`
    : `${label} | ${SITE_NAME}`;
  const description = entity
    ? `Browse Islamic books by ${label.toLowerCase()} ${entity.name} at ${SITE_NAME}. ${labelUr}: ${entity.name}`
    : `Browse Islamic books by ${label.toLowerCase()} at ${SITE_NAME}.`;

  return (
    <div className="container entity-page">
      <Seo
        title={title}
        description={description}
        keywords={`${entity?.name || ""}, ${label}, ${labelUr}, اسلامی کتب, ${SITE_NAME}`}
        path={path}
        jsonLd={
          entity
            ? {
                "@context": "https://schema.org",
                "@type": isAuthor ? "Person" : "Organization",
                name: entity.name,
                url: path,
              }
            : null
        }
      />

      <Link to="/" className="back-link">
        ← Back to collection
      </Link>

      {loading && !entity && <p className="loading">Loading…</p>}
      {error && <p className="error">{error}</p>}

      {entity && (
        <>
          <header className="entity-header">
            <p className="entity-eyebrow">
              {label} / {labelUr}
            </p>
            <h1 className="entity-title" dir="auto">
              {entity.name}
            </h1>
            <p className="entity-meta">
              {total} book{total === 1 ? "" : "s"} / کتابیں
            </p>
          </header>

          <section className="products-grid" id="products-section">
            {items.map((p, i) => (
              <ProductCard key={p._id || p.slug} product={p} priority={i < 4} />
            ))}
          </section>

          {!loading && items.length === 0 && (
            <p className="entity-empty">No books found for this {label.toLowerCase()}.</p>
          )}

          {items.length < total && (
            <div className="entity-more">
              <button type="button" className="btn-cart" onClick={() => setPage((p) => p + 1)}>
                Load more / مزید دیکھیں
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
