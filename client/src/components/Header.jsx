import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const CATEGORIES = [
  { id: "all", label: "All Books" },
  { id: "quran", label: "Quran" },
  { id: "tafseer", label: "Tafseer" },
  { id: "hadith", label: "Hadith" },
  { id: "seerat", label: "Seerat un Nabi" },
  { id: "dars-e-nizami", label: "Dars e Nizami" },
];

function scrollToProducts() {
  requestAnimationFrame(() => {
    document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

export default function Header() {
  const [params, setParams] = useSearchParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const category = params.get("category") || "all";
  const search = params.get("search") || "";

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const onSearch = (e) => {
    e.preventDefault();
    const q = e.target.search.value.trim();
    const next = new URLSearchParams(params);
    if (q) next.set("search", q);
    else next.delete("search");
    next.delete("page");
    setParams(next);
    setMenuOpen(false);
    scrollToProducts();
  };

  const onCategoryClick = () => {
    setMenuOpen(false);
    scrollToProducts();
  };

  return (
    <header className="header">
      <div className="header-top">
        <span className="header-top-text">
          Maktaba Jamaat e Islami Faisalabad — Islamic Books Catalog
        </span>
      </div>
      <div className="container header-main">
        <div className="header-row">
          <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
            <img src="/logo.png" alt="Maktaba Jamaat e Islami Faisalabad" className="logo-image" />
            <span className="logo-text">
              <span className="logo-line">Maktaba Jamaat e Islami</span>
              <strong>Faisalabad</strong>
            </span>
          </Link>
          <button
            type="button"
            className="menu-toggle"
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        <nav className={`nav ${menuOpen ? "open" : ""}`}>
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              to={c.id === "all" ? "/" : `/?category=${c.id}`}
              className={category === c.id ? "active" : ""}
              onClick={onCategoryClick}
            >
              {c.label}
            </Link>
          ))}
        </nav>

        <form className="search-box" onSubmit={onSearch}>
          <input name="search" type="search" placeholder="Search books..." defaultValue={search} />
          <button type="submit">Search</button>
        </form>
      </div>
    </header>
  );
}
