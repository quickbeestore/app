'use client';

import Image from 'next/image';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ product }) {
  const { addItem, incrementItem, decrementItem, getItemCount } = useCart();
  const count = getItemCount(product.variantId);

  const price = Number(product.price).toFixed(0);
  const compareAt = product.compareAtPrice ? Number(product.compareAtPrice).toFixed(0) : null;
  const discount = compareAt
    ? Math.round(((compareAt - price) / compareAt) * 100)
    : null;

  return (
    <div className="product-card">
      {/* Discount badge */}
      {discount && discount > 0 && (
        <span className="product-badge">{discount}% OFF</span>
      )}

      {/* Image */}
      <div className="product-image-wrap">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, 200px"
            className="object-contain p-2"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
            No image
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-xs text-blinkit-muted mb-1 truncate">{product.productType}</p>
        <h3 className="text-sm font-semibold text-blinkit-dark line-clamp-2 min-h-[2.5rem]">
          {product.title}
        </h3>

        {/* Price row */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-base font-bold text-blinkit-dark">₹{price}</span>
          {compareAt && (
            <span className="text-xs text-blinkit-muted line-through">₹{compareAt}</span>
          )}
        </div>

        {/* Add / Counter button */}
        {!product.available ? (
          <button className="btn-out-of-stock" disabled>Out of Stock</button>
        ) : count === 0 ? (
          <button
            className="btn-add"
            onClick={() => addItem(product.variantId)}
          >
            ADD
          </button>
        ) : (
          <div className="counter">
            <button
              className="counter-btn"
              onClick={() => decrementItem(product.variantId)}
            >
              −
            </button>
            <span className="counter-count">{count}</span>
            <button
              className="counter-btn"
              onClick={() => incrementItem(product.variantId)}
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
