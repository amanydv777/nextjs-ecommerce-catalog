# CartCraft - Next.js E-Commerce Catalog with Multiple Rendering Strategies

**Author:** Aman Yadav  
**Date:** October 27, 2024 (Updated: October 28, 2024)

## Project Overview

**CartCraft** is a comprehensive Next.js e-commerce catalog application that demonstrates the four main rendering strategies in Next.js:
- **SSG (Static Site Generation)**
- **ISR (Incremental Static Regeneration)**
- **SSR (Server-Side Rendering)**
- **CSR (Client-Side Rendering)**

The application features a product catalog with full CRUD operations, real-time inventory management, and a modern, responsive UI built with TypeScript and Tailwind CSS.

## Features

✅ **TypeScript** - Full type safety throughout the application  
✅ **Next.js App Router** - Modern routing with React Server Components  
✅ **Tailwind CSS** - Beautiful, responsive UI design  
✅ **Product Images** - Optimized images with Next.js Image component  
✅ **Flipkart-Style Header** - Modern navigation with search bar  
✅ **Professional Footer** - Complete with links and copyright  
✅ **API Routes** - RESTful backend with authentication  
✅ **On-Demand ISR** - Automatic page revalidation on data updates  
✅ **Client-Side Search** - Real-time product filtering  
✅ **Inventory Management** - Low stock alerts and statistics  

## Installation

### Prerequisites
- Node.js 18.x or higher
- npm, yarn, pnpm, or bun

### Setup Instructions

1. **Clone the repository** (or navigate to the project directory)
   ```bash
   cd ecommerce-catalog
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```bash
   ADMIN_API_KEY=your-secret-api-key-here
   ```
   
   You can use any secret string as your API key. For testing, you can use: `your-secret-api-key-here`

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
ecommerce-catalog/
├── app/
│   ├── admin/              # Admin panel (CSR)
│   ├── dashboard/          # Inventory dashboard (SSR)
│   ├── products/[slug]/    # Product detail pages (ISR)
│   ├── api/
│   │   ├── products/       # Product CRUD endpoints
│   │   └── revalidate/     # On-demand ISR endpoint
│   ├── layout.tsx          # Root layout with navbar
│   └── page.tsx            # Home page (SSG)
├── components/
│   ├── Navbar.tsx          # Navigation component
│   ├── ProductCard.tsx     # Product display card
│   ├── ProductList.tsx     # Product list with search (client component)
│   └── SearchBar.tsx       # Search input component
├── data/
│   └── products.json       # Product data store
├── lib/
│   ├── data.ts             # Data access utilities
│   └── auth.ts             # API key validation
├── types/
│   └── product.ts          # TypeScript type definitions
└── .env.local              # Environment variables (create this)
```

## Rendering Strategies Explained

### 1. Home Page (`/`) - Static Site Generation (SSG)

**File:** `app/page.tsx`

**Why SSG?**
- The home page displays all products and is accessed frequently
- Product data doesn't change constantly
- Pre-rendering at build time provides the fastest possible page load
- Perfect for SEO optimization

**Implementation:**
```typescript
export default function Home() {
  const products = getProducts(); // Fetched at build time
  return <ProductList products={products} />;
}
```

**Features:**
- Client-side search and filtering (interactive without re-fetching)
- Category filtering
- Instant page loads from static HTML

### 2. Product Detail Pages (`/products/[slug]`) - Incremental Static Regeneration (ISR)

**File:** `app/products/[slug]/page.tsx`

**Why ISR?**
- Product details need to be fast (pre-rendered)
- But prices and inventory can change
- ISR provides the best of both worlds: speed + freshness
- Revalidates every 60 seconds automatically
- On-demand revalidation when products are updated

**Implementation:**
```typescript
export const revalidate = 60; // Revalidate every 60 seconds

export async function generateStaticParams() {
  const products = getProducts();
  return products.map((product) => ({ slug: product.slug }));
}
```

**Features:**
- All product pages pre-generated at build time
- Automatic regeneration every 60 seconds
- On-demand revalidation via API when admin updates products
- Shows last updated timestamp

### 3. Inventory Dashboard (`/dashboard`) - Server-Side Rendering (SSR)

**File:** `app/dashboard/page.tsx`

**Why SSR?**
- Dashboard needs real-time, accurate data
- Shows critical inventory statistics (low stock, total value)
- Data must be fresh on every request
- Not suitable for caching as it changes frequently

**Implementation:**
```typescript
export const dynamic = 'force-dynamic'; // Force SSR

export default function DashboardPage() {
  const stats = getInventoryStats(); // Fetched on every request
  const currentTime = new Date().toLocaleString();
  // ...
}
```

**Features:**
- Real-time inventory statistics
- Low stock alerts
- Out of stock tracking
- Total inventory value calculation
- Timestamp showing exact fetch time

### 4. Admin Panel (`/admin`) - Client-Side Rendering (CSR)

**File:** `app/admin/page.tsx`

**Why CSR?**
- Highly interactive page with forms and state management
- Requires authentication (API key)
- Frequent data mutations (add/update products)
- Better user experience with client-side state

**Implementation:**
```typescript
'use client';

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    fetchProducts(); // Client-side data fetching
  }, []);
  // ...
}
```

**Features:**
- Add new products
- Edit existing products
- Real-time form validation
- Client-side state management
- API key authentication
- Triggers on-demand ISR revalidation

## API Endpoints

### GET `/api/products`
Fetch all products.

**Response:**
```json
[
  {
    "id": "1",
    "name": "Product Name",
    "slug": "product-slug",
    "description": "Product description",
    "price": 99.99,
    "category": "Electronics",
    "inventory": 50,
    "lastUpdated": "2024-10-27T10:00:00.000Z"
  }
]
```

### GET `/api/products/[slug]`
Fetch a single product by slug.

**Response:**
```json
{
  "id": "1",
  "name": "Product Name",
  ...
}
```

### POST `/api/products`
Add a new product (requires API key).

**Headers:**
```
x-api-key: your-secret-api-key-here
```

**Body:**
```json
{
  "name": "New Product",
  "slug": "new-product",
  "description": "Description",
  "price": 99.99,
  "category": "Electronics",
  "inventory": 50
}
```

### PUT `/api/products/update/[id]`
Update an existing product (requires API key).

**Headers:**
```
x-api-key: your-secret-api-key-here
```

**Body:**
```json
{
  "price": 89.99,
  "inventory": 45
}
```

### POST `/api/revalidate`
Trigger on-demand ISR revalidation (requires API key).

**Query Parameters:**
- `path`: The path to revalidate (e.g., `/products/product-slug`)

## Data Flow

1. **Build Time (SSG/ISR)**
   - `getProducts()` reads from `data/products.json`
   - Static pages generated for home and all product detail pages

2. **Request Time (SSR)**
   - Dashboard fetches fresh data on every request
   - Ensures real-time accuracy

3. **Client Side (CSR)**
   - Admin panel fetches data via API after page load
   - User interactions trigger API calls
   - State managed with React hooks

4. **Data Mutations**
   - Admin adds/updates product → API route → JSON file updated
   - Triggers on-demand revalidation for affected ISR pages
   - Dashboard shows changes immediately (SSR)
   - Admin panel refetches data (CSR)

## Testing the Application

### Test SSG (Home Page)
1. Visit `http://localhost:3000`
2. View page source - you'll see fully rendered HTML
3. Use search and filters - no network requests
4. Build the app (`npm run build`) - pages pre-generated

### Test ISR (Product Pages)
1. Visit any product page (e.g., `/products/wireless-bluetooth-headphones`)
2. Note the "Last Updated" timestamp
3. Update the product in admin panel
4. Refresh the product page after 60 seconds or immediately if on-demand revalidation works
5. See updated data

### Test SSR (Dashboard)
1. Visit `/dashboard`
2. Note the "Last updated" timestamp
3. Refresh the page - timestamp updates
4. View page source - HTML is fully rendered
5. Update inventory in admin - dashboard reflects changes immediately

### Test CSR (Admin Panel)
1. Visit `/admin`
2. View page source - minimal HTML, data loaded client-side
3. Open browser DevTools Network tab
4. See API calls to `/api/products`
5. Add/edit products with API key: `your-secret-api-key-here`

## Challenges and Solutions

### Challenge 1: File-Based Data Storage
**Problem:** Managing concurrent writes to JSON file  
**Solution:** Synchronous file operations with proper error handling

### Challenge 2: On-Demand ISR Revalidation
**Problem:** Triggering revalidation when products are updated  
**Solution:** Created `/api/revalidate` endpoint called after mutations

### Challenge 3: Type Safety Across Client/Server
**Problem:** Ensuring consistent types between API and components  
**Solution:** Centralized TypeScript types in `types/product.ts`

### Challenge 4: API Key Security
**Problem:** Protecting admin routes  
**Solution:** Simple API key validation via headers, stored in environment variables

## Build and Deploy

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Deploy to Vercel
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variable: `ADMIN_API_KEY`
4. Deploy

The application is optimized for Vercel with automatic ISR support.

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React 19** - UI library
- **Node.js** - Runtime environment

## Contact

For questions or feedback, please reach out to amanydv770@gmail.com.

---

**Note:** This project was created as an educational demonstration of Next.js rendering strategies. It showcases best practices for building modern, performant web applications.
