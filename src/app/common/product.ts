export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  slug?: string;
  stock?: number;
  imageKey?: string;
}
