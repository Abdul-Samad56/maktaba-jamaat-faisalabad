import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";

/**
 * Shown when a search returns zero products.
 * Offers spelling suggestions, related authors, and similar books.
 */
export default function NoResults({
  query,
  empty,
  onSearch,
  highlightTerms = [],
}) {
  const spellings = empty?.suggestedSpellings || [];
  const authors = empty?.relatedAuthors || [];
  const similar = empty?.similarBooks || [];

  return (
    <div className="no-results" role="status">
      <div className="no-results-icon" aria-hidden="true">
        ⌕
      </div>
      <h3 className="no-results-title">No books found</h3>
      <p className="no-results-text">
        We couldn&apos;t find results for <strong>&ldquo;{query}&rdquo;</strong>.
        Try a different spelling or browse suggestions below.
      </p>
      <p className="no-results-text ur" lang="ur" dir="rtl">
        &ldquo;{query}&rdquo; کے لیے کوئی کتاب نہیں ملی۔ نیچے تجاویز دیکھیں۔
      </p>

      {spellings.length > 0 && (
        <div className="no-results-block">
          <h4>Did you mean?</h4>
          <div className="no-results-chips">
            {spellings.map((s) => (
              <button key={s} type="button" className="search-chip" onClick={() => onSearch?.(s)}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {authors.length > 0 && (
        <div className="no-results-block">
          <h4>Related authors</h4>
          <div className="no-results-chips">
            {authors.map((a) => (
              <button key={a} type="button" className="search-chip" onClick={() => onSearch?.(a)}>
                {a}
              </button>
            ))}
          </div>
        </div>
      )}

      {similar.length > 0 && (
        <div className="no-results-block">
          <h4>Similar books you may like</h4>
          <div className="product-grid no-results-grid">
            {similar.map((p) => (
              <ProductCard key={p._id} product={p} highlightTerms={highlightTerms} />
            ))}
          </div>
        </div>
      )}

      <p className="no-results-browse">
        <Link to="/">Browse all books</Link>
      </p>
    </div>
  );
}
