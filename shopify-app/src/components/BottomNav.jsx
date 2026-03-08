'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Search, ClipboardList, User } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/',         label: 'Home',    Icon: Home },
  { href: '/category', label: 'Category', Icon: LayoutGrid },
  { href: '/search',   label: 'Search',   Icon: Search },
  { href: '/orders',   label: 'Orders',   Icon: ClipboardList },
  { href: '/profile',  label: 'Profile',  Icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map(({ href, label, Icon }) => {
        const active = pathname === href || (href !== '/' && pathname.startsWith(href));
        return (
          <Link href={href} key={href} className={`bottom-nav-item ${active ? 'active' : ''}`}>
            <Icon size={22} />
            <span className="bottom-nav-label">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
