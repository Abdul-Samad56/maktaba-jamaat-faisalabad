export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;

  const nums = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(pages, page + 2);
  for (let i = start; i <= end; i++) nums.push(i);

  return (
    <nav className="pagination" aria-label="Pagination">
      <button type="button" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        ‹
      </button>
      {nums.map((n) => (
        <button
          key={n}
          type="button"
          className={n === page ? "active" : ""}
          onClick={() => onChange(n)}
        >
          {n}
        </button>
      ))}
      <button type="button" disabled={page >= pages} onClick={() => onChange(page + 1)}>
        ›
      </button>
    </nav>
  );
}
