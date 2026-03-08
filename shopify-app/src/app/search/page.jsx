'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { searchProducts } from '@/lib/shopify';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  // Auto-search if query in URL
  useEffect(() => {
    if (initialQuery) {
      doSearch(initialQuery);
    }
  }, []); // eslint-disable-line

  async function doSearch(q) {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const products = await searchProducts(q, 24);
      setResults(products);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    router.replace(`/search?q=${encodeURIComponent(query.trim())}`, { scroll: false });
    startTransition(() => doSearch(query));
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Search</h1>

      {/* Search bar */}
      <form onSubmit={handleSubmit} className="search-page-form">
        <Search size={20} className="text-blinkit-muted absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Search "Fruits", "Milk", "Chips"...'
          className="search-page-input"
          autoFocus
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); setResults([]); setSearched(false); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-blinkit-muted"
          >
            <X size={18} />
          </button>
        )}
      </form>

      {/* Shimmer loading */}
      {loading && (
        <div className="products-grid mt-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="product-skeleton" />
          ))}
        </div>
      )}

      {/* Results */}
      {!loading && searched && results.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-blinkit-muted font-medium">No results for "{query}"</p>
          <p className="text-sm text-blinkit-muted mt-2">Try different keywords</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <>
          <p className="text-sm text-blinkit-muted mt-4 mb-2">{results.length} results for "{query}"</p>
          <div className="products-grid">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}

      {/* Empty state before search */}
      {!searched && !loading && (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">🛒</p>
          <p className="text-blinkit-muted font-medium">Start typing to find products</p>
        </div>
      )}
    </div>
  );
}
