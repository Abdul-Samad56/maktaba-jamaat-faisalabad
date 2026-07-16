import { splitHighlight } from "../utils/highlight";

/** Renders text with <mark> around matched search terms. */
export default function SearchHighlight({ text, terms = [], className = "" }) {
  const parts = splitHighlight(text, terms);
  return (
    <span className={className}>
      {parts.map((p, i) =>
        p.match ? (
          <mark key={i} className="search-mark">
            {p.text}
          </mark>
        ) : (
          <span key={i}>{p.text}</span>
        )
      )}
    </span>
  );
}
