'use client';

import Image from 'next/image';
import Link from 'next/link';

// Fallback emoji icons mapped to category keywords (mirrors Android Constants.kt)
const CATEGORY_EMOJIS = {
  baby: '👶',
  vegetable: '🥦',
  fruit: '🍎',
  dairy: '🥛',
  breakfast: '🥞',
  munchies: '🍿',
  cold: '🥤',
  drinks: '🥤',
  instant: '🍜',
  frozen: '❄️',
  tea: '☕',
  coffee: '☕',
  bakery: '🍞',
  biscuit: '🍪',
  sweet: '🍬',
  atta: '🌾',
  rice: '🍚',
  dal: '🫘',
  dry: '🥜',
  masala: '🌶️',
  sauce: '🫙',
  spread: '🫙',
  chicken: '🍗',
  meat: '🥩',
  fish: '🐟',
  pan: '🌿',
  organic: '🌱',
  pharma: '💊',
  wellness: '🏥',
  cleaning: '🧹',
  home: '🏠',
  office: '🏢',
  personal: '🧴',
  pet: '🐾',
};

function getCategoryEmoji(title = '') {
  const lower = title.toLowerCase();
  for (const [key, emoji] of Object.entries(CATEGORY_EMOJIS)) {
    if (lower.includes(key)) return emoji;
  }
  return '🛒';
}

export default function CategoryGrid({ collections }) {
  if (!collections?.length) return null;

  return (
    <section className="section">
      <h2 className="section-title">Shop by Category</h2>
      <div className="category-grid">
        {collections.map((col) => (
          <Link href={`/category/${col.handle}`} key={col.id} className="category-card">
            <div className="category-image-wrap">
              {col.image?.url ? (
                <Image
                  src={col.image.url}
                  alt={col.image.altText || col.title}
                  fill
                  sizes="80px"
                  className="object-cover rounded-xl"
                />
              ) : (
                <span className="text-3xl">{getCategoryEmoji(col.title)}</span>
              )}
            </div>
            <span className="category-label">{col.title}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
