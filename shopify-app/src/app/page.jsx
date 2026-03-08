import { getCollections, getBestSellers } from '@/lib/shopify';
import CategoryGrid from '@/components/CategoryGrid';
import BestSellers from '@/components/BestSellers';

export const revalidate = 60; // ISR: refresh every 60 seconds

export default async function HomePage() {
  const [collections, bestSellerGroups] = await Promise.all([
    getCollections(30),
    getBestSellers(60),
  ]);

  return (
    <div className="page-container">
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <p className="hero-tag">⚡ Delivery in 10 minutes</p>
          <h1 className="hero-title">Quickbee –<br />Your Store, Delivered Fast 🐝</h1>
          <p className="hero-subtitle">Fresh groceries, daily essentials & more — at your door in minutes</p>
        </div>
        <div className="hero-illustration">🐝</div>
      </div>

      {/* Categories */}
      <CategoryGrid collections={collections} />

      {/* Best Sellers */}
      <BestSellers groups={bestSellerGroups} />
    </div>
  );
}
