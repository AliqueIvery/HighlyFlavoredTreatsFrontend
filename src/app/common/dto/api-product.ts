export interface ApiProduct {
  id: string;
  tenantId: string;      // e.g. "tnt_hft001"
  title: string;         // product title
  slug: string | null;   // SEO slug or null
  priceCents: number;    // price in cents
  currency: string;      // e.g. "USD"
  imageKey: string | null; // S3 object key
  stock: number;         // available stock
  createdAt: string; 
  description: string | null;    // ISO string from backend
}
