export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  inStock: boolean;
  stockQuantity: number;
  specifications?: Record<string, string>;
};
