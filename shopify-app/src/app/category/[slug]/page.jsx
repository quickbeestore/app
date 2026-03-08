import { getCollectionProducts } from '@/lib/shopify';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  return { title: `${params.slug.replace(/-/g, ' ')} – Blinkit Store` };
}

export default async function CategoryPage({ params }) {
  const data = await getCollectionProducts(params.slug, 40);

  if (!data) {
    return (
      <div className="page-container text-center py-16">
        <p className="text-blinkit-muted text-lg">Category not found.</p>
        <Link href="/category" className="btn-green mt-4 inline-block px-6 py-2 rounded-xl">
          Browse Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Back button */}
      <Link href="/category" className="back-btn">
        <ChevronLeft size={20} />
        <span>Back</span>
      </Link>

      {/* Header */}
      <div className="category-header">
        <h1 className="page-title">{data.title}</h1>
        {data.description && (
          <p className="text-blinkit-muted text-sm mt-1">{data.description}</p>
        )}
        <p className="text-xs text-blinkit-muted mt-2">{data.products.length} products</p>
      </div>

      {data.products.length === 0 ? (
        <p className="text-blinkit-muted text-center py-12">No products in this category yet.</p>
      ) : (
        <div className="products-grid mt-4">
          {data.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
