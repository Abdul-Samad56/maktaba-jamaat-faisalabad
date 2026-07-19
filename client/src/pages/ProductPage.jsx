import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Seo from "../components/Seo";
import { WHATSAPP_NUMBER } from "../components/WhatsAppFloat";
import { fetchProduct, formatPrice, imageUrl, peekProduct, wakeApi } from "../api";
import { fullTitle, primaryTitle, titleEn, titleUr } from "../bilingual";
import {
  productKeywords,
  productSeoDescription,
  productSeoTitle,
} from "../seoKeywords";
import { SITE_NAME, absoluteUrl } from "../siteConfig";
import { productPath } from "../productUrl";

function categorySearchPath(category) {
  if (!category) return "/";
  const map = {
    quran: "quran",
    para: "para",
    tarjuma: "tarjuma",
    hadees: "hadees",
    hadith: "hadees",
    fiqa: "fiqa",
    fiqh: "fiqa",
    tarikh: "tarikh",
    tafseer: "tafseer",
    seerat: "seerat",
    "dars-e-nizami": "dars-e-nizami",
  };
  const key = String(category).toLowerCase().trim();
  const id = map[key] || map[key.replace(/\s+/g, "-")];
  return id ? `/?category=${id}` : `/?search=${encodeURIComponent(category)}`;
}

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(() => peekProduct(id));
  const [loading, setLoading] = useState(!peekProduct(id));
  const [error, setError] = useState("");

  useEffect(() => {
    wakeApi();
    const cached = peekProduct(id);
    if (cached) {
      setProduct(cached);
      setLoading(false);
    } else {
      setLoading(true);
      setProduct(null);
    }
    setError("");
    let cancelled = false;
    fetchProduct(id)
      .then((p) => {
        if (!cancelled) setProduct(p);
      })
      .catch((e) => {
        if (!cancelled && !peekProduct(id)) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const seo = useMemo(() => {
    if (!product) return null;
    const path = productPath(product);
    const name = fullTitle(product);
    const en = titleEn(product);
    const ur = titleUr(product);
    const priceText = product.price > 0 ? formatPrice(product.price) : "";
    const title = productSeoTitle(product);
    const description = productSeoDescription(product, priceText);
    const keywords = productKeywords(product);
    const image = imageUrl(product);
    const catPath = categorySearchPath(product.category);
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Book",
      name: en || name,
      alternateName: [en, ur].filter(Boolean),
      ...(product.author ? { author: { "@type": "Person", name: product.author } } : {}),
      ...(product.isbn ? { isbn: product.isbn } : {}),
      ...(product.bookLanguage ? { inLanguage: product.bookLanguage } : {}),
      ...(product.pages ? { numberOfPages: String(product.pages) } : {}),
      ...(product.category ? { genre: product.category, about: product.category } : {}),
      ...(product.publisher || product.source
        ? {
            publisher: {
              "@type": "Organization",
              name: product.publisher || String(product.source).replace(/\s*Website$/i, ""),
            },
          }
        : {}),
      keywords,
      description,
      image: absoluteUrl(image),
      url: absoluteUrl(path),
      brand: { "@type": "Organization", name: SITE_NAME },
      offers: {
        "@type": "Offer",
        url: absoluteUrl(path),
        priceCurrency: "PKR",
        price: product.price > 0 ? Number(product.price) : undefined,
        availability: "https://schema.org/InStock",
        seller: { "@type": "Organization", name: SITE_NAME },
        itemCondition: "https://schema.org/NewCondition",
      },
    };
    const jsonLdExtra = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        {
          "@type": "ListItem",
          position: 2,
          name: product.category || "Books",
          item: absoluteUrl(catPath),
        },
        { "@type": "ListItem", position: 3, name, item: absoluteUrl(path) },
      ],
    };
    return { title, description, keywords, path, image, jsonLd, jsonLdExtra };
  }, [product]);

  if (loading && !product) return <p className="loading container">Loading...</p>;
  if (error && !product) return <p className="error container">{error}</p>;
  if (!product) return null;

  // Canonicalize /product/{id} → /product/{slug} when slug exists
  if (product.slug && id !== product.slug && id === String(product._id)) {
    return <Navigate to={productPath(product)} replace />;
  }

  const discount =
    product.onSale && product.regularPrice > product.price
      ? Math.round(((product.regularPrice - product.price) / product.regularPrice) * 100)
      : 0;

  const en = titleEn(product);
  const ur = titleUr(product);
  const name = fullTitle(product);

  const orderUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `السلام علیکم! میں "${name}" کتاب آرڈر کرنا چاہتا/چاہتی ہوں۔`
  )}`;

  return (
    <div className="container product-page">
      {seo && (
        <Seo
          title={seo.title}
          description={seo.description}
          keywords={seo.keywords}
          path={seo.path}
          image={seo.image}
          type="product"
          jsonLd={seo.jsonLd}
          jsonLdId="product-jsonld"
          jsonLdExtra={seo.jsonLdExtra}
          jsonLdExtraId="product-breadcrumb-jsonld"
        />
      )}
      <Link to="/" className="back-link">
        ← Back to collection
      </Link>
      <div className="product-detail">
        <div className="product-detail-image">
          <img
            src={imageUrl(product)}
            alt={`${name}${product.author ? ` — ${product.author}` : ""} | ${SITE_NAME} | Islamic book Faisalabad`}
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.target.src = "/placeholder-book.svg";
            }}
          />
          {discount > 0 && <span className="badge-sale">-{discount}%</span>}
        </div>
        <div className="product-detail-info">
          {en && ur && en !== ur ? (
            <>
              <h1>{en}</h1>
              <h1 className="product-title-ur product-detail-ur" lang="ur" dir="rtl">
                {ur}
              </h1>
            </>
          ) : (
            <h1 lang={ur && !en ? "ur" : undefined} dir={ur && !en ? "rtl" : undefined}>
              {primaryTitle(product)}
            </h1>
          )}
          {product.author && (
            <p>
              <strong>Author:</strong> {product.author}
            </p>
          )}
          {product.bookLanguage && (
            <p>
              <strong>Language:</strong> {product.bookLanguage}
            </p>
          )}
          {product.category && (
            <p>
              <strong>Category:</strong>{" "}
              <Link to={categorySearchPath(product.category)}>{product.category}</Link>
            </p>
          )}
          {product.pages && (
            <p>
              <strong>Pages:</strong> {product.pages}
            </p>
          )}
          {product.isbn && (
            <p>
              <strong>ISBN:</strong> {product.isbn}
            </p>
          )}
          <div className="product-price product-detail-price">
            <span className="price-current">{formatPrice(product.price)}</span>
            {product.onSale && product.regularPrice > product.price && (
              <span className="price-old">{formatPrice(product.regularPrice)}</span>
            )}
          </div>
          <div className="product-detail-actions">
            <a href={orderUrl} className="btn-cart" target="_blank" rel="noreferrer">
              Add to cart
            </a>
          </div>
          {product.description && (
            <div
              className="product-description"
              dangerouslySetInnerHTML={{ __html: product.description.slice(0, 2000) }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
