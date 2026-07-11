import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { WHATSAPP_NUMBER } from "../components/WhatsAppFloat";
import { fetchProduct, formatPrice, imageUrl } from "../api";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchProduct(id)
      .then(setProduct)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="loading container">Loading...</p>;
  if (error) return <p className="error container">{error}</p>;
  if (!product) return null;

  const discount =
    product.onSale && product.regularPrice > product.price
      ? Math.round(((product.regularPrice - product.price) / product.regularPrice) * 100)
      : 0;

  const orderUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `السلام علیکم! میں "${product.title}" کتاب آرڈر کرنا چاہتا/چاہتی ہوں۔`
  )}`;

  return (
    <div className="container product-page">
      <Link to="/" className="back-link">
        ← Back to collection
      </Link>
      <div className="product-detail">
        <div className="product-detail-image">
          <img
            src={imageUrl(product)}
            alt={product.title}
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.target.src = "/placeholder-book.svg";
            }}
          />
          {discount > 0 && <span className="badge-sale">-{discount}%</span>}
        </div>
        <div className="product-detail-info">
          <h1>{product.title}</h1>
          {product.author && (
            <p>
              <strong>Author:</strong> {product.author}
            </p>
          )}
          {product.publisher && (
            <p>
              <strong>Publisher:</strong> {product.publisher}
            </p>
          )}
          {product.source && (
            <p>
              <strong>Source:</strong> {product.source}
            </p>
          )}
          {product.bookLanguage && (
            <p>
              <strong>Language:</strong> {product.bookLanguage}
            </p>
          )}
          {product.category && (
            <p>
              <strong>Category:</strong> {product.category}
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
            <button type="button" className="btn-cart" disabled={!product.available}>
              {product.available ? "Add to cart" : "Sold out"}
            </button>
            <a href={orderUrl} className="btn btn-whatsapp" target="_blank" rel="noreferrer">
              WhatsApp پر آرڈر
            </a>
          </div>
          {product.description && (
            <div
              className="product-description"
              dangerouslySetInnerHTML={{ __html: product.description.slice(0, 2000) }}
            />
          )}
          {product.productLink && (
            <p className="product-external-link">
              <a href={product.productLink} target="_blank" rel="noreferrer">
                View on original store →
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
