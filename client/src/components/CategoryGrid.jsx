import { Link, useSearchParams } from "react-router-dom";

const ITEMS = [
  {
    id: "quran",
    label: "قرآن و تفسیر",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 5.5c2.2-1.2 4.4-1.5 8-1.5s5.8.3 8 1.5V19c-2.2-1.1-4.4-1.4-8-1.4s-5.8.3-8 1.4V5.5z" />
        <path d="M12 4v13.6" />
      </svg>
    ),
  },
  {
    id: "hadees",
    label: "حدیث",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="8" r="3.2" />
        <path d="M5.5 19c1.4-3 3.7-4.5 6.5-4.5S17.1 16 18.5 19" />
      </svg>
    ),
  },
  {
    id: "seerat",
    label: "سیرت",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3l1.8 4.8L19 9.5l-4 3.2L16.4 18 12 15.2 7.6 18l1.4-5.3-4-3.2 5.2-1.7L12 3z" />
      </svg>
    ),
  },
  {
    id: "fiqa",
    label: "فقہ",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 4h10v16H7z" />
        <path d="M10 8h4M10 12h4M10 16h3" />
      </svg>
    ),
  },
  {
    id: "tarikh",
    label: "دعوت و اصلاح",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 18V8l8-4 8 4v10" />
        <path d="M9 18v-5h6v5" />
      </svg>
    ),
  },
  {
    id: "all",
    label: "بچوں کی کتابیں",
    search: "بچوں",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 19V7.5A2.5 2.5 0 0 1 8.5 5H18v14H8.5A2.5 2.5 0 0 0 6 21.5" />
        <path d="M10 9h5M10 12h5M10 15h3" />
      </svg>
    ),
  },
];

function scrollToProducts() {
  requestAnimationFrame(() => {
    document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

export default function CategoryGrid() {
  const [params] = useSearchParams();
  const active = params.get("category") || "all";
  const search = params.get("search") || "";

  return (
    <div className="container">
      <nav className="category-grid" aria-label="کتابوں کی اقسام" dir="rtl">
        {ITEMS.map((item) => {
          const to = item.search
            ? `/?search=${encodeURIComponent(item.search)}`
            : item.id === "all"
              ? "/"
              : `/?category=${item.id}`;
          const isActive = item.search ? search === item.search : !search && active === item.id;
          return (
            <Link
              key={item.label}
              to={to}
              className={`category-tile${isActive ? " active" : ""}`}
              onClick={scrollToProducts}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
