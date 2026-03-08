import Link from 'next/link';
import Image from 'next/image';
import { getCollections } from '@/lib/shopify';

export const revalidate = 60;

export default async function CategoriesPage() {
  const collections = await getCollections(50);

  return (
    <div className="page-container">
      <h1 className="page-title">All Categories</h1>
      <div className="category-list-grid">
        {collections.map((col) => (
          <Link href={`/category/${col.handle}`} key={col.id} className="category-list-card">
            {col.image?.url && (
              <div className="category-list-image">
                <Image
                  src={col.image.url}
                  alt={col.title}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-3">
              <h3 className="font-semibold text-sm text-blinkit-dark">{col.title}</h3>
              {col.description && (
                <p className="text-xs text-blinkit-muted mt-1 line-clamp-2">{col.description}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
