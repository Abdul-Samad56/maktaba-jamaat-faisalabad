import { Link } from "react-router-dom";
import { formatPrice, imageUrl } from "../api";

export default function ProductCard({ product }) {
  const discount =
    product.onSale && product.regularPrice > product.price
      ? Math.round(((product.regularPrice - product.price) / product.regularPrice) * 100)
      : 0;

  return (
    <article className="product-card">
      <Link to={`/product/${product._id}`} className="product-image">
        <img
          src={imageUrl(product)}
          alt={product.title}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.target.src = "/placeholder-book.svg";
          }}
        />
        {discount > 0 && <span className="badge-sale">-{discount}%</span>}
      </Link>
      <div className="product-body">
        <Link to={`/product/${product._id}`}>
          <h3 className="product-title">{product.title}</h3>
        </Link>
        {product.publisher && <p className="product-vendor">Vendor: {product.publisher}</p>}
        <div className="product-price">
          <span className="price-current">{formatPrice(product.price)}</span>
          {product.onSale && product.regularPrice > product.price && (
            <span className="price-old">{formatPrice(product.regularPrice)}</span>
          )}
        </div>
        <button type="button" className="btn-cart" disabled={!product.available}>
          {product.available ? "Add to cart" : "Sold out"}
        </button>
      </div>
    </article>
  );
}
