'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const {
    lines, totalAmount, itemCount,
    incrementItem, decrementItem, removeItem,
    checkoutUrl, loading,
  } = useCart();

  if (lines.length === 0) {
    return (
      <div className="page-container flex flex-col items-center justify-center min-h-[60vh] text-center">
        <ShoppingBag size={80} className="text-gray-200 mb-4" />
        <h2 className="text-xl font-bold text-blinkit-dark mb-2">Your cart is empty</h2>
        <p className="text-blinkit-muted mb-6">Add items to get started</p>
        <Link href="/" className="btn-green px-8 py-3 rounded-xl font-bold">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container max-w-2xl mx-auto">
      <h1 className="page-title">My Cart ({itemCount} items)</h1>

      {/* Item list */}
      <ul className="space-y-3 mb-6">
        {lines.map((line) => (
          <li key={line.lineId} className="cart-page-item">
            {/* Image */}
            <div className="cart-page-image">
              {line.image ? (
                <Image src={line.image} alt={line.title} fill sizes="80px" className="object-contain p-2" />
              ) : (
                <div className="w-full h-full bg-gray-100 rounded-xl" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-blinkit-dark text-sm line-clamp-2">{line.title}</p>
              {line.variantTitle !== 'Default Title' && (
                <p className="text-xs text-blinkit-muted">{line.variantTitle}</p>
              )}
              <p className="text-sm font-bold text-blinkit-green mt-1">
                ₹{Number(line.price).toFixed(0)} × {line.quantity}
              </p>
            </div>

            {/* Counter + remove */}
            <div className="flex flex-col items-end gap-2">
              <div className="counter">
                <button className="counter-btn" onClick={() => decrementItem(line.variantId)}>−</button>
                <span className="counter-count">{line.quantity}</span>
                <button className="counter-btn" onClick={() => incrementItem(line.variantId)}>+</button>
              </div>
              <button
                onClick={() => removeItem(line.lineId)}
                className="text-xs text-red-400 hover:text-red-600"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Bill summary */}
      <div className="bill-summary">
        <h3 className="font-bold text-blinkit-dark mb-3">Bill Summary</h3>
        <div className="flex justify-between text-sm text-blinkit-muted mb-2">
          <span>Item total</span>
          <span>₹{Number(totalAmount).toFixed(0)}</span>
        </div>
        <div className="flex justify-between text-sm text-blinkit-muted mb-2">
          <span>Delivery fee</span>
          <span className="text-blinkit-green font-medium">Free</span>
        </div>
        <div className="flex justify-between text-sm text-blinkit-muted mb-3">
          <span>Handling charge</span>
          <span>₹5</span>
        </div>
        <div className="border-t pt-3 flex justify-between font-bold text-blinkit-dark">
          <span>Grand Total</span>
          <span>₹{(Number(totalAmount) + 5).toFixed(0)}</span>
        </div>
      </div>

      {/* Checkout */}
      <a
        href={checkoutUrl || '#'}
        className="btn-green w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-lg mt-4"
      >
        Proceed to Checkout
        <ArrowRight size={20} />
      </a>

      {loading && (
        <p className="text-center text-xs text-blinkit-muted mt-3">Updating cart...</p>
      )}
    </div>
  );
}
