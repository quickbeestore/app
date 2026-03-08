'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { flattenEdges } from '@/lib/shopify';
import { Package, ChevronRight } from 'lucide-react';

const STATUS_COLORS = {
  FULFILLED:   'bg-green-100 text-green-700',
  UNFULFILLED: 'bg-yellow-100 text-yellow-700',
  PARTIALLY_FULFILLED: 'bg-blue-100 text-blue-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

export default function OrdersPage() {
  const { customer, loading } = useAuth();

  if (loading) {
    return (
      <div className="page-container">
        <h1 className="page-title">My Orders</h1>
        <div className="space-y-3 mt-4">
          {[1,2,3].map(i => <div key={i} className="order-skeleton" />)}
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="page-container flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Package size={80} className="text-gray-200 mb-4" />
        <h2 className="text-xl font-bold text-blinkit-dark mb-2">No orders yet</h2>
        <p className="text-blinkit-muted mb-6">Login to see your order history</p>
        <Link href="/auth" className="btn-green px-8 py-3 rounded-xl font-bold">Login</Link>
      </div>
    );
  }

  const orders = flattenEdges(customer.orders);

  if (orders.length === 0) {
    return (
      <div className="page-container flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Package size={80} className="text-gray-200 mb-4" />
        <h2 className="text-xl font-bold text-blinkit-dark mb-2">No orders yet</h2>
        <p className="text-blinkit-muted mb-6">Start shopping to see your orders here</p>
        <Link href="/" className="btn-green px-8 py-3 rounded-xl font-bold">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="page-container max-w-2xl mx-auto">
      <h1 className="page-title">My Orders</h1>
      <ul className="space-y-4 mt-4">
        {orders.map((order) => {
          const statusColor = STATUS_COLORS[order.fulfillmentStatus] || 'bg-gray-100 text-gray-600';
          const items = flattenEdges(order.lineItems);
          const date = new Date(order.processedAt).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric',
          });

          return (
            <li key={order.id} className="order-card">
              {/* Order header */}
              <div className="order-card-header">
                <div>
                  <p className="font-bold text-blinkit-dark">{order.name}</p>
                  <p className="text-xs text-blinkit-muted mt-0.5">{date}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`order-status-badge ${statusColor}`}>
                    {order.fulfillmentStatus?.replace(/_/g, ' ')}
                  </span>
                  <span className="text-sm font-bold text-blinkit-dark">
                    ₹{Number(order.currentTotalPrice.amount).toFixed(0)}
                  </span>
                </div>
              </div>

              {/* Items preview */}
              <div className="order-items-preview">
                {items.slice(0, 4).map((item, i) => (
                  <div key={i} className="order-item-chip">
                    {item.variant?.image?.url && (
                      <div className="order-item-image">
                        <Image
                          src={item.variant.image.url}
                          alt={item.title}
                          fill sizes="36px"
                          className="object-contain p-0.5"
                        />
                      </div>
                    )}
                    <span className="text-xs text-blinkit-dark">{item.title}</span>
                    <span className="text-xs text-blinkit-muted">×{item.quantity}</span>
                  </div>
                ))}
                {items.length > 4 && (
                  <span className="text-xs text-blinkit-muted self-center">
                    +{items.length - 4} more
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
