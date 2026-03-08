'use client';

import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartDrawer({ open, onClose }) {
  const { lines, totalAmount, currencyCode, itemCount, incrementItem, decrementItem, removeItem, checkoutUrl } = useCart();

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="cart-backdrop" onClick={onClose} />

      {/* Drawer */}
      <aside className="cart-drawer">
        <div className="cart-header">
          <h2 className="text-lg font-bold">My Cart ({itemCount})</h2>
          <button onClick={onClose} className="cart-close-btn">
            <X size={20} />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="cart-empty">
            <ShoppingBag size={64} className="text-gray-200 mx-auto mb-4" />
            <p className="text-blinkit-muted font-medium">Your cart is empty</p>
            <button onClick={onClose} className="btn-green mt-4 px-6">
              Browse Products
            </button>
          </div>
        ) : (
          <>
            {/* Items */}
            <ul className="cart-items">
              {lines.map((line) => (
                <li key={line.lineId} className="cart-item">
                  <div className="cart-item-image">
                    {line.image ? (
                      <Image src={line.image} alt={line.title} fill sizes="64px" className="object-contain p-1" />
                    ) : (
                      <div className="w-full h-full bg-gray-100 rounded" />
                    )}
                  </div>

                  <div className="cart-item-info">
                    <p className="text-sm font-semibold line-clamp-2">{line.title}</p>
                    {line.variantTitle !== 'Default Title' && (
                      <p className="text-xs text-blinkit-muted">{line.variantTitle}</p>
                    )}
                    <p className="text-sm font-bold text-blinkit-dark mt-1">
                      ₹{Number(line.lineTotal).toFixed(0)}
                    </p>
                  </div>

                  {/* Counter */}
                  <div className="counter ml-auto">
                    <button className="counter-btn" onClick={() => decrementItem(line.variantId)}>−</button>
                    <span className="counter-count">{line.quantity}</span>
                    <button className="counter-btn" onClick={() => incrementItem(line.variantId)}>+</button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Footer */}
            <div className="cart-footer">
              <div className="flex justify-between text-sm text-blinkit-muted mb-1">
                <span>Item total</span>
                <span>₹{Number(totalAmount).toFixed(0)}</span>
              </div>
              <div className="flex justify-between font-bold text-blinkit-dark mb-4">
                <span>Total</span>
                <span>₹{Number(totalAmount).toFixed(0)}</span>
              </div>
              <a href={checkoutUrl || '#'} className="btn-green w-full text-center block py-3 rounded-xl font-bold">
                Proceed to Checkout →
              </a>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
