'use client';

import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import CartDrawer from './CartDrawer';

export default function FloatingCart() {
  const { itemCount, totalAmount } = useCart();
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (itemCount === 0) return null;

  return (
    <>
      <button className="floating-cart" onClick={() => setDrawerOpen(true)}>
        <div className="flex items-center gap-3">
          <span className="floating-cart-count">{itemCount} items</span>
          <ShoppingCart size={20} />
        </div>
        <span className="floating-cart-price">₹{Number(totalAmount).toFixed(0)}</span>
      </button>

      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
