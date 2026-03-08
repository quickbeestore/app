'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ShoppingCart, User, Search, MapPin, ChevronDown } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const router = useRouter();
  const { itemCount } = useCart();
  const { customer } = useAuth();
  const [query, setQuery] = useState('');

  function handleSearch(e) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link href="/" className="navbar-logo">
          <span className="logo-quickbee">Quick<span className="bee">bee</span></span>
          <span className="logo-tag">delivery in minutes</span>
        </Link>

        {/* Delivery location */}
        <button className="delivery-location">
          <MapPin size={16} className="text-[#1DB954]" />
          <span className="location-text">Deliver to <strong>Home</strong></span>
          <ChevronDown size={14} className="text-[#8A8A8E]" />
        </button>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="search-form">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder='Search "Milk"'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
        </form>

        {/* Actions */}
        <nav className="navbar-actions">
          <Link href="/cart" className="cart-btn">
            <ShoppingCart size={22} />
            {itemCount > 0 && (
              <span className="cart-badge">{itemCount}</span>
            )}
          </Link>

          <Link href={customer ? '/profile' : '/auth'} className="user-btn">
            <User size={22} />
            <span className="hidden sm:block text-sm font-medium">
              {customer ? customer.firstName || 'Account' : 'Login'}
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
