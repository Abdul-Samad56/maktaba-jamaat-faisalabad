import { Link, useSearchParams } from "react-router-dom";

export default function Pagination({ page, pages, onChange }) {
  const [params] = useSearchParams();
  if (pages <= 1) return null;

  const hrefFor = (n) => {
    const next = new URLSearchParams(params);
    if (n <= 1) next.delete("page");
    else next.set("page", String(n));
    const qs = next.toString();
    return qs ? `/?${qs}` : "/";
  };

  const nums = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(pages, page + 2);
  for (let i = start; i <= end; i++) nums.push(i);

  return (
    <nav className="pagination" aria-label="Pagination">
      {page > 1 ? (
        <Link
          to={hrefFor(page - 1)}
          rel="prev"
          onClick={(e) => {
            e.preventDefault();
            onChange(page - 1);
          }}
        >
          ‹
        </Link>
      ) : (
        <span className="pagination-disabled" aria-disabled="true">
          ‹
        </span>
      )}
      {nums.map((n) => (
        <Link
          key={n}
          to={hrefFor(n)}
          className={n === page ? "active" : ""}
          aria-current={n === page ? "page" : undefined}
          onClick={(e) => {
            e.preventDefault();
            onChange(n);
          }}
        >
          {n}
        </Link>
      ))}
      {page < pages ? (
        <Link
          to={hrefFor(page + 1)}
          rel="next"
          onClick={(e) => {
            e.preventDefault();
            onChange(page + 1);
          }}
        >
          ›
        </Link>
      ) : (
        <span className="pagination-disabled" aria-disabled="true">
          ›
        </span>
      )}
    </nav>
  );
}
