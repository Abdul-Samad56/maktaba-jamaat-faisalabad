import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SITE_PHONE_DISPLAY } from "../siteConfig";
import { WHATSAPP_URL } from "./WhatsAppFloat";

const CATEGORIES = [
  { id: "all", label: "All Books" },
  { id: "quran", label: "Quran" },
  { id: "tafseer", label: "Tafseer" },
  { id: "para", label: "Para" },
  { id: "tarjuma", label: "Tarjuma" },
  { id: "hadees", label: "Hadees" },
  { id: "fiqa", label: "Fiqa" },
  { id: "tarikh", label: "Tarikh" },
  { id: "seerat", label: "Seerat" },
];

function scrollToProducts() {
  requestAnimationFrame(() => {
    document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function WhatsAppIcon() {
  return (
    <svg className="header-ticker-wa-icon" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M16 3C9.4 3 4 8.4 4 15c0 2.1.5 4.1 1.5 5.9L4 29l8.3-1.5c1.7.9 3.6 1.4 5.7 1.4 6.6 0 12-5.4 12-12S22.6 3 16 3zm0 22c-1.8 0-3.5-.5-5-1.3l-.4-.2-4.9.9.9-4.8-.2-.4A8.9 8.9 0 0 1 7 15c0-5 4-9 9-9s9 4 9 9-4 9-9 9zm4.9-6.7c-.3-.1-1.7-.8-2-1-.3-.1-.5-.1-.7.1l-.9 1.1c-.2.2-.4.2-.7.1-1-.5-1.9-1.1-2.7-1.9-1-1-1.8-2.1-2.4-3.3-.1-.2 0-.4.1-.5l.7-.8c.1-.1.2-.3.2-.4 0-.1 0-.3-.1-.4l-.9-2.2c-.2-.5-.5-.4-.7-.4h-.6c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.1 3c.1.2 2 3.1 4.8 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4 0-.1-.2-.2-.5-.3z"
      />
    </svg>
  );
}

function TickerMessage({ hidden = false }) {
  return (
    <p className="header-ticker-item" dir="rtl" aria-hidden={hidden || undefined}>
      <span>مکتبہ جماعت اسلامی فیصل آباد میں خوش آمدید</span>
      <span className="header-ticker-sep" aria-hidden="true">
        ◆
      </span>
      <span>آن لائن اسلامک بک سٹور</span>
      <span className="header-ticker-sep" aria-hidden="true">
        ◆
      </span>
      <span>آرڈر کرنے کے لیے رابطہ کیجئے</span>
      <span className="header-ticker-sep" aria-hidden="true">
        ◆
      </span>
      <span>حافظ عبدالصمد خٹک</span>
      <a
        className="header-ticker-wa"
        href={WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        tabIndex={hidden ? -1 : undefined}
        aria-label={`WhatsApp: ${SITE_PHONE_DISPLAY}`}
        onClick={(e) => e.stopPropagation()}
      >
        <WhatsAppIcon />
        <span dir="ltr">{SITE_PHONE_DISPLAY}</span>
      </a>
    </p>
  );
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
      <div className="header-top" role="region" aria-label="خوش آمدید پیغام">
        <div className="header-ticker">
          <div className="header-ticker-track">
            <TickerMessage />
            <TickerMessage hidden />
          </div>
        </div>
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
          <input name="search" type="search" placeholder="Search اردو / English..." defaultValue={search} />
          <button type="submit">Search</button>
        </form>
      </div>
    </header>
  );
}
