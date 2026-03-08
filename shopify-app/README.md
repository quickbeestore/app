# 🐝 Quickbee – Shopify Storefront

A fast, mobile-first grocery delivery storefront built with **Next.js 14** and the **Shopify Storefront API**.
Inspired by the Blinkit app experience — categories, best sellers, cart, orders, and user auth — all connected to your Shopify store.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🏠 Home | Hero banner, category grid, best sellers grouped by product type |
| 🗂️ Categories | Browse all Shopify collections |
| 🔍 Search | Real-time product search via Storefront API |
| 🛒 Cart | Add / increment / decrement items, floating cart bar, drawer |
| 📦 Orders | View order history (requires customer login) |
| 👤 Auth | Login & Sign Up with Shopify Customer API |
| 📱 Mobile | Bottom navigation bar, responsive grid |

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/quickbee-shopify.git
cd quickbee-shopify
npm install
```

### 2. Set Up Environment Variables

Copy the example file and fill in your Shopify credentials:

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in:

```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_token
SHOPIFY_ADMIN_API_ACCESS_TOKEN=your_admin_token
NEXT_PUBLIC_SHOPIFY_API_VERSION=2024-01
```

### 3. Get Your Shopify Credentials

#### Storefront API Token (public)
1. Go to your Shopify Admin → **Apps** → **Develop apps**
2. Create a new app → **Configure Storefront API scopes**
3. Enable: `unauthenticated_read_product_listings`, `unauthenticated_read_checkouts`, `unauthenticated_write_checkouts`, `unauthenticated_read_customers`, `unauthenticated_write_customers`
4. Copy the **Storefront API access token**

#### Admin API Token (server-side only)
1. Same app → **Configure Admin API scopes**
2. Enable: `read_orders`, `read_customers`
3. Copy the **Admin API access token**

### 4. Run Locally

```bash
npm run dev
# → http://localhost:3000
```

---

## 🌐 Deploy to Vercel (Recommended)

The easiest way to connect with your Shopify store via GitHub:

1. Push this folder to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import from GitHub
3. Set the **Root Directory** to `shopify-app`
4. Add all environment variables from `.env.local`
5. Click **Deploy** ✅

Your Quickbee store will be live and auto-deploy on every GitHub push!

---

## 📁 Project Structure

```
shopify-app/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.jsx            # 🏠 Home
│   │   ├── category/
│   │   │   ├── page.jsx        # 🗂️ All categories
│   │   │   └── [slug]/page.jsx # 📋 Category products
│   │   ├── search/page.jsx     # 🔍 Search
│   │   ├── cart/page.jsx       # 🛒 Cart
│   │   ├── orders/page.jsx     # 📦 Orders
│   │   ├── profile/page.jsx    # 👤 Profile
│   │   └── auth/page.jsx       # 🔐 Login / Sign Up
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── BottomNav.jsx
│   │   ├── ProductCard.jsx
│   │   ├── CategoryGrid.jsx
│   │   ├── BestSellers.jsx
│   │   ├── CartDrawer.jsx
│   │   └── FloatingCart.jsx
│   ├── context/
│   │   ├── CartContext.jsx     # Cart state (Shopify Cart API)
│   │   └── AuthContext.jsx     # Customer auth state
│   └── lib/
│       └── shopify.js          # All Shopify GraphQL queries
├── .env.example
├── .gitignore
├── next.config.js
├── tailwind.config.js
└── package.json
```

---

## 🎨 Brand Colors (Quickbee)

| Token | Hex | Use |
|---|---|---|
| Yellow | `#FFC107` | Logo accent, highlights |
| Green | `#1DB954` | CTA buttons, stock, active nav |
| Orange | `#FF6B35` | Discount badges |
| Dark | `#1C1C1E` | Text |
| Light BG | `#FFFDF5` | Page background |

---

## 🔧 Tech Stack

- **Next.js 14** (App Router, ISR)
- **Shopify Storefront API** (GraphQL)
- **Tailwind CSS 3**
- **Lucide React** icons
- **js-cookie** for cart/auth persistence

---

> Built with ❤️ — Connect to any Shopify store in minutes.
