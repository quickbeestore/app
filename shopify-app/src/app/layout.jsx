import './globals.css';
import { Inter } from 'next/font/google';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import FloatingCart from '@/components/FloatingCart';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Quickbee – Delivery in Minutes',
  description: 'Get groceries, essentials & more delivered in minutes. Powered by Shopify.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="main-content">{children}</main>
            <FloatingCart />
            <BottomNav />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
