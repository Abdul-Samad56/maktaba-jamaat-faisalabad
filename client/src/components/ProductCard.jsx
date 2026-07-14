import { Link } from "react-router-dom";
import { WHATSAPP_NUMBER } from "./WhatsAppFloat";
import { formatPrice, imageUrl, prefetchProduct } from "../api";
import { fullTitle, primaryTitle, titleEn, titleUr } from "../bilingual";
import { productPath } from "../productUrl";

export default function ProductCard({ product, priority = false }) {
  const discount =
    product.onSale && product.regularPrice > product.price
      ? Math.round(((product.regularPrice - product.price) / product.regularPrice) * 100)
      : 0;

  const name = fullTitle(product);
  const en = titleEn(product);
  const ur = titleUr(product);
  const href = productPath(product);

  const orderUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `السلام علیکم! میں "${name}" کتاب آرڈر کرنا چاہتا/چاہتی ہوں۔`
  )}`;

  const warm = () => prefetchProduct(product.slug || product._id);

  return (
    <article className="product-card" onPointerEnter={warm} onFocus={warm}>
      <Link to={href} className="product-image">
        <img
          src={imageUrl(product)}
          alt={`${name}${product.author ? ` by ${product.author}` : ""} — buy online`}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "low"}
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.target.src = "/placeholder-book.svg";
          }}
        />
        {discount > 0 && <span className="badge-sale">-{discount}%</span>}
      </Link>
      <div className="product-body">
        <Link to={href} onFocus={warm} className="product-title-link">
          {en && ur && en !== ur ? (
            <>
              <h3 className="product-title">{en}</h3>
              <p className="product-title-ur" lang="ur" dir="rtl">
                {ur}
              </p>
            </>
          ) : (
            <h3 className={`product-title${ur && !en ? " product-title-ur-only" : ""}`} lang={ur && !en ? "ur" : undefined} dir={ur && !en ? "rtl" : undefined}>
              {primaryTitle(product)}
            </h3>
          )}
        </Link>
        {product.author && <p className="product-author">{product.author}</p>}
        <div className="product-price">
          <span className="price-current">{formatPrice(product.price)}</span>
          {product.onSale && product.regularPrice > product.price && (
            <span className="price-old">{formatPrice(product.regularPrice)}</span>
          )}
        </div>
        <a href={orderUrl} className="btn-cart" target="_blank" rel="noreferrer">
          Add to cart
        </a>
      </div>
    </article>
  );
}
