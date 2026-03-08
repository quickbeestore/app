'use client';

import { useState } from 'react';
import ProductCard from './ProductCard';

export default function BestSellers({ groups }) {
  const [expandedGroup, setExpandedGroup] = useState(null);

  if (!groups?.length) return null;

  return (
    <section className="section">
      <h2 className="section-title">Best Sellers</h2>
      <div className="space-y-8">
        {groups.map((group) => {
          const isExpanded = expandedGroup === group.id;
          const displayProducts = isExpanded ? group.products : group.products.slice(0, 6);

          return (
            <div key={group.id} className="best-seller-group">
              {/* Group header */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-blinkit-dark">{group.productType}</h3>
                {group.products.length > 6 && (
                  <button
                    className="see-all-btn"
                    onClick={() =>
                      setExpandedGroup(isExpanded ? null : group.id)
                    }
                  >
                    {isExpanded ? 'See less' : `See all (${group.products.length})`}
                  </button>
                )}
              </div>

              {/* Products grid */}
              <div className="products-grid">
                {displayProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
