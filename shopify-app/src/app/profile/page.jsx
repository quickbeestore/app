'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, MapPin, Package, LogOut, ChevronRight, Phone } from 'lucide-react';

export default function ProfilePage() {
  const { customer, loading, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push('/');
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="profile-skeleton" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="page-container flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-24 h-24 rounded-full bg-blinkit-gray flex items-center justify-center mb-4">
          <User size={48} className="text-blinkit-muted" />
        </div>
        <h2 className="text-xl font-bold text-blinkit-dark mb-2">Hello, Guest!</h2>
        <p className="text-blinkit-muted mb-6">Login to manage your orders and profile</p>
        <Link href="/auth" className="btn-green px-10 py-3 rounded-xl font-bold text-lg">
          Login / Sign Up
        </Link>
      </div>
    );
  }

  const addr = customer.defaultAddress;

  return (
    <div className="page-container max-w-lg mx-auto">
      {/* Avatar & Name */}
      <div className="profile-header">
        <div className="avatar">
          <span className="avatar-initials">
            {(customer.firstName?.[0] || '?').toUpperCase()}
          </span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-blinkit-dark">
            {customer.firstName} {customer.lastName}
          </h1>
          <p className="text-sm text-blinkit-muted">{customer.email}</p>
          {customer.phone && (
            <p className="text-sm text-blinkit-muted flex items-center gap-1 mt-0.5">
              <Phone size={13} /> {customer.phone}
            </p>
          )}
        </div>
      </div>

      {/* Menu */}
      <nav className="profile-menu">
        <Link href="/orders" className="profile-menu-item">
          <Package size={20} className="text-blinkit-green" />
          <span>My Orders</span>
          <ChevronRight size={16} className="ml-auto text-blinkit-muted" />
        </Link>

        {addr && (
          <div className="profile-menu-item">
            <MapPin size={20} className="text-blinkit-orange" />
            <div className="flex-1">
              <p className="text-sm font-medium">Saved Address</p>
              <p className="text-xs text-blinkit-muted">
                {[addr.address1, addr.city, addr.province, addr.country].filter(Boolean).join(', ')}
              </p>
            </div>
            <ChevronRight size={16} className="text-blinkit-muted" />
          </div>
        )}

        <button onClick={handleLogout} className="profile-menu-item text-red-500">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
}
